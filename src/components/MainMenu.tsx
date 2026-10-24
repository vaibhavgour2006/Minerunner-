import React from 'react';
import { EMERALD_BASE64 } from '../graphics/textures';

interface MainMenuProps {
  highScore: number;
  totalEmeralds: number;
  onStart: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  highScore,
  totalEmeralds,
  onStart,
  onHowToPlay,
  onSettings,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      {/* Outer Minecraft Stone Wall Box */}
      <div className="relative w-full max-w-lg bg-[#27272a] border-4 border-[#3f3f46] rounded-sm shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        
        {/* Top Overhanging Grass Roof & Wooden Crossbeam */}
        <div className="absolute -top-7 left-0 right-0 h-7 bg-[#4c7828] border-t-4 border-[#5b8c32] rounded-t-sm flex items-end justify-between px-3 overflow-visible">
          {/* Protruding grass tuft blades */}
          <div className="flex gap-1.5 -mb-1">
            <div className="w-2.5 h-3.5 bg-[#6a9f3b] rounded-t-xs"></div>
            <div className="w-2 h-4.5 bg-[#5b8c32] rounded-t-xs"></div>
            <div className="w-3 h-3 bg-[#4c7828] rounded-t-xs"></div>
          </div>
          <div className="flex gap-1 -mb-1">
            <div className="w-2 h-4 bg-[#6a9f3b] rounded-t-xs"></div>
            <div className="w-3 h-5 bg-[#5b8c32] rounded-t-xs"></div>
          </div>
          <div className="flex gap-1.5 -mb-1">
            <div className="w-3 h-4 bg-[#5b8c32] rounded-t-xs"></div>
            <div className="w-2 h-5 bg-[#6a9f3b] rounded-t-xs"></div>
            <div className="w-2.5 h-3 bg-[#4c7828] rounded-t-xs"></div>
          </div>
        </div>

        {/* Left Hanging Lantern */}
        <div className="absolute -top-3 -left-3 flex flex-col items-center">
          <div className="w-1 h-6 bg-[#1f2937]"></div>
          <div className="w-7 h-9 bg-[#18181b] border-2 border-[#3f3f46] rounded-xs flex items-center justify-center lantern-glow">
            <div className="w-4 h-5 bg-[#f59e0b] rounded-xs shadow-[0_0_12px_#f59e0b]"></div>
          </div>
        </div>

        {/* Right Hanging Lantern */}
        <div className="absolute -top-3 -right-3 flex flex-col items-center">
          <div className="w-1 h-6 bg-[#1f2937]"></div>
          <div className="w-7 h-9 bg-[#18181b] border-2 border-[#3f3f46] rounded-xs flex items-center justify-center lantern-glow">
            <div className="w-4 h-5 bg-[#f59e0b] rounded-xs shadow-[0_0_12px_#f59e0b]"></div>
          </div>
        </div>

        {/* Title: 3D Extruded MINERUNNER */}
        <div className="flex items-center justify-center gap-1 mt-2 mb-1">
          <span className="text-3xl sm:text-5xl font-black tracking-wider title-mine font-pixel">
            MINE
          </span>
          <span className="text-3xl sm:text-5xl font-black tracking-wider title-runner font-pixel">
            RUNNER
          </span>
        </div>

