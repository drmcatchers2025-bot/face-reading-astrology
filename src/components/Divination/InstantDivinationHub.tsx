import React, { useState } from 'react';
import { DivinationType, SavedReading } from '../../types';
import { TarotReader } from './TarotReader';
import { RuneCaster } from './RuneCaster';
import { IChingCaster } from './IChingCaster';
import { Sparkles, Layers, Shield, Coins } from 'lucide-react';

interface InstantDivinationHubProps {
  onSaveToVault?: (reading: any) => void;
  defaultType?: DivinationType;
}

export const InstantDivinationHub: React.FC<InstantDivinationHubProps> = ({
  onSaveToVault,
  defaultType = 'tarot',
}) => {
  const [activeType, setActiveType] = useState<DivinationType>(defaultType);

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0e111d] to-[#080911] border border-amber-500/20 p-6 sm:p-8 shadow-2xl relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-cinzel tracking-[0.25em] text-amber-400 uppercase">
              Immediate Interpersonal Reads
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-serif">Direct Intuitive Vectors (No Birthdates Required)</span>
          </div>
          <h2 className="text-2xl font-cinzel font-semibold text-slate-100 flex items-center gap-2">
            <span>Instant Divination Casts</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
        </div>

        {/* System Selector Buttons: TAROT READ, RUNE CAST, I CHING */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveType('tarot')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-medium transition-all ${
              activeType === 'tarot'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>TAROT READ</span>
          </button>

          <button
            onClick={() => setActiveType('runes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-medium transition-all ${
              activeType === 'runes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>RUNE CAST</span>
          </button>

          <button
            onClick={() => setActiveType('iching')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-medium transition-all ${
              activeType === 'iching'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>I CHING</span>
          </button>
        </div>
      </div>

      {/* Render Active Cast System */}
      <div className="mt-6">
        {activeType === 'tarot' && <TarotReader onSaveToVault={onSaveToVault} />}
        {activeType === 'runes' && <RuneCaster onSaveToVault={onSaveToVault} />}
        {activeType === 'iching' && <IChingCaster onSaveToVault={onSaveToVault} />}
      </div>
    </div>
  );
};
