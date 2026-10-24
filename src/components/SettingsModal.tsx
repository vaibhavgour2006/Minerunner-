import React, { useState } from 'react';
import { soundManager } from '../audio/soundManager';

interface SettingsModalProps {
  reducedMotion: boolean;
  onToggleReducedMotion: (val: boolean) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  reducedMotion,
  onToggleReducedMotion,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [musicVol, setMusicVol] = useState(soundManager.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(soundManager.getSfxVolume());

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVol(val);
    soundManager.setMusicVolume(val);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundManager.setSfxVolume(val);
    soundManager.playEmerald(); // preview sfx
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-[#27272a] border-4 border-[#3f3f46] rounded-sm p-6 flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-base font-black text-white font-pixel mc-shadow">
              SETTINGS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 text-white font-pixel text-xs rounded-xs flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 font-silkscreen text-xs text-zinc-300">
          
          {/* Mute Audio */}
          <div className="flex items-center justify-between bg-[#18181b] p-3 rounded-xs border border-zinc-700">
            <span>MUTE ALL AUDIO:</span>
            <button
              onClick={handleMuteToggle}
              className={`px-3 py-1 font-pixel text-[11px] rounded-xs border ${
                isMuted ? 'bg-red-900 border-red-500 text-red-200' : 'bg-emerald-900 border-emerald-500 text-emerald-200'
              }`}
            >
              {isMuted ? 'MUTED' : 'UNMUTED'}
            </button>
          </div>

          {/* Music Volume */}
          <div className="flex flex-col gap-1.5 bg-[#18181b] p-3 rounded-xs border border-zinc-700">
            <div className="flex items-center justify-between">
              <span>MUSIC VOLUME:</span>
              <span className="text-yellow-400 font-bold">{Math.round(musicVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVol}
              onChange={handleMusicChange}
              disabled={isMuted}
              className="accent-yellow-500 cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div className="flex flex-col gap-1.5 bg-[#18181b] p-3 rounded-xs border border-zinc-700">
            <div className="flex items-center justify-between">
              <span>SFX VOLUME:</span>
              <span className="text-emerald-400 font-bold">{Math.round(sfxVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVol}
              onChange={handleSfxChange}
              disabled={isMuted}
              className="accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between bg-[#18181b] p-3 rounded-xs border border-zinc-700">
            <span>REDUCED MOTION:</span>
            <button
              onClick={() => onToggleReducedMotion(!reducedMotion)}
              className={`px-3 py-1 font-pixel text-[11px] rounded-xs border ${
                reducedMotion ? 'bg-emerald-900 border-emerald-500 text-emerald-200' : 'bg-zinc-800 border-zinc-600 text-zinc-300'
              }`}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="mc-button w-full mt-5 py-2.5 bg-[#4c7828] hover:bg-[#5b8c32] border-[#2c4718] border-b-4 text-white font-pixel text-xs flex items-center justify-center cursor-pointer shadow"
        >
          SAVE & CLOSE
        </button>

      </div>
    </div>
  );
};
