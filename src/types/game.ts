export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type Lane = -1 | 0 | 1; // Left: -1, Center: 0, Right: 1

export type BiomeType = 'JUNGLE' | 'PLAINS' | 'DESERT' | 'TAIGA' | 'NETHER';

export type ObstacleType = 
  | 'CREEPER'       // Full-height (cannot jump over!)
  | 'ZOMBIE'        // Full-height (cannot jump over!)
  | 'JUNGLE_LOG'    // Low (jumpable)
  | 'STONE_WALL'    // Low (jumpable)
  | 'SPIDER'        // Low (jumpable)
  | 'LAVA_PIT'      // Ground gap (jumpable)
  | 'JUNGLE_CANOPY' // Overhead (must slide under!)
  | 'STONE_ARCH'    // Overhead (must slide under!)
  | 'TNT_CRATE';    // Full-height explosive (must dodge!)

export type PowerUpType = 'SHIELD' | 'SPEED' | 'MAGNET' | 'ANTIGRAVITY';

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number;
  totalTime: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  distance: number;
  emeralds: number;
  multiplier: number;
  speed: number;
  biome: BiomeType;
  nearMisses: number;
}
