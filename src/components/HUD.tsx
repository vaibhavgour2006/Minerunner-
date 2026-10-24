import React from 'react';
import { ActivePowerUp, GameStats } from '../types/game';
import { EMERALD_BASE64 } from '../graphics/textures';

interface HUDProps {
  stats: GameStats;
  activePowerUps: ActivePowerUp[];
  milestoneMsg: string | null;
  onPause: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onSlide: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  activePowerUps,
  milestoneMsg,
  onPause,
  onMoveLeft,
  onMoveRight,
  onJump,
  onSlide,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-5 select-none font-pixel">
      
      {/* TOP BAR */}
      <div className="flex items-start justify-between w-full">
        
        {/* Top-Left: Version & Score Stats */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {/* Version & Title Badge */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-black/75 border border-zinc-600 text-[10px] text-yellow-400 font-silkscreen rounded-xs shadow">
              MINERUNNER V2
            </span>
            <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-600 text-[10px] text-emerald-300 font-silkscreen rounded-xs">
              JUNGLE BIOME
            </span>
          </div>

          {/* Score Box */}
          <div className="px-3 py-1.5 bg-black/80 border-2 border-zinc-700 rounded-xs shadow-lg flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-zinc-400 font-silkscreen">SCORE</span>
              <span className="text-lg sm:text-2xl text-white font-bold tracking-wider mc-shadow">
                {stats.score.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-zinc-300 font-silkscreen mt-0.5">
              <span>DIST: <b className="text-yellow-400">{stats.distance}m</b></span>
              <span>MULT: <b className="text-amber-400">{stats.multiplier}x</b></span>
            </div>
          </div>
        </div>

        {/* Top-Center Milestone Popup */}
        {milestoneMsg && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-yellow-500/90 border-2 border-yellow-200 text-black text-xs sm:text-sm font-bold tracking-widest rounded-xs shadow-[0_0_20px_rgba(234,179,8,0.7)] animate-bounce font-pixel">
            ★ {milestoneMsg} ★
          </div>
        )}

        {/* Top-Right: Emeralds & Pause Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Emerald Counter Pill */}
          <div className="px-3 py-1.5 bg-black/80 border-2 border-emerald-700 rounded-xs flex items-center gap-2 shadow-lg">
            <img
              src={EMERALD_BASE64}
              alt="Emerald"
              className="w-5 h-5 image-rendering-pixelated"
            />
            <span className="text-emerald-400 text-sm sm:text-base font-bold mc-shadow">
              {stats.emeralds}
            </span>
          </div>

          {/* Pause Button */}
          <button
            onClick={onPause}
            className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 border-2 border-zinc-600 text-white rounded-xs flex items-center justify-center text-xs shadow-md cursor-pointer"
            title="Pause (Esc / P)"
          >
            ⏸
          </button>
        </div>

      </div>

      {/* ACTIVE POWER-UPS TRAY */}
      {activePowerUps.length > 0 && (
        <div className="flex flex-col gap-1.5 self-center sm:self-start w-full max-w-xs pointer-events-auto mt-2">
          {activePowerUps.map((p) => {
            const pct = Math.max(0, Math.min(100, (p.remainingTime / p.totalTime) * 100));
            const info = getPowerUpInfo(p.type);
            return (
              <div
                key={p.type}
                className="px-2.5 py-1 bg-black/85 border border-zinc-700 rounded-xs flex flex-col gap-0.5 shadow-md"
              >
                <div className="flex items-center justify-between text-[10px] text-white font-silkscreen">
                  <span className="flex items-center gap-1 font-bold">
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </span>
                  <span className="text-zinc-400">{p.remainingTime.toFixed(1)}s</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${info.colorClass} transition-all duration-75`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOTTOM: TOUCH CONTROLS (Mobile Friendly & Fallback) */}
      <div className="w-full flex items-end justify-between pointer-events-auto pt-6">
        
        {/* Left / Right Directional Buttons */}
        <div className="flex items-center gap-2">
          <button
            onTouchStart={(e) => { e.preventDefault(); onMoveLeft(); }}
            onClick={onMoveLeft}
            className="w-13 h-13 sm:w-16 sm:h-16 bg-black/55 hover:bg-black/75 active:bg-yellow-500/80 border-2 border-zinc-500 active:border-yellow-400 text-white rounded-xs flex items-center justify-center text-xl sm:text-2xl shadow-xl transition-transform active:scale-95 cursor-pointer touch-none"
            aria-label="Move Left"
          >
            ◀
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onMoveRight(); }}
            onClick={onMoveRight}
            className="w-13 h-13 sm:w-16 sm:h-16 bg-black/55 hover:bg-black/75 active:bg-yellow-500/80 border-2 border-zinc-500 active:border-yellow-400 text-white rounded-xs flex items-center justify-center text-xl sm:text-2xl shadow-xl transition-transform active:scale-95 cursor-pointer touch-none"
            aria-label="Move Right"
          >
            ▶
          </button>
        </div>

        {/* Jump & Slide Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onTouchStart={(e) => { e.preventDefault(); onSlide(); }}
            onClick={onSlide}
            className="w-13 h-13 sm:w-16 sm:h-16 bg-black/55 hover:bg-black/75 active:bg-amber-600/80 border-2 border-zinc-500 active:border-amber-400 text-white rounded-xs flex flex-col items-center justify-center shadow-xl transition-transform active:scale-95 cursor-pointer touch-none"
            aria-label="Slide / Duck"
          >
            <span className="text-lg">▼</span>
            <span className="text-[9px] font-silkscreen font-bold">SLIDE</span>
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onJump(); }}
            onClick={onJump}
            className="w-14 h-14 sm:w-18 sm:h-18 bg-emerald-900/60 hover:bg-emerald-800/80 active:bg-emerald-500/90 border-2 border-emerald-500 active:border-white text-white rounded-xs flex flex-col items-center justify-center shadow-xl transition-transform active:scale-95 cursor-pointer touch-none"
            aria-label="Jump"
          >
            <span className="text-xl">▲</span>
            <span className="text-[10px] font-silkscreen font-bold">JUMP</span>
          </button>
        </div>

      </div>

    </div>
  );
};

function getPowerUpInfo(type: string): { label: string; icon: string; colorClass: string } {
  switch (type) {
    case 'SHIELD':
      return { label: 'SHIELD TOTEM', icon: '🛡️', colorClass: 'bg-amber-400' };
    case 'SPEED':
      return { label: 'SPEED BOOST', icon: '⚡', colorClass: 'bg-red-500' };
    case 'MAGNET':
      return { label: 'EMERALD MAGNET', icon: '🧲', colorClass: 'bg-blue-400' };
    case 'ANTIGRAVITY':
      return { label: 'ANTIGRAVITY', icon: '🪶', colorClass: 'bg-cyan-400' };
    default:
      return { label: 'POWER-UP', icon: '⭐', colorClass: 'bg-yellow-400' };
  }
}
