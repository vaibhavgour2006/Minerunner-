import React from 'react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[#27272a] border-4 border-[#3f3f46] rounded-sm p-6 max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h3 className="text-base sm:text-lg font-black text-white font-pixel mc-shadow">
              HOW TO PLAY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 text-white font-pixel text-xs rounded-xs flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-4 font-silkscreen text-xs text-zinc-300">
          
          {/* Controls */}
          <div className="bg-[#18181b] p-3 rounded-xs border border-zinc-700">
            <h4 className="text-yellow-400 font-pixel text-xs mb-2">CONTROLS:</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><b>A / ◀ Arrow</b>: Move Left</div>
              <div><b>D / ▶ Arrow</b>: Move Right</div>
              <div><b>W / ▲ / Space</b>: Jump</div>
              <div><b>S / ▼ Arrow</b>: Slide / Duck</div>
              <div><b>P / Esc</b>: Pause</div>
              <div><b>Touch / Swipe</b>: Mobile controls</div>
            </div>
          </div>

          {/* Full Height Mobs Rule */}
          <div className="bg-red-950/40 p-3 rounded-xs border border-red-700">
            <h4 className="text-red-400 font-pixel text-xs mb-1.5 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>CREEPERS & ZOMBIES (FULL HEIGHT)</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-zinc-200">
              Creepers and Zombies are the <b>same height as Steve</b>. You <b>CANNOT jump over them!</b> You must dodge into another lane, or absorb the collision with a Shield Totem!
            </p>
          </div>

          {/* Jumpable vs Slidable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-[#18181b] p-2.5 rounded-xs border border-zinc-700">
              <span className="text-emerald-400 font-bold block mb-1">▲ JUMP OVER:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-zinc-400">
                <li>Fallen Jungle Logs</li>
                <li>Low Spiders</li>
                <li>Mossy Stone Walls</li>
                <li>Lava Trenches</li>
              </ul>
            </div>

            <div className="bg-[#18181b] p-2.5 rounded-xs border border-zinc-700">
              <span className="text-amber-400 font-bold block mb-1">▼ SLIDE UNDER:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-zinc-400">
                <li>Hanging Jungle Canopies</li>
                <li>Ancient Stone Arches</li>
                <li>Suspended Beams</li>
              </ul>
            </div>
          </div>

          {/* Power-ups */}
          <div className="bg-[#18181b] p-3 rounded-xs border border-zinc-700">
            <h4 className="text-cyan-400 font-pixel text-xs mb-2">POWER-UPS:</h4>
            <div className="space-y-1.5 text-[11px]">
              <div><b>🛡️ Shield Totem</b>: Absorbs 1 fatal hit and grants invulnerability.</div>
              <div><b>⚡ Speed Potion</b>: +35% running speed & 3x score multiplier!</div>
              <div><b>🧲 Emerald Magnet</b>: Attracts all nearby emeralds automatically.</div>
              <div><b>🪶 Antigravity</b>: Halves gravity for mega float jumps & 2x score!</div>
            </div>
          </div>

        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mc-button w-full mt-5 py-2.5 bg-[#4c7828] hover:bg-[#5b8c32] border-[#2c4718] border-b-4 text-white font-pixel text-xs flex items-center justify-center cursor-pointer shadow"
        >
          GOT IT, LET'S RUN!
        </button>

      </div>
    </div>
  );
};
