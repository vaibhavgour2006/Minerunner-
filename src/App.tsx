import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { ActivePowerUp, GameState, GameStats } from './types/game';
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('MENU');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [milestoneMsg, setMilestoneMsg] = useState<string | null>(null);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    distance: 0,
    emeralds: 0,
    multiplier: 1,
    speed: 20,
    biome: 'JUNGLE',
    nearMisses: 0,
  });

  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);

  // Load saved High Score and Emeralds
  useEffect(() => {
    const savedHighScore = parseInt(localStorage.getItem('minerunner_high_score') || '0', 10);
    const savedEmeralds = parseInt(localStorage.getItem('minerunner_total_emeralds') || '0', 10);
    setStats((prev) => ({
      ...prev,
      highScore: savedHighScore,
      emeralds: savedEmeralds,
    }));
  }, []);

  // Initialize GameEngine once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new GameEngine(canvasMountRef.current, {
      onStatsUpdate: (newStats) => {
        setStats(newStats);
      },
      onPowerUpsUpdate: (powerUps) => {
        setActivePowerUps(powerUps);
      },
      onGameOver: (finalStats) => {
        setStats(finalStats);
        setGameState('GAMEOVER');

        // Update stored emeralds
        const prevTotal = parseInt(localStorage.getItem('minerunner_total_emeralds') || '0', 10);
        localStorage.setItem('minerunner_total_emeralds', (prevTotal + finalStats.emeralds).toString());
      },
      onMilestone: (msg) => {
        setMilestoneMsg(msg);
        window.setTimeout(() => {
          setMilestoneMsg(null);
        }, 2400);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Handle Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      const key = e.key.toLowerCase();

      // Pause controls
      if (key === 'escape' || key === 'p') {
        if (gameState === 'PLAYING') {
          engineRef.current.pause();
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          engineRef.current.resume();
          setGameState('PLAYING');
        }
        return;
      }

      if (gameState !== 'PLAYING') return;

      if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        engineRef.current.moveLeft();
      } else if (key === 'd' || key === 'arrowright') {
        e.preventDefault();
        engineRef.current.moveRight();
      } else if (key === 'w' || key === 'arrowup' || key === ' ') {
        e.preventDefault();
        engineRef.current.jump();
      } else if (key === 's' || key === 'arrowdown') {
        e.preventDefault();
        engineRef.current.slide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Handle Touch Swipe Gestures
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (gameState !== 'PLAYING') return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameState !== 'PLAYING' || !engineRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const dt = Date.now() - startTime;

      if (dt > 400) return; // Too slow for swipe

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (Math.max(absX, absY) > 30) {
        if (absX > absY) {
          // Horizontal swipe
          if (dx > 0) engineRef.current.moveRight();
          else engineRef.current.moveLeft();
        } else {
          // Vertical swipe
          if (dy < 0) engineRef.current.jump();
          else engineRef.current.slide();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState]);

  // Actions
  const handleStartGame = () => {
    setGameState('PLAYING');
    engineRef.current?.startGame();
  };

  const handleResume = () => {
    setGameState('PLAYING');
    engineRef.current?.resume();
  };

  const handlePause = () => {
    setGameState('PAUSED');
    engineRef.current?.pause();
  };

  const handleRestart = () => {
    setGameState('PLAYING');
    engineRef.current?.startGame();
  };

  const handleMainMenu = () => {
    setGameState('MENU');
  };

  const handleToggleReducedMotion = (val: boolean) => {
    setReducedMotion(val);
    engineRef.current?.setReducedMotion(val);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      
      {/* Three.js Canvas Mount */}
      <div ref={canvasMountRef} className="absolute inset-0 z-0" />

      {/* Main Menu Overlay */}
      {gameState === 'MENU' && (
        <MainMenu
          highScore={stats.highScore}
          totalEmeralds={stats.emeralds}
          onStart={handleStartGame}
          onHowToPlay={() => setShowHowToPlay(true)}
          onSettings={() => setShowSettings(true)}
        />
      )}

      {/* In-Game HUD Overlay */}
      {gameState === 'PLAYING' && (
        <HUD
          stats={stats}
          activePowerUps={activePowerUps}
          milestoneMsg={milestoneMsg}
          onPause={handlePause}
          onMoveLeft={() => engineRef.current?.moveLeft()}
          onMoveRight={() => engineRef.current?.moveRight()}
          onJump={() => engineRef.current?.jump()}
          onSlide={() => engineRef.current?.slide()}
        />
      )}

      {/* Pause Menu Overlay */}
      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Game Over Overlay */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          stats={stats}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* How To Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          reducedMotion={reducedMotion}
          onToggleReducedMotion={handleToggleReducedMotion}
          onClose={() => setShowSettings(false)}
        />
      )}

    </div>
  );
}
