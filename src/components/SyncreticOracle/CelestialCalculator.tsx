import React, { useState } from 'react';
import { CelestialAlignmentResult } from '../../types';
import { StarHexagramView } from './StarHexagramView';
import { Compass, Sparkles, RefreshCw, Bookmark, Calendar, User, CheckCircle } from 'lucide-react';

interface CelestialCalculatorProps {
  initialName1?: string;
  initialName2?: string;
  onSaveToVault?: (reading: any) => void;
  onSwitchToSomatic?: () => void;
}

export const CelestialCalculator: React.FC<CelestialCalculatorProps> = ({
  initialName1 = 'Subject 1',
  initialName2 = 'Subject 2',
  onSaveToVault,
  onSwitchToSomatic,
}) => {
  const [name1, setName1] = useState(initialName1);
  const [name2, setName2] = useState(initialName2);
  const [birthdate1, setBirthdate1] = useState('1994-06-21');
  const [birthdate2, setBirthdate2] = useState('1996-10-24');
  const [loading, setLoading] = useState(false);
  const [alignment, setAlignment] = useState<CelestialAlignmentResult | null>(null);
  const [saved, setSaved] = useState(false);

  // Instant calculation
  const calculateCelestialAlignment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/astrology/synastry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthdate1,
          birthdate2,
          name1,
          name2,
        }),
      });
      const data = await res.json();
      if (data.alignment) {
        setAlignment(data.alignment);
      }
    } catch (e) {
      console.error('Celestial calculation error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (alignment && onSaveToVault) {
      onSaveToVault({
        type: 'celestial',
        title: `Celestial Synastry: ${name1} & ${name2}`,
        summary: `${alignment.starHexagram.name} · ${alignment.synchronicityIndex}% Alignment`,
        details: { name1, name2, birthdate1, birthdate2, alignment },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#060814] via-[#090d1f] to-[#04060f] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background Starry Dust Glows */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* App 1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-cinzel tracking-[0.25em] text-indigo-400 uppercase font-semibold">
              App 1 · Ephemeris &amp; Astrological Orbit
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-serif">Date-Based Precision Calculation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-semibold text-slate-100 flex items-center gap-2">
            <span>Syncretic Star &amp; Hexagram Oracle</span>
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Calculates planetary degrees, cross-aspect synastry, and maps the dual birth-energies directly into one of the 64 sacred Star-Hexagrams.
          </p>
        </div>

        {alignment && onSaveToVault && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs font-cinzel text-indigo-300 hover:bg-indigo-900/60 transition-all self-start sm:self-auto"
          >
            {saved ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved to Vault' : 'Save Alignment'}</span>
          </button>
        )}
      </div>

      {/* Inputs: BIRTHDATE 1 & BIRTHDATE 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
        {/* Subject 1 */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-cinzel text-indigo-300">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Subject 1 Name</span>
          </label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
          />

          <label className="flex items-center gap-1.5 text-xs font-cinzel text-amber-300 mt-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>BIRTHDATE 1</span>
          </label>
          <input
            type="date"
            value={birthdate1}
            onChange={(e) => setBirthdate1(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-400 font-mono"
          />
        </div>

        {/* Subject 2 */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-cinzel text-indigo-300">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Subject 2 Name</span>
          </label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
          />

          <label className="flex items-center gap-1.5 text-xs font-cinzel text-amber-300 mt-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>BIRTHDATE 2</span>
          </label>
          <input
            type="date"
            value={birthdate2}
            onChange={(e) => setBirthdate2(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-400 font-mono"
          />
        </div>
      </div>

      {/* Prominent Action Button: CALCULATE CELESTIAL ALIGNMENT */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-6">
        <button
          onClick={calculateCelestialAlignment}
          disabled={loading}
          className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-cinzel font-bold text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <Compass className="w-4 h-4 text-slate-950" />
          )}
          <span>CALCULATE CELESTIAL ALIGNMENT</span>
        </button>

        {onSwitchToSomatic && (
          <button
            onClick={onSwitchToSomatic}
            className="text-xs font-cinzel text-amber-400/80 hover:text-amber-300 underline underline-offset-4"
          >
            Switch to Visual Somatic Mirror →
          </button>
        )}
      </div>

      {/* Results View */}
      {alignment ? (
        <StarHexagramView alignment={alignment} name1={name1} name2={name2} />
      ) : (
        <div className="p-8 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400/60">
            ✡
          </div>
          <p className="text-xs font-cinzel text-slate-400">
            Awaiting birthdate inputs to calculate celestial degrees and Star-Hexagram matrix.
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            SYNCHRONICITY via PRECISION CALCULATION
          </p>
        </div>
      )}

      {/* Footer Banner */}
      <div className="mt-8 pt-4 border-t border-slate-800 text-center">
        <span className="text-[10px] font-cinzel tracking-[0.3em] text-indigo-400/70 uppercase">
          SYNCHRONICITY via PRECISION CALCULATION · OSIRIS STAR ENGINE
        </span>
      </div>
    </div>
  );
};
