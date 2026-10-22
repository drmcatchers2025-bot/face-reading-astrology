import React from 'react';
import { PortraitSlot, FaceAnalysisResult, ComparativeMatchResult } from '../types';
import { FaceUploader } from './SomaticMirror/FaceUploader';
import { ComparativeFaceMatch } from './SomaticMirror/ComparativeFaceMatch';
import { InstantDivinationHub } from './Divination/InstantDivinationHub';
import { CelestialCalculator } from './SyncreticOracle/CelestialCalculator';
import { Sparkles, ArrowRight, ShieldCheck, Eye, Compass, Layers } from 'lucide-react';

interface SplitViewProps {
  slot1: PortraitSlot;
  slot2: PortraitSlot;
  onUpdateSlot1: (updated: Partial<PortraitSlot>) => void;
  onUpdateSlot2: (updated: Partial<PortraitSlot>) => void;
  onAnalyzeFaceMatch: () => void;
  matchResult: ComparativeMatchResult | null;
  matchLoading: boolean;
  onAnalyzeSingle: (slotId: '1' | '2') => void;
  onSaveToVault: (reading: any) => void;
}

export const SplitView: React.FC<SplitViewProps> = ({
  slot1,
  slot2,
  onUpdateSlot1,
  onUpdateSlot2,
  onAnalyzeFaceMatch,
  matchResult,
  matchLoading,
  onAnalyzeSingle,
  onSaveToVault,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Ecosystem Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-amber-400/40 flex items-center justify-center text-amber-300 font-cinzel text-base">
            𓁹
          </div>
          <div>
            <h3 className="text-sm font-cinzel font-semibold text-slate-100">
              Osiris Dual Sanctuary · Side-by-Side Ecosystem Bridge
            </h3>
            <p className="text-xs text-slate-400 font-serif">
              Left: Celestial Orbit (Date-Based) · Right: The Somatic &amp; Divinatory Mirror (Intuitive &amp; Form)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            Account: dawmmilazzo7@gmail.com
          </span>
          <span className="text-[10px] font-cinzel px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Lifetime Access Active
          </span>
        </div>
      </div>

      {/* The Two Distinct Interfaces Side-by-Side (Desktop 2-Col Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ======================================================== */}
        {/* APP 1 (LEFT): SYNCRETIC STAR & HEXAGRAM ORACLE (Date-Based) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-cinzel tracking-wider text-indigo-300 font-semibold uppercase">
                App 1: Syncretic Star &amp; Hexagram
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Precision Calculations</span>
          </div>

          <CelestialCalculator
            initialName1={slot1.name}
            initialName2={slot2.name}
            onSaveToVault={onSaveToVault}
          />
        </div>

        {/* ======================================================== */}
        {/* APP 2 (RIGHT): THE SOMATIC MIRROR & DIVINATORY COMPANION (Visual) */}
        {/* ======================================================== */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-cinzel tracking-wider text-amber-300 font-semibold uppercase">
                App 2: The Somatic Mirror &amp; Divination
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Form &amp; Direct Intuition</span>
          </div>

          {/* Section: Mian Xiang (Face Reading) */}
          <div className="rounded-3xl bg-quartz-glass border border-amber-500/20 p-6 space-y-6">
            <div className="text-center">
              <span className="text-[10px] font-cinzel tracking-[0.25em] text-amber-400 uppercase">
                Section 1 · Physiognomy
              </span>
              <h3 className="text-xl font-cinzel font-semibold text-slate-100">
                MIAN XIANG (FACE READING)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Computer-vision wireframe analysis of the Three Zones and Somatic Balance.
              </p>
            </div>

            {/* Two Portrait Slots Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FaceUploader
                slot={slot1}
                onUpdateSlot={onUpdateSlot1}
                onAnalyzeSingle={() => onAnalyzeSingle('1')}
                otherSlotName={slot2.name}
              />
              <FaceUploader
                slot={slot2}
                onUpdateSlot={onUpdateSlot2}
                onAnalyzeSingle={() => onAnalyzeSingle('2')}
                otherSlotName={slot1.name}
              />
            </div>

            {/* ANALYZE FACE MATCH BUTTON with Arrow Indicator */}
            <div className="flex flex-col items-center justify-center pt-2">
              <button
                onClick={onAnalyzeFaceMatch}
                disabled={!slot1.image || !slot2.image || matchLoading}
                className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-cinzel font-bold text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
              >
                {matchLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Mapping Somatic Interlock...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-slate-950" />
                    <span>ANALYZE FACE MATCH</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                {!slot1.image || !slot2.image
                  ? 'Upload or choose archetype for both portraits to unlock match analysis'
                  : 'Ready to compute energetic vectors & harmonic concordance'}
              </p>
            </div>

            {/* Sample/Active Result Screen: Diagram of energetic flow */}
            {matchResult && (
              <div className="pt-4 border-t border-amber-500/20">
                <ComparativeFaceMatch
                  matchResult={matchResult}
                  portrait1={slot1}
                  portrait2={slot2}
                  onSaveToVault={() =>
                    onSaveToVault({
                      type: 'face_match',
                      title: `Mian Xiang Match: ${slot1.name} & ${slot2.name}`,
                      summary: `${matchResult.resonanceClassification} · ${matchResult.overallSynergyScore}% Synergy`,
                      details: matchResult,
                    })
                  }
                  onCrossReferenceSynastry={() => {}}
                />
              </div>
            )}
          </div>

          {/* Section: Instant Divination */}
          <InstantDivinationHub onSaveToVault={onSaveToVault} />
        </div>
      </div>
    </div>
  );
};