        {/* Carved Oak Subtitle Plaque */}
        <div className="relative mt-2 mb-6 px-5 py-1.5 bg-[#85542e] border-2 border-[#543319] shadow-md rounded-xs flex items-center justify-center">
          {/* Plaque Corner Nail Studs */}
          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-[#2b180d] rounded-full"></div>
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#2b180d] rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-[#2b180d] rounded-full"></div>
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#2b180d] rounded-full"></div>

          <span className="text-xs sm:text-sm font-bold text-[#fef3c7] tracking-widest font-silkscreen mc-shadow-sm uppercase">
            VOXEL ENDLESS RUNNER - V2
          </span>
        </div>

        {/* 3 Action Buttons */}
        <div className="w-full flex flex-col gap-3.5 max-w-xs my-2">
          
          {/* 1. START RUN Button (Grass block themed) */}
          <button
            onClick={onStart}
            className="mc-button w-full py-3.5 px-4 bg-[#4c7828] hover:bg-[#5b8c32] border-[#2c4718] border-b-6 active:border-b-2 text-white font-pixel text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg group cursor-pointer"
          >
            {/* Bronze Corner Brackets */}
            <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t-2 border-l-2 border-[#f59e0b]"></div>
            <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t-2 border-r-2 border-[#f59e0b]"></div>
            <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b-2 border-l-2 border-[#f59e0b]"></div>
            <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b-2 border-r-2 border-[#f59e0b]"></div>

            <span className="text-lg text-yellow-300 group-hover:scale-110 transition-transform">▶</span>
            <span className="tracking-wider mc-shadow">START RUN</span>
          </button>

          {/* 2. HOW TO PLAY Button (Oak wood planks themed) */}
          <button
            onClick={onHowToPlay}
            className="mc-button w-full py-3 px-4 bg-[#926037] hover:bg-[#a67041] border-[#55361c] border-b-5 active:border-b-2 text-[#fef3c7] font-pixel text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md group cursor-pointer"
          >
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#d97706]"></div>
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#d97706]"></div>
            <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#d97706]"></div>
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#d97706]"></div>

            <span className="text-sm">📖</span>
            <span className="tracking-wide mc-shadow">HOW TO PLAY</span>
          </button>

          {/* 3. SETTINGS Button (Chiseled stone themed) */}
          <button
            onClick={onSettings}
            className="mc-button w-full py-2.5 px-4 bg-[#52525b] hover:bg-[#71717a] border-[#27272a] border-b-5 active:border-b-2 text-zinc-100 font-pixel text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md group cursor-pointer"
          >
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#a1a1aa]"></div>
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#a1a1aa]"></div>
            <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#a1a1aa]"></div>
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#a1a1aa]"></div>

            <span className="text-sm">⚙️</span>
            <span className="tracking-wide mc-shadow">SETTINGS</span>
          </button>
        </div>

        {/* Bottom Recessed Stats Frame */}
        <div className="w-full max-w-sm mt-5 py-2.5 px-4 bg-[#18181b] border-2 border-[#3f3f46] rounded-xs flex items-center justify-between text-xs font-silkscreen shadow-inner">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span>🏆</span>
            <span>HIGH: {highScore.toLocaleString()}</span>
          </div>
          <div className="h-4 w-px bg-zinc-600"></div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <img src={EMERALD_BASE64} alt="Emerald" className="w-4 h-4 image-rendering-pixelated" />
            <span>TOTAL: {totalEmeralds}</span>
          </div>
        </div>

        {/* Environmental Props in Corners */}
        {/* Bottom-Left: Crafting Table + Torch */}
        <div className="absolute -bottom-3 -left-3 flex items-end">
          <div className="relative w-8 h-8 bg-[#85542e] border-2 border-[#543319] rounded-xs shadow-md">
            {/* Grid top of crafting table */}
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-0.5 gap-0.5">
              <div className="bg-[#663f20]"></div>
              <div className="bg-[#99653a]"></div>
              <div className="bg-[#99653a]"></div>
              <div className="bg-[#663f20]"></div>
            </div>
          </div>
          {/* Wall-mounted flaming torch */}
          <div className="absolute -top-7 left-2 flex flex-col items-center">
            <div className="w-2.5 h-3.5 bg-yellow-400 rounded-full torch-flame"></div>
            <div className="w-1.5 h-5 bg-[#55361c]"></div>
          </div>
        </div>

        {/* Bottom-Right: Grass block + resting lantern */}
        <div className="absolute -bottom-3 -right-3 flex items-end">
          <div className="relative w-8 h-8 bg-[#866043] border-2 border-[#4c7828] rounded-xs shadow-md overflow-hidden">
            <div className="h-2.5 bg-[#5b8c32] w-full"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
