import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameStats } from '../types/game';
import { EMERALD_BASE64 } from '../graphics/textures';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRestart,
  onMainMenu,
}) => {
  const isNewHighScore = stats.score >= stats.highScore && stats.score > 0;

  useEffect(() => {
    if (isNewHighScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });
    }
  }, [isNewHighScore]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#27272a] border-4 border-[#3f3f46] rounded-sm p-6 sm:p-8 flex flex-col items-center shadow-2xl">
        
        {/* Red Game Over Banner Header */}
        <div className="px-6 py-2 bg-red-900/90 border-2 border-red-500 rounded-xs -mt-10 mb-4 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest font-pixel mc-shadow">
            YOU DIED!
          </h2>
        </div>

        {/* New High Score Tag */}
        {isNewHighScore && (
          <div className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-xs tracking-wider mb-3 animate-pulse font-silkscreen">
            ★ NEW HIGH SCORE! ★
          </div>
        )}

        {/* Stats Summary Card */}
        <div className="w-full bg-[#18181b] border-2 border-zinc-700 rounded-xs p-4 flex flex-col gap-2.5 font-silkscreen text-xs sm:text-sm my-2">
          
          <div className="flex items-center justify-between text-zinc-300">
            <span>FINAL SCORE:</span>
            <span className="text-lg font-bold text-white font-pixel mc-shadow">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>BEST SCORE:</span>
            <span className="font-bold text-amber-400 font-pixel">
              {stats.highScore.toLocaleString()}
            </span>
          </div>

          <div className="h-px bg-zinc-700 my-0.5"></div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>DISTANCE RUN:</span>
            <span className="font-bold text-zinc-200">{stats.distance} meters</span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>EMERALDS COLLECTED:</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <img src={EMERALD_BASE64} alt="Emerald" className="w-4 h-4 image-rendering-pixelated" />
              <span>{stats.emeralds}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>NEAR MISSES:</span>
            <span className="font-bold text-cyan-400">+{stats.nearMisses}</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mt-4">
          
          {/* PLAY AGAIN */}
          <button
            onClick={onRestart}
            className="mc-button w-full py-3.5 px-4 bg-[#4c7828] hover:bg-[#5b8c32] border-[#2c4718] border-b-6 active:border-b-2 text-white font-pixel text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>🔄</span>
            <span className="tracking-wider mc-shadow">PLAY AGAIN</span>
          </button>

          {/* MAIN MENU */}
          <button
            onClick={onMainMenu}
            className="mc-button w-full py-2.5 px-4 bg-[#52525b] hover:bg-[#71717a] border-[#27272a] border-b-5 active:border-b-2 text-zinc-200 font-pixel text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <span>🏠</span>
            <span className="tracking-wider mc-shadow">MAIN MENU</span>
          </button>

        </div>

      </div>
    </div>
  );
};
