# ⛏️ MineRunner V2 — 3D Voxel Endless Runner

![MineRunner Banner](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/gamepad-2.svg)

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**MineRunner V2** is a fast-paced, responsive 3D endless runner built with **React 19**, **Three.js**, and **Tailwind CSS**. Step into the boots of Steve as he sprints forward down a 3-lane track through an infinite, procedurally generated Minecraft-inspired landscape. Dodge full-height Creepers and Zombies, jump over fallen jungle logs, slide under ancient stone arches, and collect emeralds to set new high scores!

---

## 🎮 Key Gameplay Features

- **Forward-Facing 3rd-Person Perspective**: Over-the-shoulder camera positioned behind Steve as he sprints into the screen down the track, with authentic limb swinging, lane-change banking tilt, and slide diving animations.
- **Full-Height Mobs (Cannot Jump Over)**: Creepers and Zombies stand at full player height (~1.85m). Their vertical hitboxes prevent jumping over them—players must switch lanes or absorb the impact with a Shield Totem!
- **Lush Jungle Biome Borders**: The running track is flanked by towering jungle wood trees with climbing vines, hanging cocoa pods, bamboo groves, and tropical bushes fading into horizon mist.
- **Fair Procedural Obstacle Generation**: Obstacle patterns guarantee at least one safe or navigable lane at all times, with reaction windows that scale smoothly with running speed.
- **Dynamic 1:1 Voxel Ground Textures**: Procedural 16x16 pixel-art Minecraft textures (grass block top, grass side with dripping fringe, dirt, jungle bark, stone bricks, mossy cobblestone) rendered with `THREE.NearestFilter`.
- **4 Signature Power-Ups**:
  - 🛡️ **Totem of Undying (Shield)**: Renders a rotating golden aura, absorbs 1 fatal collision, and grants a brief invulnerability window.
  - ⚡ **Speed Potion**: Grants a 35% speed boost with flame trails and triples your score multiplier (**3x**).
  - 🧲 **Emerald Magnet**: Magnetically pulls all emeralds within a 12-meter radius towards Steve.
  - 🪶 **Antigravity Boots**: Halves gravity for high floaty jumps, slows time slightly for matrix-style dodges, and doubles score (**2x**).
- **Procedural Web Audio API Synthesizer**: 100% self-contained chiptune music tracker (kick, snare, hi-hats, bassline, and melodic lead) and retro sound effects—zero external audio file dependencies.
- **Mobile-First & Accessible**: Smooth touch swipe gestures (swipe left, right, up, down) plus on-screen touch buttons for mobile devices, along with reduced-motion toggles.

---

## 🕹️ Controls Guide

| Action | Desktop Keyboard | Mobile / Touch |
| :--- | :--- | :--- |
| **Move Left** | `A` or `◀ Left Arrow` | Swipe Left or Tap `◀` |
| **Move Right** | `D` or `▶ Right Arrow` | Swipe Right or Tap `▶` |
| **Jump** | `W`, `▲ Up Arrow`, or `Spacebar` | Swipe Up or Tap `▲ JUMP` |
| **Slide / Duck** | `S` or `▼ Down Arrow` | Swipe Down or Tap `▼ SLIDE` |
| **Mid-Air Dive** | Press `S` or `▼` while in the air | Fast downward plunge |
| **Pause / Resume** | `P` or `Escape` | Tap `⏸` on top-right HUD |

---

## 🚧 Obstacle Breakdown

| Obstacle Type | Height Profile | How to Evade |
| :--- | :--- | :--- |
| **Creeper** | **Full Height (1.85m)** | 🚫 **CANNOT JUMP!** Switch lanes or use Shield |
| **Zombie** | **Full Height (1.85m)** | 🚫 **CANNOT JUMP!** Switch lanes or use Shield |
| **TNT Crate** | **Full Blocker** | Switch lanes |
| **Fallen Jungle Log** | Low (0.6m) | Jump over (`▲` / `W`) |
| **Spiders** | Low (0.45m) | Jump over (`▲` / `W`) |
| **Mossy Stone Wall** | Low (0.65m) | Jump over (`▲` / `W`) |
| **Lava Trench** | Ground Gap | Jump over (`▲` / `W`) |
| **Jungle Canopy** | Overhead Hazard | Slide under (`▼` / `S`) |
| **Ancient Stone Arch** | Overhead Hazard | Slide under (`▼` / `S`) |

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics Engine**: [Three.js](https://threejs.org/) (WebGLRenderer, directional soft shadows, chunk recycling pool)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with pixel-art typography (`Press Start 2P`, `Silkscreen`) and custom 3D extruded Minecraft GUI styles
- **Audio Synthesis**: Web Audio API (real-time oscillators, noise buffers, biquad filters, and chiptune sequencer)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) for milestone and high score celebrations
- **Build Tool**: [Vite 8](https://vitejs.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/minerunner.git
   cd minerunner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to https://ai.studio/apps/35965250-5e06-4a8f-bbd7-60d7afa275d3 to play!

### Production Build

To build the project for production:

```bash
npm run build
```

The compiled, minified bundle will be generated in the `dist/` directory, ready to deploy to any static host (Vercel, GitHub Pages, Netlify, Cloud Run, Firebase Hosting, etc.).

---

## 📁 Project Structure

```text
minerunner/
├── index.html                   # HTML entry point with fonts & meta tags
├── metadata.json                # Project capabilities & configuration
├── package.json                 # Dependencies & build scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── src/
│   ├── main.tsx                 # React application root
│   ├── App.tsx                  # Main App component & event listeners
│   ├── index.css                # Tailwind CSS & Minecraft GUI styling
│   ├── types/
│   │   └── game.ts              # Game state, obstacle, and power-up types
│   ├── audio/
│   │   └── soundManager.ts      # Web Audio procedural music & SFX
│   ├── graphics/
│   │   ├── textures.ts          # Procedural 16x16 pixel textures & Emerald sprite
│   │   └── models.ts            # 3D models (Steve, Creeper, Zombie, Trees, Props)
│   ├── game/
│   │   └── GameEngine.ts        # Three.js physics, chunk recycling & game loop
│   └── components/
│       ├── MainMenu.tsx         # Minecraft-style 3D UI main menu box
│       ├── HUD.tsx              # In-game HUD, counters & touch controls
│       ├── PauseModal.tsx       # Pause & resume dialog
│       ├── GameOverModal.tsx    # Game over screen with high-score stats
│       ├── HowToPlayModal.tsx   # Tutorial overlay & obstacle rules
│       └── SettingsModal.tsx    # Volume sliders & reduced-motion toggle
```

---

## 📄 License

This project is licensed under the **Apache-2.0 License**. See the `LICENSE` file for more details.
