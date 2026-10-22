import React, { useState, useEffect, useRef } from 'react';
import { AppMode, SavedReading } from '../types';
import { Eye, Sparkles, Compass, SplitSquareVertical, BookOpen, Volume2, VolumeX, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  savedReadingsCount: number;
  onOpenVault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  savedReadingsCount,
  onOpenVault,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscGainRef = useRef<GainNode | null>(null);

  // Subtle 528Hz Solfeggio / 432Hz ambient drone using Web Audio API
  const toggleAmbientSound = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
        masterGain.connect(ctx.destination);
        oscGainRef.current = masterGain;

        // Fundamental drone 108Hz (subharmonic of 432Hz)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(108, ctx.currentTime);

        // Harmonic overtone 216Hz
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(216, ctx.currentTime);

        // Ethereal chime tone 528Hz (Love / DNA repair frequency)
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(528, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        const gain3 = ctx.createGain();
        gain3.gain.setValueAtTime(0.2, ctx.currentTime);
        osc3.connect(gain3);
        gain3.connect(filter);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        osc3.start();

        setIsPlayingAudio(true);
      } catch (e) {
        console.warn('AudioContext not allowed or failed:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-[#080a10]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Identity: Osiris Ecosystem */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-indigo-950/60 to-purple-900/30 border border-amber-500/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <span className="font-cinzel text-lg font-bold text-amber-300">𓁹</span>
              <div className="absolute -inset-0.5 rounded-xl border border-amber-400/20 animate-pulse pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.25em] text-amber-400/80 font-cinzel uppercase font-semibold">
                  Osiris Ecosystem
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
                  <ShieldCheck className="w-2.5 h-2.5" /> Lifetime Patron
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-cinzel font-medium text-slate-100 tracking-wide">
                The Somatic &amp; Divinatory Mirror
              </h1>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-[#0f121d] border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setMode('somatic')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'somatic'
                  ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-200 border border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Somatic Mirror &amp; Divination</span>
            </button>

            <button
              onClick={() => setMode('syncretic')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'syncretic'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-200 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Syncretic Star &amp; Hexagram</span>
            </button>

            <button
              onClick={() => setMode('split')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'split'
                  ? 'bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 text-slate-100 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-purple-400" />
              <span>Dual Sanctuary (Side-by-Side)</span>
            </button>
          </nav>

          {/* Right Action Tools: Ambience, Vault, Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Sound Drone */}
            <button
              onClick={toggleAmbientSound}
              title={isPlayingAudio ? 'Mute 528Hz Ambient Drone' : 'Enable 528Hz Ambient Solfeggio Drone'}
              className={`p-2 rounded-lg border transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Saved Readings Vault */}
            <button
              onClick={onOpenVault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/30 text-xs font-medium text-slate-300 hover:text-amber-200 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Vault</span>
              {savedReadingsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {savedReadingsCount}
                </span>
              )}
            </button>

            {/* Account Avatar */}
            <button
              onClick={onOpenVault}
              title="dawmmilazzo7@gmail.com — Lifetime Cosmos Patron"
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-indigo-900/20 border border-amber-500/20 text-xs text-amber-200/90 hover:border-amber-500/40 transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold text-amber-300">
                DM
              </div>
              <span className="hidden lg:inline text-[11px] font-medium text-slate-300 truncate max-w-[120px]">
                dawmmilazzo7
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60">
          <button
            onClick={() => setMode('somatic')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] ${
              mode === 'somatic' ? 'text-amber-300 bg-amber-500/15 font-semibold' : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Somatic Mirror
          </button>
          <button
            onClick={() => setMode('syncretic')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] ${
              mode === 'syncretic' ? 'text-indigo-300 bg-indigo-500/15 font-semibold' : 'text-slate-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Syncretic Oracle
          </button>
          <button
            onClick={() => setMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] ${
              mode === 'split' ? 'text-purple-300 bg-purple-500/15 font-semibold' : 'text-slate-400'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" /> Dual View
          </button>
        </div>
      </div>
    </header>
  );
};
