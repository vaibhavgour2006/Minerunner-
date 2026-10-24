import * as THREE from 'three';

// 16x16 Pixel Art Minecraft Emerald Item (Base64 PNG)
export const EMERALD_BASE64 = 
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA' +
  'AXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA0' +
  'SURBVDhPY2AYBeMYEEDF5+Lir/n+/z+Y0nCphVqAmYGBgYFqBmCTxyf9B5sB6IZRsAMf' +
  'BgCVXBEt95b9cAAAAABJRU5ErkJggg==';

// Helper to create a 16x16 pixelated canvas texture
function createPixelTexture(drawFn: (ctx: CanvasRenderingContext2D, size: number) => void, size: number = 16): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  drawFn(ctx, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  return texture;
}

export class TextureLibrary {
  // Terrain & Environment
  public grassTop: THREE.CanvasTexture;
  public grassSide: THREE.CanvasTexture;
  public dirt: THREE.CanvasTexture;
  public jungleWood: THREE.CanvasTexture;
  public jungleWoodTop: THREE.CanvasTexture;
  public jungleLeaves: THREE.CanvasTexture;
  public cocoaPod: THREE.CanvasTexture;
  public bamboo: THREE.CanvasTexture;
  public cobblestone: THREE.CanvasTexture;
  public mossyCobblestone: THREE.CanvasTexture;
  public lava: THREE.CanvasTexture;

  // Characters
  public steveHair: THREE.CanvasTexture;
  public steveFace: THREE.CanvasTexture;
  public steveShirt: THREE.CanvasTexture;
  public steveShirtBack: THREE.CanvasTexture;
  public steveJeans: THREE.CanvasTexture;
  public steveSkin: THREE.CanvasTexture;

  // Mobs
  public creeperSkin: THREE.CanvasTexture;
  public creeperFace: THREE.CanvasTexture;
  public zombieSkin: THREE.CanvasTexture;
  public zombieShirt: THREE.CanvasTexture;
  public spiderSkin: THREE.CanvasTexture;

  // Obstacles & Items
  public tntSide: THREE.CanvasTexture;
  public tntTop: THREE.CanvasTexture;
  public emeraldTexture: THREE.CanvasTexture;

