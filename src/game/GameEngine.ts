import * as THREE from 'three';
import { TextureLibrary } from '../graphics/textures';
import { ModelFactory, SteveRig } from '../graphics/models';
import { ActivePowerUp, GameStats, Lane, ObstacleType, PowerUpType } from '../types/game';
import { soundManager } from '../audio/soundManager';

const CHUNK_SIZE = 28;
const NUM_CHUNKS = 10;
const LANE_WIDTH = 2.6; // Lane X: -2.6, 0, 2.6
const BASE_SPEED = 20;

export interface EngineCallbacks {
  onStatsUpdate: (stats: GameStats) => void;
  onPowerUpsUpdate: (powerUps: ActivePowerUp[]) => void;
  onGameOver: (finalStats: GameStats) => void;
  onMilestone: (message: string) => void;
}

interface WorldChunk {
  group: THREE.Group;
  index: number;
  zPos: number;
  obstacles: THREE.Group[];
  collectibles: THREE.Group[];
}

export class GameEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private callbacks: EngineCallbacks;

  private textures: TextureLibrary;
  private models: ModelFactory;
  private steve: SteveRig;

  // Game Loop State
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private clock: THREE.Clock;
  private animFrameId: number = 0;

  // Player Physics & Movement
  private playerX: number = 0;
  private targetLane: Lane = 0;
  private playerY: number = 0;
  private velocityY: number = 0;
  private isJumping: boolean = false;
  private isSliding: boolean = false;
  private slideTimer: number = 0;
  private distanceTraveled: number = 0;
  private currentSpeed: number = BASE_SPEED;
  private runCycleTime: number = 0;
  private bankAngle: number = 0;

  // Invulnerability & Grace
  private graceTimer: number = 2.5; // 2.5s start grace
  private shieldActive: boolean = false;
  private activePowerUps: Map<PowerUpType, { remaining: number; total: number }> = new Map();

  // Score & Stats
  private score: number = 0;
  private emeralds: number = 0;
  private highScore: number = 0;
  private nearMisses: number = 0;
  private lastMilestoneDistance: number = 0;

  // Chunks & World
  private chunks: WorldChunk[] = [];
  private nextChunkIndex: number = 0;

  // Particles
  private particlesGroup: THREE.Group;
  private particles: { mesh: THREE.Mesh; vx: number; vy: number; vz: number; life: number; maxLife: number }[] = [];

  // Lighting & Camera Shake
  private dirLight: THREE.DirectionalLight;
  private cameraShake: number = 0;
  private reducedMotion: boolean = false;

  constructor(container: HTMLElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // Load High Score
    const saved = localStorage.getItem('minerunner_high_score');
    if (saved) {
      this.highScore = parseInt(saved, 10) || 0;
    }

    // 1. Scene & Atmosphere (Jungle emerald haze)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8); // Vibrant sky
    this.scene.fog = new THREE.FogExp2(0x5eead4, 0.015); // Lush atmospheric horizon fog

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 120);
    this.camera.position.set(0, 4.2, 5.5);
    this.camera.lookAt(0, 1.4, -6.0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x166534, 0.7);
    this.scene.add(hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    this.dirLight.position.set(15, 25, 10);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 1;
    this.dirLight.shadow.camera.far = 70;
    const d = 16;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // 5. Initialize Textures & Models
    this.textures = new TextureLibrary();
    this.models = new ModelFactory(this.textures);

    // 6. Build Steve
    this.steve = this.models.createSteve();
    this.scene.add(this.steve.group);

    // 7. Particles Group
    this.particlesGroup = new THREE.Group();
    this.scene.add(this.particlesGroup);

    // 8. Build Initial Chunks
    this.initWorldChunks();

    // 9. Resize Listener
    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
  }

  // ---------------- WORLD CHUNK GENERATION ----------------

  private initWorldChunks() {
    for (let i = 0; i < NUM_CHUNKS; i++) {
      const zPos = -i * CHUNK_SIZE;
      const chunk = this.createChunk(zPos, i);
      this.chunks.push(chunk);
      this.scene.add(chunk.group);
      this.nextChunkIndex++;
    }
  }

  private createChunk(zPos: number, index: number): WorldChunk {
    const chunkGroup = new THREE.Group();
    chunkGroup.position.z = zPos;

    // 1. Track Floor (9 units wide, CHUNK_SIZE long)
    // 1:1 Minecraft Grass Top Texture with RepeatWrapping
    const topTexture = this.textures.grassTop.clone();
    topTexture.wrapS = THREE.RepeatWrapping;
    topTexture.wrapT = THREE.RepeatWrapping;
    topTexture.repeat.set(9, CHUNK_SIZE);

    const floorGeo = new THREE.PlaneGeometry(9.0, CHUNK_SIZE);
    const floorMat = new THREE.MeshLambertMaterial({ map: topTexture });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    chunkGroup.add(floorMesh);

    // 2. Track Curbs / Borders (Mossy Cobblestone Edge)
    const curbGeo = new THREE.BoxGeometry(0.5, 0.3, CHUNK_SIZE);
    const curbMat = new THREE.MeshLambertMaterial({ map: this.textures.mossyCobblestone });
    const curbL = new THREE.Mesh(curbGeo, curbMat);
    curbL.position.set(-4.75, 0.1, 0);
    curbL.receiveShadow = true;
    const curbR = new THREE.Mesh(curbGeo, curbMat);
    curbR.position.set(4.75, 0.1, 0);
    curbR.receiveShadow = true;
    chunkGroup.add(curbL, curbR);

    // 3. JUNGLE SIDE BORDERS (Left and Right Scenery)
    // As requested: "make the side borders have some jungle behind it"
    this.populateJungleScenery(chunkGroup);

    // 4. Obstacles & Collectibles (Skip first 2 chunks at start for runway)
    const obstacles: THREE.Group[] = [];
    const collectibles: THREE.Group[] = [];

    if (index > 1) {
      this.populateObstaclesAndItems(chunkGroup, obstacles, collectibles);
    }

    return {
      group: chunkGroup,
      index,
      zPos,
      obstacles,
      collectibles,
    };
  }

  /**
   * Adds lush Minecraft jungle scenery on both sides of the running track!
   */
  private populateJungleScenery(chunkGroup: THREE.Group) {
    const sideGroundMat = new THREE.MeshLambertMaterial({ map: this.textures.grassTop });

    // Left Jungle Ground Platform
    const groundL = new THREE.Mesh(new THREE.PlaneGeometry(16, CHUNK_SIZE), sideGroundMat);
    groundL.rotation.x = -Math.PI / 2;
    groundL.position.set(-13, -0.05, 0);
    groundL.receiveShadow = true;
    chunkGroup.add(groundL);

    // Right Jungle Ground Platform
    const groundR = new THREE.Mesh(new THREE.PlaneGeometry(16, CHUNK_SIZE), sideGroundMat);
    groundR.rotation.x = -Math.PI / 2;
    groundR.position.set(13, -0.05, 0);
    groundR.receiveShadow = true;
    chunkGroup.add(groundR);

    // Left & Right Giant Jungle Trees
    const treeZ1 = (Math.random() - 0.5) * (CHUNK_SIZE * 0.6);
    const treeZ2 = (Math.random() - 0.5) * (CHUNK_SIZE * 0.6);

    const treeL = this.models.createJungleTree(11 + Math.random() * 4);
    treeL.position.set(-7.5 - Math.random() * 3, 0, treeZ1);
    chunkGroup.add(treeL);

    const treeR = this.models.createJungleTree(11 + Math.random() * 4);
    treeR.position.set(7.5 + Math.random() * 3, 0, treeZ2);
    chunkGroup.add(treeR);

    // Bamboo Groves along borders
    for (let b = 0; b < 2; b++) {
      const bambooL = this.models.createBambooClump();
      bambooL.position.set(-5.5 - Math.random() * 2, 0, (b - 0.5) * 12);
      chunkGroup.add(bambooL);

      const bambooR = this.models.createBambooClump();
      bambooR.position.set(5.5 + Math.random() * 2, 0, (b - 0.5) * 12);
      chunkGroup.add(bambooR);
    }

    // Jungle Bushes
    for (let j = 0; j < 3; j++) {
      const bushL = this.models.createJungleBush();
      bushL.position.set(-6.0 - Math.random() * 3, 0, (j - 1) * 9);
      chunkGroup.add(bushL);

      const bushR = this.models.createJungleBush();
      bushR.position.set(6.0 + Math.random() * 3, 0, (j - 1) * 9);
      chunkGroup.add(bushR);
    }
  }

  /**
   * Procedural fair obstacle generation
   */
  private populateObstaclesAndItems(
    chunkGroup: THREE.Group,
    obstacles: THREE.Group[],
    collectibles: THREE.Group[]
  ) {
    const lanes: Lane[] = [-1, 0, 1];
    const zOffsets = [-CHUNK_SIZE * 0.25, CHUNK_SIZE * 0.25];

    zOffsets.forEach((zOffset) => {
      // Pick 1 or 2 occupied lanes (never all 3!)
      const numObstacles = Math.random() < 0.65 ? 1 : 2;
      const shuffledLanes = [...lanes].sort(() => Math.random() - 0.5);
      const chosenLanes = shuffledLanes.slice(0, numObstacles);
      const safeLanes = shuffledLanes.slice(numObstacles);

      chosenLanes.forEach((lane) => {
        const obsType = this.pickObstacleType();
        const obs = this.createObstacleMesh(obsType);
        obs.position.set(lane * LANE_WIDTH, 0, zOffset);
        chunkGroup.add(obs);
        obstacles.push(obs);

        // If jumpable obstacle, place emerald arc above it
        if (obs.userData.jumpable) {
          for (let i = -1; i <= 1; i++) {
            const em = this.models.createEmerald();
            em.position.set(lane * LANE_WIDTH, 1.8 + (1 - Math.abs(i)) * 0.7, zOffset + i * 1.5);
            chunkGroup.add(em);
            collectibles.push(em);
          }
        }
      });

      // Place straight line of emeralds in a safe lane
      if (safeLanes.length > 0 && Math.random() < 0.8) {
        const safeLane = safeLanes[0];
        for (let i = -2; i <= 2; i++) {
          const em = this.models.createEmerald();
          em.position.set(safeLane * LANE_WIDTH, 0.9, zOffset + i * 1.4);
          chunkGroup.add(em);
          collectibles.push(em);
        }
      }

      // Chance of Power-up in safe lane
      if (safeLanes.length > 0 && Math.random() < 0.18) {
        const powerTypes: PowerUpType[] = ['SHIELD', 'SPEED', 'MAGNET', 'ANTIGRAVITY'];
        const chosenType = powerTypes[Math.floor(Math.random() * powerTypes.length)];
        const powerItem = this.models.createPowerUpItem(chosenType);
        powerItem.position.set(safeLanes[safeLanes.length - 1] * LANE_WIDTH, 1.0, zOffset);
        chunkGroup.add(powerItem);
        collectibles.push(powerItem);
      }
    });
  }

  private pickObstacleType(): ObstacleType {
    const rand = Math.random();
    // Creepers and Zombies are full height (cannot jump!)
    if (rand < 0.28) return 'CREEPER';
    if (rand < 0.50) return 'ZOMBIE';
    if (rand < 0.65) return 'JUNGLE_LOG';    // Jumpable
    if (rand < 0.77) return 'JUNGLE_CANOPY'; // Slidable
    if (rand < 0.87) return 'SPIDER';        // Jumpable
    if (rand < 0.94) return 'STONE_WALL';    // Jumpable
    return 'TNT_CRATE';                      // Full height
  }

  private createObstacleMesh(type: ObstacleType): THREE.Group {
    switch (type) {
      case 'CREEPER': return this.models.createCreeper();
      case 'ZOMBIE': return this.models.createZombie();
      case 'JUNGLE_LOG': return this.models.createJungleLog();
      case 'JUNGLE_CANOPY': return this.models.createJungleCanopy();
      case 'SPIDER': return this.models.createSpider();
      case 'STONE_WALL': return this.models.createStoneWall();
      case 'STONE_ARCH': return this.models.createStoneArch();
      case 'LAVA_PIT': return this.models.createLavaPit();
      case 'TNT_CRATE': return this.models.createTNTCrate();
      default: return this.models.createCreeper();
    }
  }

  // ---------------- CONTROLS & INPUT ----------------

  public moveLeft() {
    if (!this.isRunning || this.isPaused) return;
    if (this.targetLane > -1) {
      this.targetLane = (this.targetLane - 1) as Lane;
      soundManager.playLaneChange();
      this.spawnDustParticles();
    }
  }

  public moveRight() {
    if (!this.isRunning || this.isPaused) return;
    if (this.targetLane < 1) {
      this.targetLane = (this.targetLane + 1) as Lane;
      soundManager.playLaneChange();
      this.spawnDustParticles();
    }
  }

  public jump() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.isJumping) {
      this.isJumping = true;
      const isAntigrav = this.activePowerUps.has('ANTIGRAVITY');
      this.velocityY = isAntigrav ? 16.5 : 12.5; // High float jump in antigravity
      soundManager.playJump();
      this.spawnDustParticles();
    }
  }

  public slide() {
    if (!this.isRunning || this.isPaused) return;
    if (this.isJumping) {
      // Fast downward dive if in mid-air
      this.velocityY = -18;
      this.isSliding = true;
      this.slideTimer = 0.65;
      soundManager.playSlide();
      return;
    }

    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = 0.7; // 0.7s slide duration
      soundManager.playSlide();
      this.spawnDustParticles();
    }
  }

  public pause() {
    this.isPaused = true;
    soundManager.stopMusic();
  }

  public resume() {
    this.isPaused = false;
    soundManager.startMusic();
  }

  public startGame() {
    this.isRunning = true;
    this.isPaused = false;
    this.distanceTraveled = 0;
    this.currentSpeed = BASE_SPEED;
    this.score = 0;
    this.emeralds = 0;
    this.nearMisses = 0;
    this.graceTimer = 2.5;
    this.targetLane = 0;
    this.playerX = 0;
    this.playerY = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.isSliding = false;
    this.slideTimer = 0;
    this.activePowerUps.clear();
    this.shieldActive = false;
    this.lastMilestoneDistance = 0;

    // Reset chunks
    this.resetChunks();

    // Start background music
    soundManager.startMusic();

    this.clock.start();
    this.loop();
  }

  private resetChunks() {
    this.chunks.forEach((c) => this.scene.remove(c.group));
    this.chunks = [];
    this.nextChunkIndex = 0;
    this.initWorldChunks();
  }

  // ---------------- PARTICLES & EFFECTS ----------------

  private spawnDustParticles() {
    const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const mat = new THREE.MeshBasicMaterial({ color: 0x866043 });

    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        this.playerX + (Math.random() - 0.5) * 0.6,
        this.playerY + 0.1,
        (Math.random() - 0.5) * 0.4
      );
      this.particlesGroup.add(mesh);

      this.particles.push({
        mesh,
        vx: (Math.random() - 0.5) * 2,
        vy: 1.5 + Math.random() * 2,
        vz: 3 + Math.random() * 3,
        life: 0.35,
        maxLife: 0.35,
      });
    }
  }

  private spawnEmeraldSparkles(pos: THREE.Vector3) {
    const geo = new THREE.OctahedronGeometry(0.08, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });

    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      this.particlesGroup.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        mesh,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (Math.random() - 0.5) * speed,
        life: 0.4,
        maxLife: 0.4,
      });
    }
  }

  private triggerScreenShake(intensity: number) {
    if (!this.reducedMotion) {
      this.cameraShake = intensity;
    }
  }

  // ---------------- MAIN GAME LOOP ----------------

  private loop = () => {
    if (!this.isRunning) return;

    this.animFrameId = requestAnimationFrame(this.loop);

    if (this.isPaused) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const delta = Math.min(this.clock.getDelta(), 0.05);

    this.updatePhysics(delta);
    this.updateChunks(delta);
    this.updatePowerUps(delta);
    this.updateParticles(delta);
    this.updateSteveAnimations(delta);
    this.checkCollisions();
    this.updateCamera(delta);
    this.updateStats(delta);

    this.renderer.render(this.scene, this.camera);
  };

  private updatePhysics(delta: number) {
    // 1. Lane Interpolation with banking
    const targetX = this.targetLane * LANE_WIDTH;
    const prevX = this.playerX;
    this.playerX = THREE.MathUtils.damp(this.playerX, targetX, 16, delta);
    const dx = this.playerX - prevX;
    this.bankAngle = THREE.MathUtils.damp(this.bankAngle, -dx * 8, 12, delta);

    // 2. Vertical Jump Physics
    if (this.isJumping) {
      const isAntigrav = this.activePowerUps.has('ANTIGRAVITY');
      const gravity = isAntigrav ? -16 : -34;
      this.velocityY += gravity * delta;
      this.playerY += this.velocityY * delta;

      if (this.playerY <= 0) {
        this.playerY = 0;
        this.velocityY = 0;
        this.isJumping = false;
        soundManager.playLaneChange();
        this.spawnDustParticles();
      }
    }

    // 3. Sliding Timer
    if (this.isSliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // 4. Invulnerability grace timer
    if (this.graceTimer > 0) {
      this.graceTimer -= delta;
    }

    // 5. Speed scaling smoothly with distance
    const speedBoost = this.activePowerUps.has('SPEED') ? 1.35 : 1.0;
    this.currentSpeed = (BASE_SPEED + Math.min(this.distanceTraveled * 0.012, 22)) * speedBoost;

    // Advance distance
    const forwardDist = this.currentSpeed * delta;
    this.distanceTraveled += forwardDist;
    this.score += Math.floor(forwardDist * this.getMultiplier());

    // Milestone check (every 500m)
    if (this.distanceTraveled - this.lastMilestoneDistance >= 500) {
      this.lastMilestoneDistance = Math.floor(this.distanceTraveled / 500) * 500;
      soundManager.playMilestone();
      this.callbacks.onMilestone(`${this.lastMilestoneDistance}m TRAVELED!`);
    }

    // Position Steve
    this.steve.group.position.set(this.playerX, this.playerY, 0);
  }

  private getMultiplier(): number {
    let mult = 1 + Math.floor(this.distanceTraveled / 400);
    if (this.activePowerUps.has('SPEED')) mult *= 3;
    if (this.activePowerUps.has('ANTIGRAVITY')) mult *= 2;
    return mult;
  }

  private updateChunks(delta: number) {
    const moveZ = this.currentSpeed * delta;

    this.chunks.forEach((chunk) => {
      chunk.group.position.z += moveZ;

      // Bobbing collectibles
      chunk.collectibles.forEach((item) => {
        item.rotation.y += delta * 3.5;
        if (item.userData.isEmerald) {
          item.position.y += Math.sin(this.distanceTraveled * 0.2 + item.position.x) * 0.004;
        }

        // Magnet attraction
        if (this.activePowerUps.has('MAGNET') && item.userData.isEmerald) {
          const worldPos = new THREE.Vector3();
          item.getWorldPosition(worldPos);
          const pPos = new THREE.Vector3(this.playerX, this.playerY + 1.0, 0);
          const dist = worldPos.distanceTo(pPos);

          if (dist < 12.0) {
            const pullDir = pPos.sub(worldPos).normalize().multiplyScalar(delta * 22);
            item.position.add(pullDir);
          }
        }
      });
    });

    // Check for chunk recycling (when chunk passes behind player)
    const firstChunk = this.chunks[0];
    if (firstChunk && firstChunk.group.position.z > CHUNK_SIZE * 1.5) {
      this.recycleChunk(firstChunk);
    }
  }

  private recycleChunk(oldChunk: WorldChunk) {
    this.chunks.shift();
    this.scene.remove(oldChunk.group);

    // Place at the far end of the runway
    const lastChunk = this.chunks[this.chunks.length - 1];
    const newZ = lastChunk.group.position.z - CHUNK_SIZE;

    const newChunk = this.createChunk(newZ, this.nextChunkIndex++);
    this.chunks.push(newChunk);
    this.scene.add(newChunk.group);
  }

  private updatePowerUps(delta: number) {
    const expired: PowerUpType[] = [];
    const activeList: ActivePowerUp[] = [];

    this.activePowerUps.forEach((p, type) => {
      p.remaining -= delta;
      if (p.remaining <= 0) {
        expired.push(type);
      } else {
        activeList.push({ type, remainingTime: p.remaining, totalTime: p.total });
      }
    });

    expired.forEach((type) => {
      this.activePowerUps.delete(type);
      if (type === 'SHIELD') {
        this.shieldActive = false;
        this.steve.shieldAura.visible = false;
      }
      if (type === 'ANTIGRAVITY') {
        this.steve.antigravRings.visible = false;
      }
    });

    this.callbacks.onPowerUpsUpdate(activeList);
  }

  private updateParticles(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      if (p.life <= 0) {
        this.particlesGroup.remove(p.mesh);
        this.particles.splice(i, 1);
      } else {
        p.mesh.position.x += p.vx * delta;
        p.mesh.position.y += p.vy * delta;
        p.mesh.position.z += p.vz * delta;
        const scale = p.life / p.maxLife;
        p.mesh.scale.set(scale, scale, scale);
      }
    }
  }

  private updateSteveAnimations(delta: number) {
    this.runCycleTime += delta * (this.currentSpeed * 0.45);

    // 1. Visible from behind (+Z): Steve's rotation faces -Z down track
    this.steve.group.rotation.y = 0;
    this.steve.group.rotation.z = this.bankAngle;

    // 2. Invulnerability flicker
    if (this.graceTimer > 0) {
      this.steve.group.visible = Math.floor(this.graceTimer * 12) % 2 === 0;
    } else {
      this.steve.group.visible = true;
    }

    // 3. Shield aura rotation
    if (this.shieldActive) {
      this.steve.shieldAura.visible = true;
      this.steve.shieldAura.rotation.y += delta * 3;
      this.steve.shieldAura.rotation.x += delta * 2;
    }

    // 4. Antigravity rings
    if (this.activePowerUps.has('ANTIGRAVITY')) {
      this.steve.antigravRings.visible = true;
    }

    // 5. Postures & Limb Animations
    if (this.isSliding) {
      // SLIDE / DUCK: Steve drops low into the track, leaning forward
      this.steve.torso.position.y = 0.45;
      this.steve.torso.rotation.x = -0.5;
      this.steve.head.position.y = 0.85;
      this.steve.head.position.z = -0.2;
      this.steve.leftLeg.position.y = 0.3;
      this.steve.leftLeg.rotation.x = -1.2;
      this.steve.rightLeg.position.y = 0.3;
      this.steve.rightLeg.rotation.x = -1.2;
      this.steve.leftArm.rotation.x = 0.8;
      this.steve.rightArm.rotation.x = 0.8;
    } else if (this.isJumping) {
      // JUMP: Arms reach up, legs tuck
      this.steve.torso.position.y = 0.85;
      this.steve.torso.rotation.x = 0.1;
      this.steve.head.position.y = 1.45;
      this.steve.head.position.z = 0;
      this.steve.leftArm.rotation.x = -2.2;
      this.steve.rightArm.rotation.x = -2.2;
      this.steve.leftLeg.rotation.x = 0.6;
      this.steve.rightLeg.rotation.x = -0.4;
    } else {
      // RUNNING: Alternating limbs along Z axis
      const swing = Math.sin(this.runCycleTime) * 0.75;
      this.steve.torso.position.y = 0.85 + Math.abs(Math.sin(this.runCycleTime * 2)) * 0.08;
      this.steve.torso.rotation.x = 0.12; // forward lean
      this.steve.head.position.y = 1.45 + Math.abs(Math.sin(this.runCycleTime * 2)) * 0.05;
      this.steve.head.position.z = 0;

      this.steve.leftArm.rotation.x = swing;
      this.steve.rightArm.rotation.x = -swing;
      this.steve.leftLeg.rotation.x = -swing;
      this.steve.rightLeg.rotation.x = swing;
    }
  }

  // ---------------- COLLISION DETECTION ----------------

  private checkCollisions() {
    // Player Hitbox
    // Normal standing: height 1.8, Y from 0 to 1.8
    // Sliding: height drops to 0.75, Y from 0 to 0.75!
    const playerMinY = this.playerY;
    const playerMaxY = this.playerY + (this.isSliding ? 0.75 : 1.8);
    const pX = this.playerX;
    const pZ = 0; // Steve stays at z=0

    this.chunks.forEach((chunk) => {
      // 1. Collectibles
      for (let i = chunk.collectibles.length - 1; i >= 0; i--) {
        const item = chunk.collectibles[i];
        const worldPos = new THREE.Vector3();
        item.getWorldPosition(worldPos);

        const dx = Math.abs(worldPos.x - pX);
        const dy = Math.abs(worldPos.y - (this.playerY + 0.8));
        const dz = Math.abs(worldPos.z - pZ);

        if (dx < 1.0 && dy < 1.4 && dz < 1.2) {
          // Collected!
          if (item.userData.isEmerald) {
            this.emeralds++;
            this.score += 25 * this.getMultiplier();
            soundManager.playEmerald();
            this.spawnEmeraldSparkles(worldPos);
          } else if (item.userData.isPowerUp) {
            this.activatePowerUp(item.userData.powerUpType);
            soundManager.playPowerUp();
          }

          chunk.group.remove(item);
          chunk.collectibles.splice(i, 1);
        }
      }

      // 2. Obstacles
      chunk.obstacles.forEach((obs) => {
        const worldPos = new THREE.Vector3();
        obs.getWorldPosition(worldPos);

        const dx = Math.abs(worldPos.x - pX);
        const dz = Math.abs(worldPos.z - pZ);

        // Near-miss reward
        if (dz < 1.0 && dx > 1.1 && dx < 2.0 && !obs.userData.nearMissChecked) {
          obs.userData.nearMissChecked = true;
          this.nearMisses++;
          this.score += 50 * this.getMultiplier();
        }

        // Direct collision check
        if (dx < 1.0 && dz < 0.95) {
          // Check vertical bounds based on obstacle type
          let isHit = false;

          if (obs.userData.type === 'CREEPER' || obs.userData.type === 'ZOMBIE') {
            // FULL HEIGHT MOBS (same height as player ~1.85m):
            // CANNOT jump over them!
            // Even if player jumps (player reaches max Y=2.2, Steve's feet are at Y=1.8, still hitting mob's head!)
            if (playerMinY < 1.9) {
              isHit = true;
            }
          } else if (obs.userData.jumpable) {
            // Low obstacles (fallen log, spider, stone wall, lava pit):
            // If player jumped safely above obstacle height, safe!
            const obsTop = obs.userData.height || 0.65;
            if (playerMinY < obsTop) {
              isHit = true;
            }
          } else if (obs.userData.slidable) {
            // Overhead obstacles (hanging canopy, stone arch):
            // Minimum clearance is at y=1.0. If player is sliding (playerMaxY = 0.75), he is SAFE!
            // If player is standing (playerMaxY = 1.8), he hits the overhead canopy!
            const clearance = obs.userData.minClearance || 1.0;
            if (playerMaxY > clearance) {
              isHit = true;
            }
          } else {
            // Default full blocker (TNT Crate)
            if (playerMinY < 1.4) {
              isHit = true;
            }
          }

          if (isHit) {
            this.handleCollision();
          }
        }
      });
    });
  }

  private activatePowerUp(type: PowerUpType) {
    if (type === 'SHIELD') {
      this.shieldActive = true;
      this.steve.shieldAura.visible = true;
      this.activePowerUps.set('SHIELD', { remaining: 15, total: 15 });
    } else if (type === 'SPEED') {
      this.activePowerUps.set('SPEED', { remaining: 9, total: 9 });
    } else if (type === 'MAGNET') {
      this.activePowerUps.set('MAGNET', { remaining: 12, total: 12 });
    } else if (type === 'ANTIGRAVITY') {
      this.steve.antigravRings.visible = true;
      this.activePowerUps.set('ANTIGRAVITY', { remaining: 10, total: 10 });
    }
  }

  private handleCollision() {
    if (this.graceTimer > 0) return; // Invulnerable grace

    if (this.shieldActive) {
      // Shield absorbs collision!
      this.shieldActive = false;
      this.steve.shieldAura.visible = false;
      this.activePowerUps.delete('SHIELD');
      soundManager.playShieldBreak();
      this.triggerScreenShake(0.5);
      this.graceTimer = 1.6; // 1.6s grace window after shield pops
      return;
    }

    // Fatal Crash
    this.gameOver();
  }

  private gameOver() {
    this.isRunning = false;
    soundManager.stopMusic();
    soundManager.playCrash();
    this.triggerScreenShake(1.2);

    // Stumble Steve animation
    this.steve.torso.rotation.x = -1.2;
    this.steve.head.rotation.x = 0.8;

    // Save High Score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('minerunner_high_score', this.highScore.toString());
    }

    const finalStats: GameStats = {
      score: this.score,
      highScore: this.highScore,
      distance: Math.floor(this.distanceTraveled),
      emeralds: this.emeralds,
      multiplier: this.getMultiplier(),
      speed: Math.floor(this.currentSpeed),
      biome: 'JUNGLE',
      nearMisses: this.nearMisses,
    };

    this.callbacks.onGameOver(finalStats);
  }

  private updateCamera(delta: number) {
    // Camera smoothly follows player with slight lag and banking
    const targetCamX = this.playerX * 0.45;
    const targetCamY = 3.8 + (this.isSliding ? -0.4 : this.playerY * 0.35);

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 10, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 10, delta);

    // Screen Shake decay
    if (this.cameraShake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
      this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake = Math.max(0, this.cameraShake - delta * 3);
    }

    this.camera.lookAt(this.playerX * 0.25, 1.4, -6.0);
  }

  private updateStats(_delta: number) {
    this.callbacks.onStatsUpdate({
      score: this.score,
      highScore: this.highScore,
      distance: Math.floor(this.distanceTraveled),
      emeralds: this.emeralds,
      multiplier: this.getMultiplier(),
      speed: Math.floor(this.currentSpeed),
      biome: 'JUNGLE',
      nearMisses: this.nearMisses,
    });
  }

  public dispose() {
    this.isRunning = false;
    soundManager.stopMusic();
    cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
