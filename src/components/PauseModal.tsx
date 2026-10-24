import React from 'react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-[#27272a] border-4 border-[#3f3f46] rounded-sm p-6 sm:p-8 flex flex-col items-center shadow-2xl">
        
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-yellow-400 tracking-widest font-pixel mc-shadow mb-6">
          GAME PAUSED
        </h2>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 font-pixel text-xs">
          
          {/* RESUME */}
          <button
            onClick={onResume}
            className="mc-button w-full py-3.5 bg-[#4c7828] hover:bg-[#5b8c32] border-[#2c4718] border-b-6 active:border-b-2 text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>▶</span>
            <span className="tracking-wider mc-shadow">RESUME RUN</span>
          </button>

          {/* RESTART */}
          <button
            onClick={onRestart}
            className="mc-button w-full py-3 bg-[#926037] hover:bg-[#a67041] border-[#55361c] border-b-5 active:border-b-2 text-[#fef3c7] flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <span>🔄</span>
            <span className="tracking-wider mc-shadow">RESTART</span>
          </button>

          {/* MAIN MENU */}
          <button
            onClick={onMainMenu}
            className="mc-button w-full py-2.5 bg-[#52525b] hover:bg-[#71717a] border-[#27272a] border-b-5 active:border-b-2 text-zinc-200 flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <span>🏠</span>
            <span className="tracking-wider mc-shadow">MAIN MENU</span>
          </button>

        </div>

      </div>
    </div>
  );
};