  constructor() {
    // 1. Grass Top (Quadrant 4 of authentic Minecraft grass block: multi-toned green noise)
    this.grassTop = createPixelTexture((ctx, s) => {
      const palette = ['#5b8c32', '#4c7828', '#6a9f3b', '#446e22', '#52832c'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          const color = palette[(x * 7 + y * 13 + (x ^ y)) % palette.length];
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Subtle 1-pixel darker border for clean 1x1 block definition
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, s, 1);
      ctx.fillRect(0, 0, 1, s);
    });

    // 2. Grass Side (Dripping green fringe over dark rich dirt)
    this.grassSide = createPixelTexture((ctx, s) => {
      // Base dirt
      const dirtColors = ['#866043', '#725237', '#60442c', '#986d4e'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = dirtColors[(x * 3 + y * 11) % dirtColors.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Green grass drip fringe (varies 3 to 6 pixels down)
      const dripHeights = [3, 4, 3, 5, 4, 6, 4, 3, 5, 4, 6, 5, 4, 3, 5, 4];
      const grassColors = ['#5b8c32', '#4c7828', '#6a9f3b'];
      for (let x = 0; x < s; x++) {
        const h = dripHeights[x % dripHeights.length];
        for (let y = 0; y < h; y++) {
          ctx.fillStyle = grassColors[(x + y) % grassColors.length];
          ctx.fillRect(x, y, 1, 1);
        }
        // Darker edge pixel at the tip of the drip
        ctx.fillStyle = '#3a5c1b';
        ctx.fillRect(x, h - 1, 1, 1);
      }
    });

    // 3. Dirt
    this.dirt = createPixelTexture((ctx, s) => {
      const colors = ['#866043', '#725237', '#60442c', '#986d4e', '#553c26'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = colors[(x * 5 + y * 9 + (x ^ y)) % colors.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    // 4. Jungle Wood Bark (Dark warm brown with vertical striations & green moss specks)
    this.jungleWood = createPixelTexture((ctx, s) => {
      const barks = ['#554426', '#493a20', '#635030', '#3b2f19'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = barks[(x * 2 + y * 7) % barks.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Moss accents
      const moss = ['#4f6e28', '#3e581e'];
      for (let i = 0; i < 12; i++) {
        const mx = (i * 7) % s;
        const my = (i * 11) % s;
        ctx.fillStyle = moss[i % 2];
        ctx.fillRect(mx, my, 1, 1);
      }
    });

    // 5. Jungle Wood Top (Cross cut rings)
    this.jungleWoodTop = createPixelTexture((ctx, s) => {
      ctx.fillStyle = '#635030';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#8f7748';
      ctx.fillRect(2, 2, s - 4, s - 4);
      ctx.fillStyle = '#7a653c';
      ctx.fillRect(4, 4, s - 8, s - 8);
      ctx.fillStyle = '#635030';
      ctx.fillRect(7, 7, 2, 2);
    });

    // 6. Jungle Leaves (Vibrant tropical foliage with pixel cutouts)
    this.jungleLeaves = createPixelTexture((ctx, s) => {
      const greens = ['#2e8528', '#236b1e', '#399e32', '#1b5417', '#48b83e'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          if ((x * 3 + y * 5) % 9 === 0) {
            // Cutout/shadow
            ctx.fillStyle = '#143f11';
          } else {
            ctx.fillStyle = greens[(x * 7 + y * 13) % greens.length];
          }
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    // 7. Cocoa Pod (Warm terracotta orange-brown with ribs)
    this.cocoaPod = createPixelTexture((ctx, s) => {
      const oranges = ['#c86420', '#b05216', '#db782a', '#94410f'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = oranges[(x + y * 3) % oranges.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    // 8. Bamboo (Fresh lime green with darker nodes)
    this.bamboo = createPixelTexture((ctx, s) => {
      ctx.fillStyle = '#689d2c';
      ctx.fillRect(0, 0, s, s);
      // Vertical grain
      for (let x = 0; x < s; x += 3) {
        ctx.fillStyle = '#7bb836';
        ctx.fillRect(x, 0, 1, s);
      }
      // Bamboo node band
      ctx.fillStyle = '#4c751e';
      ctx.fillRect(0, 7, s, 2);
      ctx.fillStyle = '#90d640';
      ctx.fillRect(0, 9, s, 1);
    });

    // 9. Cobblestone
    this.cobblestone = createPixelTexture((ctx, s) => {
      const grays = ['#737373', '#5a5a5a', '#858585', '#484848', '#636363'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = grays[(x * 7 + y * 11) % grays.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Mortar grooves
      ctx.fillStyle = '#3a3a3a';
      for (let y = 0; y < s; y += 4) {
        ctx.fillRect(0, y, s, 1);
      }
      for (let x = 0; x < s; x += 4) {
        ctx.fillRect(x, 0, 1, s);
      }
    });

    // 10. Mossy Cobblestone
    this.mossyCobblestone = createPixelTexture((ctx, s) => {
      const grays = ['#737373', '#5a5a5a', '#858585', '#484848'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = grays[(x * 7 + y * 11) % grays.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Creeping moss
      const moss = ['#4d7828', '#5c8c32', '#3e6220'];
      for (let i = 0; i < 35; i++) {
        const mx = (i * 9) % s;
        const my = (i * 13) % s;
        ctx.fillStyle = moss[i % moss.length];
        ctx.fillRect(mx, my, 1, 1);
      }
    });

    // 11. Lava (Molten fiery orange & yellow)
    this.lava = createPixelTexture((ctx, s) => {
      const lavas = ['#d84d16', '#e06b18', '#f2961e', '#f5b525', '#b8320e'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = lavas[(x * 3 + y * 5 + (x ^ y)) % lavas.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    // 12. Steve Hair (Solid brown hair across the back)
    this.steveHair = createPixelTexture((ctx, s) => {
      const browns = ['#4a2e18', '#3c2412', '#56351c', '#331f10'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = browns[(x * 3 + y * 7) % browns.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Lower neck skin line for back of head
      ctx.fillStyle = '#b37a4e';
      ctx.fillRect(2, s - 3, s - 4, 3);
    });

    // 13. Steve Face (Front facing)
    this.steveFace = createPixelTexture((ctx, s) => {
      // Skin base
      ctx.fillStyle = '#c68c53';
      ctx.fillRect(0, 0, s, s);
      // Hair fringe top
      ctx.fillStyle = '#4a2e18';
      ctx.fillRect(0, 0, s, 4);
      ctx.fillRect(0, 4, 3, 3);
      ctx.fillRect(s - 3, 4, 3, 3);
      // Blue Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3, 8, 3, 2);
      ctx.fillRect(10, 8, 3, 2);
      ctx.fillStyle = '#2c428a';
      ctx.fillRect(4, 8, 2, 2);
      ctx.fillRect(10, 8, 2, 2);
      // Nose
      ctx.fillStyle = '#aa6f3b';
      ctx.fillRect(7, 10, 2, 2);
      // Mouth
      ctx.fillStyle = '#5a2e1a';
      ctx.fillRect(6, 12, 4, 1);
    });

    // 14. Steve Shirt Front (Cyan with neck cutout)
    this.steveShirt = createPixelTexture((ctx, s) => {
      const cyans = ['#00a3a6', '#009497', '#00b5b8', '#008386'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = cyans[(x * 5 + y * 7) % cyans.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Neck collar cutout
      ctx.fillStyle = '#c68c53';
      ctx.fillRect(6, 0, 4, 4);
      ctx.fillRect(7, 4, 2, 1);
    });

    // 15. Steve Shirt Back (Solid cyan back)
    this.steveShirtBack = createPixelTexture((ctx, s) => {
      const cyans = ['#00a3a6', '#009497', '#00b5b8', '#008386'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = cyans[(x * 5 + y * 7) % cyans.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Dark waistline hem
      ctx.fillStyle = '#006c6e';
      ctx.fillRect(0, s - 2, s, 2);
    });

    // 16. Steve Jeans
    this.steveJeans = createPixelTexture((ctx, s) => {
      const blues = ['#283556', '#1e2842', '#32426c', '#1b233a'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = blues[(x * 3 + y * 7) % blues.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Boots on bottom 4 pixels
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(0, s - 4, s, 4);
    });

    // 17. Steve Skin
    this.steveSkin = createPixelTexture((ctx, s) => {
      const skinColors = ['#c68c53', '#b37a4e', '#d2965d', '#a46a3c'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = skinColors[(x * 3 + y * 5) % skinColors.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    // 18. Creeper Skin (Mottled green camo)
    this.creeperSkin = createPixelTexture((ctx, s) => {
      const greens = ['#4da734', '#367d23', '#5bc33e', '#2c671b', '#6cd949'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = greens[(x * 7 + y * 13) % greens.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    // 19. Creeper Face (Iconic black frowning mouth and eyes)
    this.creeperFace = createPixelTexture((ctx, s) => {
      // Camo base
      const greens = ['#4da734', '#367d23', '#5bc33e', '#2c671b'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = greens[(x * 7 + y * 13) % greens.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Black eyes
      ctx.fillStyle = '#0f170e';
      ctx.fillRect(3, 4, 3, 3);
      ctx.fillRect(10, 4, 3, 3);
      // Frown mouth
      ctx.fillRect(6, 7, 4, 4);
      ctx.fillRect(5, 9, 6, 4);
      ctx.fillRect(5, 13, 2, 3);
      ctx.fillRect(9, 13, 2, 3);
    });

    // 20. Zombie Skin (Decayed green mossy skin)
    this.zombieSkin = createPixelTexture((ctx, s) => {
      const greens = ['#4c7847', '#3a5f36', '#5c8c56', '#2b4728'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = greens[(x * 7 + y * 11) % greens.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Zombie eyes (black sockets)
      ctx.fillStyle = '#1a2619';
      ctx.fillRect(3, 6, 3, 2);
      ctx.fillRect(10, 6, 3, 2);
    });

    // 21. Zombie Shirt (Tattered cyan)
    this.zombieShirt = createPixelTexture((ctx, s) => {
      const cyans = ['#007a7d', '#006568', '#008a8d', '#005356'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = cyans[(x * 5 + y * 7) % cyans.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    // 22. Spider Skin (Dark brown/black hairy texture with glowing red eyes)
    this.spiderSkin = createPixelTexture((ctx, s) => {
      const darks = ['#1f1814', '#15100d', '#2b221d', '#0f0b09'];
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          ctx.fillStyle = darks[(x * 3 + y * 7) % darks.length];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Glowing red eyes
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(4, 7, 2, 2);
      ctx.fillRect(10, 7, 2, 2);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(2, 8, 1, 1);
      ctx.fillRect(13, 8, 1, 1);
    });

    // 23. TNT Side
    this.tntSide = createPixelTexture((ctx, s) => {
      // Red background
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(0, 0, s, s);
      // Dynamite sticks pattern
      for (let x = 0; x < s; x += 4) {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 1, 0, 2, s);
      }
      // White center band
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 6, s, 5);
      // Black "TNT" text
      ctx.fillStyle = '#111827';
      // T
      ctx.fillRect(2, 7, 3, 1);
      ctx.fillRect(3, 8, 1, 2);
      // N
      ctx.fillRect(6, 7, 1, 3);
      ctx.fillRect(7, 8, 1, 1);
      ctx.fillRect(8, 7, 1, 3);
      // T
      ctx.fillRect(10, 7, 3, 1);
      ctx.fillRect(11, 8, 1, 2);
    });

    // 24. TNT Top
    this.tntTop = createPixelTexture((ctx, s) => {
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(0, 0, s, s);
      // Fuse center
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(7, 7, 2, 2);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(8, 6, 1, 1);
    });

    // 25. Emerald Texture
    this.emeraldTexture = createPixelTexture((ctx, s) => {
      ctx.clearRect(0, 0, s, s);
      // Emerald gem shape (octagon)
      ctx.fillStyle = '#065f46'; // dark border
      ctx.fillRect(5, 2, 6, 12);
      ctx.fillRect(2, 5, 12, 6);
      ctx.fillRect(3, 3, 10, 10);

      ctx.fillStyle = '#10b981'; // body
      ctx.fillRect(4, 4, 8, 8);

      ctx.fillStyle = '#6ee7b7'; // top-left highlights
      ctx.fillRect(4, 4, 3, 3);
      ctx.fillRect(5, 3, 4, 1);
      ctx.fillRect(3, 5, 1, 4);

      ctx.fillStyle = '#047857'; // shadow bottom-right
      ctx.fillRect(8, 8, 4, 4);
    });
  }
}
