import * as THREE from 'three';
import { TextureLibrary } from './textures';

export interface SteveRig {
  group: THREE.Group;
  head: THREE.Mesh;
  torso: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  shieldAura: THREE.Mesh;
  antigravRings: THREE.Group;
  shadow: THREE.Mesh;
}

export class ModelFactory {
  private textures: TextureLibrary;

  constructor(textures: TextureLibrary) {
    this.textures = textures;
  }

  /**
   * Builds player Steve.
   * Faces forward toward -Z (away from camera).
   * Camera views back of brown hair and cyan shirt from +Z.
   */
  public createSteve(): SteveRig {
    const group = new THREE.Group();

    // Materials
    const hairMat = new THREE.MeshLambertMaterial({ map: this.textures.steveHair });
    const faceMat = new THREE.MeshLambertMaterial({ map: this.textures.steveFace });
    const skinMat = new THREE.MeshLambertMaterial({ map: this.textures.steveSkin });
    const shirtMat = new THREE.MeshLambertMaterial({ map: this.textures.steveShirt });
    const shirtBackMat = new THREE.MeshLambertMaterial({ map: this.textures.steveShirtBack });
    const jeansMat = new THREE.MeshLambertMaterial({ map: this.textures.steveJeans });

    // 1. Head (0.75 x 0.75 x 0.75)
    // Box materials: [+x, -x, +y, -y, +z (back), -z (front face)]
    const headMats = [skinMat, skinMat, hairMat, skinMat, hairMat, faceMat];
    const headGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const head = new THREE.Mesh(headGeo, headMats);
    head.position.y = 1.45;
    head.castShadow = true;
    group.add(head);

    // 2. Torso (0.8 x 1.0 x 0.4)
    // Box materials: [+x, -x, +y, -y, +z (back shirt), -z (front shirt)]
    const torsoMats = [shirtMat, shirtMat, shirtMat, shirtMat, shirtBackMat, shirtMat];
    const torsoGeo = new THREE.BoxGeometry(0.8, 1.0, 0.4);
    const torso = new THREE.Mesh(torsoGeo, torsoMats);
    torso.position.y = 0.85;
    torso.castShadow = true;
    group.add(torso);

    // 3. Left Arm (Pivoted at shoulder)
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.58, 1.3, 0);
    const armGeo = new THREE.BoxGeometry(0.36, 1.0, 0.36);
    armGeo.translate(0, -0.45, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, [shirtMat, skinMat, shirtMat, skinMat, shirtMat, shirtMat]);
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);
    group.add(leftArm);

    // 4. Right Arm (Pivoted at shoulder)
    const rightArm = new THREE.Group();
    rightArm.position.set(0.58, 1.3, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, [skinMat, shirtMat, shirtMat, skinMat, shirtMat, shirtMat]);
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);
    group.add(rightArm);

    // 5. Left Leg (Pivoted at hip)
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.21, 0.65, 0);
    const legGeo = new THREE.BoxGeometry(0.38, 0.9, 0.38);
    legGeo.translate(0, -0.45, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, jeansMat);
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);
    group.add(leftLeg);

    // 6. Right Leg (Pivoted at hip)
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.21, 0.65, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, jeansMat);
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);
    group.add(rightLeg);

    // 7. Shield Aura (Golden rotating wireframe sphere)
    const shieldGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const shieldAura = new THREE.Mesh(shieldGeo, shieldMat);
    shieldAura.position.y = 0.9;
    shieldAura.visible = false;
    group.add(shieldAura);

    // 8. Antigravity Boot Rings (Glowing cyan energy rings)
    const antigravRings = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 20);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const ringL = new THREE.Mesh(ringGeo, ringMat);
    ringL.rotation.x = Math.PI / 2;
    ringL.position.set(-0.21, 0.05, 0);
    const ringR = new THREE.Mesh(ringGeo, ringMat);
    ringR.rotation.x = Math.PI / 2;
    ringR.position.set(0.21, 0.05, 0);
    antigravRings.add(ringL);
    antigravRings.add(ringR);
    antigravRings.visible = false;
    group.add(antigravRings);

    // 9. Contact Shadow Disc
    const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    return {
      group,
      head,
      torso,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      shieldAura,
      antigravRings,
      shadow,
    };
  }

  /**
   * Creeper: SAME HEIGHT AS PLAYER (~1.8m tall).
   * Cannot jump over! Must change lane or use shield.
   */
  public createCreeper(): THREE.Group {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshLambertMaterial({ map: this.textures.creeperSkin });
    const faceMat = new THREE.MeshLambertMaterial({ map: this.textures.creeperFace });

    // Head faces player (+Z)
    // Box materials: [+x, -x, +y, -y, +z (front face), -z]
    const headGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const head = new THREE.Mesh(headGeo, [skinMat, skinMat, skinMat, skinMat, faceMat, skinMat]);
    head.position.y = 1.45;
    head.castShadow = true;
    group.add(head);

    // Body (0.7 x 1.0 x 0.45)
    const bodyGeo = new THREE.BoxGeometry(0.7, 1.0, 0.45);
    const body = new THREE.Mesh(bodyGeo, skinMat);
    body.position.y = 0.85;
    body.castShadow = true;
    group.add(body);

    // 4 blocky feet at base
    const legGeo = new THREE.BoxGeometry(0.3, 0.45, 0.3);
    const legFL = new THREE.Mesh(legGeo, skinMat);
    legFL.position.set(-0.22, 0.22, 0.2);
    const legFR = new THREE.Mesh(legGeo, skinMat);
    legFR.position.set(0.22, 0.22, 0.2);
    const legBL = new THREE.Mesh(legGeo, skinMat);
    legBL.position.set(-0.22, 0.22, -0.2);
    const legBR = new THREE.Mesh(legGeo, skinMat);
    legBR.position.set(0.22, 0.22, -0.2);

    legFL.castShadow = true;
    legFR.castShadow = true;
    legBL.castShadow = true;
    legBR.castShadow = true;

    group.add(legFL, legFR, legBL, legBR);

    // Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    group.userData = { type: 'CREEPER', height: 1.85, jumpable: false };
    return group;
  }

  /**
   * Zombie: SAME HEIGHT AS PLAYER (~1.85m tall).
   * Arms outstretched forward. Cannot jump over!
   */
  public createZombie(): THREE.Group {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshLambertMaterial({ map: this.textures.zombieSkin });
    const shirtMat = new THREE.MeshLambertMaterial({ map: this.textures.zombieShirt });
    const pantsMat = new THREE.MeshLambertMaterial({ map: this.textures.steveJeans });

    // Head (faces player +Z)
    const headGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const head = new THREE.Mesh(headGeo, [skinMat, skinMat, skinMat, skinMat, skinMat, skinMat]);
    head.position.y = 1.45;
    head.castShadow = true;
    group.add(head);

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.8, 1.0, 0.4);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 0.85;
    torso.castShadow = true;
    group.add(torso);

    // Arms outstretched horizontally forward towards player (+Z)
    const armGeo = new THREE.BoxGeometry(0.35, 0.35, 1.0);
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.set(-0.55, 1.2, 0.5);
    leftArm.castShadow = true;

    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.set(0.55, 1.2, 0.5);
    rightArm.castShadow = true;

    group.add(leftArm, rightArm);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.38, 0.85, 0.38);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.21, 0.42, 0);
    leftLeg.castShadow = true;

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.21, 0.42, 0);
    rightLeg.castShadow = true;

    group.add(leftLeg, rightLeg);

    // Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    group.userData = { type: 'ZOMBIE', height: 1.85, jumpable: false };
    return group;
  }

  /**
   * Spider (Low obstacle - Jumpable)
   */
  public createSpider(): THREE.Group {
    const group = new THREE.Group();
    const spiderMat = new THREE.MeshLambertMaterial({ map: this.textures.spiderSkin });

    // Abdomen
    const bodyGeo = new THREE.BoxGeometry(0.7, 0.35, 0.7);
    const body = new THREE.Mesh(bodyGeo, spiderMat);
    body.position.y = 0.25;
    body.castShadow = true;
    group.add(body);

    // Head
    const headGeo = new THREE.BoxGeometry(0.5, 0.3, 0.4);
    const head = new THREE.Mesh(headGeo, spiderMat);
    head.position.set(0, 0.22, 0.45);
    head.castShadow = true;
    group.add(head);

    // 8 Legs
    const legGeo = new THREE.BoxGeometry(0.8, 0.1, 0.1);
    for (let i = 0; i < 4; i++) {
      const zOffset = (i - 1.5) * 0.25;
      const legL = new THREE.Mesh(legGeo, spiderMat);
      legL.position.set(-0.55, 0.15, zOffset);
      legL.rotation.z = 0.3;
      const legR = new THREE.Mesh(legGeo, spiderMat);
      legR.position.set(0.55, 0.15, zOffset);
      legR.rotation.z = -0.3;
      group.add(legL, legR);
    }

    group.userData = { type: 'SPIDER', height: 0.45, jumpable: true };
    return group;
  }

  /**
   * Fallen Jungle Log (Low obstacle - Jumpable)
   */
  public createJungleLog(): THREE.Group {
    const group = new THREE.Group();
    const logMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleWood });
    const capMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleWoodTop });

    const logGeo = new THREE.BoxGeometry(2.4, 0.6, 0.6);
    const log = new THREE.Mesh(logGeo, [capMat, capMat, logMat, logMat, logMat, logMat]);
    log.position.y = 0.3;
    log.castShadow = true;
    group.add(log);

    // Add some small jungle vines/leaves clinging to it
    const vineMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleLeaves });
    const vine = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.65), vineMat);
    vine.position.set(0.3, 0.2, 0);
    group.add(vine);

    group.userData = { type: 'JUNGLE_LOG', height: 0.6, jumpable: true };
    return group;
  }

  /**
   * Mossy Stone Wall (Low obstacle - Jumpable)
   */
  public createStoneWall(): THREE.Group {
    const group = new THREE.Group();
    const stoneMat = new THREE.MeshLambertMaterial({ map: this.textures.mossyCobblestone });

    const wallGeo = new THREE.BoxGeometry(2.4, 0.65, 0.5);
    const wall = new THREE.Mesh(wallGeo, stoneMat);
    wall.position.y = 0.325;
    wall.castShadow = true;
    group.add(wall);

    group.userData = { type: 'STONE_WALL', height: 0.65, jumpable: true };
    return group;
  }

  /**
   * Hanging Jungle Canopy (Overhead hazard - Must slide under!)
   */
  public createJungleCanopy(): THREE.Group {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleWood });
    const leavesMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleLeaves });

    // Side support posts
    const postGeo = new THREE.BoxGeometry(0.4, 2.8, 0.4);
    const postL = new THREE.Mesh(postGeo, woodMat);
    postL.position.set(-1.25, 1.4, 0);
    const postR = new THREE.Mesh(postGeo, woodMat);
    postR.position.set(1.25, 1.4, 0);
    group.add(postL, postR);

    // Overhead beam
    const beamGeo = new THREE.BoxGeometry(2.9, 0.4, 0.4);
    const beam = new THREE.Mesh(beamGeo, woodMat);
    beam.position.y = 2.4;
    group.add(beam);

    // Thick hanging leaves that require sliding beneath (bottom edge at y=1.0)
    const leavesGeo = new THREE.BoxGeometry(2.7, 1.2, 1.2);
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 1.7;
    leaves.castShadow = true;
    group.add(leaves);

    group.userData = { type: 'JUNGLE_CANOPY', height: 2.5, minClearance: 1.0, jumpable: false, slidable: true };
    return group;
  }

  /**
   * Ancient Stone Arch (Overhead hazard - Must slide under!)
   */
  public createStoneArch(): THREE.Group {
    const group = new THREE.Group();
    const stoneMat = new THREE.MeshLambertMaterial({ map: this.textures.cobblestone });
    const mossMat = new THREE.MeshLambertMaterial({ map: this.textures.mossyCobblestone });

    // Side pillars
    const pillarGeo = new THREE.BoxGeometry(0.5, 2.7, 0.5);
    const pillarL = new THREE.Mesh(pillarGeo, stoneMat);
    pillarL.position.set(-1.25, 1.35, 0);
    const pillarR = new THREE.Mesh(pillarGeo, stoneMat);
    pillarR.position.set(1.25, 1.35, 0);
    group.add(pillarL, pillarR);

    // Arch header (bottom at y=1.0)
    const archGeo = new THREE.BoxGeometry(2.8, 1.0, 0.6);
    const arch = new THREE.Mesh(archGeo, mossMat);
    arch.position.y = 1.8;
    arch.castShadow = true;
    group.add(arch);

    group.userData = { type: 'STONE_ARCH', height: 2.5, minClearance: 1.0, jumpable: false, slidable: true };
    return group;
  }

  /**
   * TNT Crate (Full-height blocker - Dodge!)
   */
  public createTNTCrate(): THREE.Group {
    const group = new THREE.Group();
    const sideMat = new THREE.MeshLambertMaterial({ map: this.textures.tntSide });
    const topMat = new THREE.MeshLambertMaterial({ map: this.textures.tntTop });

    const crateGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const crate = new THREE.Mesh(crateGeo, [sideMat, sideMat, topMat, topMat, sideMat, sideMat]);
    crate.position.y = 0.45;
    crate.castShadow = true;
    group.add(crate);

    group.userData = { type: 'TNT_CRATE', height: 1.2, jumpable: false };
    return group;
  }

  /**
   * Lava Pit (Trench gap - Jumpable)
   */
  public createLavaPit(): THREE.Group {
    const group = new THREE.Group();
    const lavaMat = new THREE.MeshBasicMaterial({ map: this.textures.lava });
    const stoneMat = new THREE.MeshLambertMaterial({ map: this.textures.cobblestone });

    // Lava plane
    const lavaGeo = new THREE.PlaneGeometry(2.4, 1.6);
    const lava = new THREE.Mesh(lavaGeo, lavaMat);
    lava.rotation.x = -Math.PI / 2;
    lava.position.y = 0.03;
    group.add(lava);

    // Stone borders around pit
    const rimGeo = new THREE.BoxGeometry(2.5, 0.1, 0.2);
    const rimFront = new THREE.Mesh(rimGeo, stoneMat);
    rimFront.position.set(0, 0.05, 0.8);
    const rimBack = new THREE.Mesh(rimGeo, stoneMat);
    rimBack.position.set(0, 0.05, -0.8);
    group.add(rimFront, rimBack);

    group.userData = { type: 'LAVA_PIT', height: 0.1, jumpable: true, isGap: true };
    return group;
  }

  /**
   * Giant Jungle Tree for side borders scenery
   */
  public createJungleTree(height: number = 12): THREE.Group {
    const group = new THREE.Group();
    const trunkMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleWood });
    const leavesMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleLeaves });
    const cocoaMat = new THREE.MeshLambertMaterial({ map: this.textures.cocoaPod });

    // Thick trunk (1.2 x height x 1.2)
    const trunkGeo = new THREE.BoxGeometry(1.2, height, 1.2);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = height / 2;
    trunk.castShadow = true;
    group.add(trunk);

    // Hanging cocoa pods attached to trunk
    for (let i = 0; i < 3; i++) {
      const cocoa = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.35), cocoaMat);
      const angle = (i * Math.PI * 2) / 3;
      const py = 3 + i * 2.5;
      cocoa.position.set(Math.cos(angle) * 0.75, py, Math.sin(angle) * 0.75);
      group.add(cocoa);
    }

    // Huge canopy crown at top (nested blocky foliage)
    const crown1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.5, 5.0), leavesMat);
    crown1.position.y = height + 0.8;
    crown1.castShadow = true;

    const crown2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 3.6), leavesMat);
    crown2.position.y = height + 2.5;
    crown2.castShadow = true;

    const crown3 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 2.0), leavesMat);
    crown3.position.y = height + 3.8;

    group.add(crown1, crown2, crown3);

    // Hanging jungle vines descending from canopy
    const vineGeo = new THREE.BoxGeometry(0.2, 3.5, 0.2);
    for (let v = 0; v < 4; v++) {
      const vine = new THREE.Mesh(vineGeo, leavesMat);
      const vx = (v % 2 === 0 ? 1 : -1) * (1.8 + Math.random() * 0.5);
      const vz = (v > 1 ? 1 : -1) * (1.8 + Math.random() * 0.5);
      vine.position.set(vx, height - 0.5, vz);
      group.add(vine);
    }

    return group;
  }

  /**
   * Jungle Bamboo Clump for roadside undergrowth
   */
  public createBambooClump(): THREE.Group {
    const group = new THREE.Group();
    const bambooMat = new THREE.MeshLambertMaterial({ map: this.textures.bamboo });
    const leafMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleLeaves });

    const stalkCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < stalkCount; i++) {
      const h = 4 + Math.random() * 4;
      const stalk = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, 0.2), bambooMat);
      const ox = (Math.random() - 0.5) * 1.0;
      const oz = (Math.random() - 0.5) * 1.0;
      stalk.position.set(ox, h / 2, oz);
      stalk.castShadow = true;
      group.add(stalk);

      // Top leaves
      const foliage = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), leafMat);
      foliage.position.set(ox, h + 0.3, oz);
      group.add(foliage);
    }

    return group;
  }

  /**
   * Jungle Foliage Bush
   */
  public createJungleBush(): THREE.Group {
    const group = new THREE.Group();
    const leavesMat = new THREE.MeshLambertMaterial({ map: this.textures.jungleLeaves });

    const bush = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.4), leavesMat);
    bush.position.y = 0.6;
    bush.castShadow = true;
    group.add(bush);

    return group;
  }

  /**
   * 3D Minecraft Emerald Collectible Item
   */
  public createEmerald(): THREE.Group {
    const group = new THREE.Group();

    // 3D Octahedron / Double-pyramid crystal gem
    const gemGeo = new THREE.OctahedronGeometry(0.38, 0);
    const gemMat = new THREE.MeshLambertMaterial({
      map: this.textures.emeraldTexture,
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.rotation.y = Math.PI / 4;
    group.add(gem);

    // Inner bright sparkle core
    const coreGeo = new THREE.OctahedronGeometry(0.2, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7, wireframe: true });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    group.userData = { isEmerald: true };
    return group;
  }

  /**
   * Power-Up 3D Icons
   */
  public createPowerUpItem(type: 'SHIELD' | 'SPEED' | 'MAGNET' | 'ANTIGRAVITY'): THREE.Group {
    const group = new THREE.Group();

    if (type === 'SHIELD') {
      // Golden Totem of Undying
      const bodyMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.4 });
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const totem = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.25), bodyMat);
      const eyes = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.28), eyeMat);
      const wings = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.15), bodyMat);
      wings.position.y = 0.1;
      group.add(totem, eyes, wings);
    } else if (type === 'SPEED') {
      // Red Potion Bottle
      const bottleMat = new THREE.MeshLambertMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.5 });
      const corkMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
      const bottle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), bottleMat);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), bottleMat);
      neck.position.y = 0.35;
      const cork = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.22), corkMat);
      cork.position.y = 0.5;
      group.add(bottle, neck, cork);
    } else if (type === 'MAGNET') {
      // Red & Silver Horseshoe Magnet
      const redMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
      const silverMat = new THREE.MeshLambertMaterial({ color: 0xe5e7eb });
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.2), redMat);
      topBar.position.y = 0.3;
      const poleL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), redMat);
      poleL.position.set(-0.2, 0.1, 0);
      const poleR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), redMat);
      poleR.position.set(0.2, 0.1, 0);
      const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.2), silverMat);
      tipL.position.set(-0.2, -0.15, 0);
      const tipR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.2), silverMat);
      tipR.position.set(0.2, -0.15, 0);
      group.add(topBar, poleL, poleR, tipL, tipR);
    } else {
      // ANTIGRAVITY Boots
      const bootMat = new THREE.MeshLambertMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.6 });
      const wingMat = new THREE.MeshBasicMaterial({ color: 0xa5f3fc, wireframe: true });
      const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.4, 0.4), bootMat);
      bootL.position.x = -0.18;
      const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.4, 0.4), bootMat);
      bootR.position.x = 0.18;
      const wings = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.1), wingMat);
      wings.position.y = 0.15;
      group.add(bootL, bootR, wings);
    }

    // Outer rotating beacon diamond
    const beaconGeo = new THREE.OctahedronGeometry(0.7, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.4 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    group.add(beacon);

    group.userData = { isPowerUp: true, powerUpType: type };
    return group;
  }
}
