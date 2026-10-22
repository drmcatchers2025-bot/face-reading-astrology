import React, { useState } from 'react';
import { CastRune, RuneReadingResult } from '../../types';
import { RUNES_DATA } from '../../data/archetypes';
import { Sparkles, RefreshCw, Bookmark, CheckCircle } from 'lucide-react';

interface RuneCasterProps {
  onSaveToVault?: (reading: any) => void;
}

export const RuneCaster: React.FC<RuneCasterProps> = ({ onSaveToVault }) => {
  const [question, setQuestion] = useState('What primal current governs this connection?');
  const [castRunes, setCastRunes] = useState<CastRune[]>([]);
  const [readingResult, setReadingResult] = useState<RuneReadingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const castSacredStones = async () => {
    setLoading(true);
    setReadingResult(null);

    // Pick 3 stones
    const shuffled = [...RUNES_DATA].sort(() => 0.5 - Math.random());
    const quadrants: CastRune['quadrant'][] = ['Origin', 'Threshold', 'Manifestation'];

    const stones: CastRune[] = [0, 1, 2].map((i) => {
      // Coordinates on sacred cloth circle
      const angle = (i * (2 * Math.PI)) / 3 + (Math.random() * 0.4 - 0.2);
      const radius = 60 + Math.random() * 40; // distance from center
      const x = 160 + radius * Math.cos(angle);
      const y = 160 + radius * Math.sin(angle);
      const rotation = Math.floor(Math.random() * 60) - 30;

      return {
        ...shuffled[i],
        orientation: Math.random() < 0.25 ? 'Merkstave (Inverted)' : 'Upright',
        quadrant: quadrants[i],
        x,
        y,
        rotation,
      };
    });

    setCastRunes(stones);

    try {
      const res = await fetch('/api/divination/runes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, runes: stones }),
      });
      const data = await res.json();
      if (data.reading) {
        setReadingResult(data.reading);
      }
    } catch (e) {
      console.error('Error in rune cast:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (readingResult && onSaveToVault) {
      onSaveToVault({
        type: 'runes',
        title: `Runes: ${castRunes.map((r) => r.name).join(' · ')}`,
        summary: readingResult.staveSynthesis,
        details: { question, castRunes, readingResult },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Cast Trigger */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-cinzel text-amber-300">
            Elder Futhark Rune Cast · The 24 Primordial Staves
          </div>

          <button
            onClick={castSacredStones}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-cinzel font-semibold tracking-wider transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{castRunes.length > 0 ? 'Cast Runes Anew' : 'Cast Runes on Cloth'}</span>
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-cinzel text-amber-400/90 mb-1">
            Inquiry or Will Anchor
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What mystery do you seek to unveil?"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      {/* Sacred Circular Cloth SVG Representation */}
      <div className="relative w-full max-w-lg mx-auto aspect-square rounded-full bg-gradient-to-b from-[#101424] to-[#080912] border-2 border-amber-500/30 p-6 flex items-center justify-center shadow-2xl overflow-hidden">
        {/* Sacred Cloth Ring Markings */}
        <div className="absolute inset-4 rounded-full border border-dashed border-amber-400/20 pointer-events-none" />
        <div className="absolute inset-16 rounded-full border border-slate-800 pointer-events-none" />
        <div className="absolute inset-28 rounded-full border border-amber-500/20 pointer-events-none" />

        {/* Quadrant lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-slate-800/80" />
          <div className="h-full w-px bg-slate-800/80 absolute" />
        </div>

        {/* Center Rune Stave Mark */}
        <div className="text-3xl text-amber-500/30 select-none pointer-events-none font-serif">
          ᚛ ᛟ ᚜
        </div>

        {/* Cast Stones positioned on cloth */}
        {castRunes.map((rune, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${rune.x}px`,
              top: `${rune.y}px`,
              transform: `translate(-50%, -50%) rotate(${rune.rotation}deg)`,
            }}
            className="w-16 h-20 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-[#121626] border-2 border-amber-400/50 flex flex-col items-center justify-center shadow-xl cursor-pointer hover:border-amber-300 transition-transform duration-500"
          >
            <span className="text-2xl font-serif text-amber-300 select-none">
              {rune.symbol}
            </span>
            <span className="text-[9px] font-cinzel text-slate-300 mt-1 uppercase">
              {rune.name}
            </span>
          </div>
        ))}
      </div>

      {/* Cast Stones Information Breakdown */}
      {castRunes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {castRunes.map((r, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-400 font-cinzel">
                <span>{r.quadrant}</span>
                <span className="text-lg text-amber-300">{r.symbol}</span>
              </div>
              <h5 className="font-semibold text-slate-100">{r.name} ({r.letter})</h5>
              <p className="text-[11px] text-amber-300/80 font-mono">{r.orientation}</p>
              <p className="text-[11px] text-slate-400 font-sans-clean">{r.meaning}</p>
            </div>
          ))}
        </div>
      )}

      {/* Rune Interpretation */}
      {readingResult && (
        <div className="p-6 rounded-3xl bg-slate-950/90 border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div>
              <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-amber-400">
                Odinic Stave Synthesis
              </span>
              <p className="text-sm font-cormorant italic text-slate-200 text-base mt-1">
                "{readingResult.staveSynthesis}"
              </p>
            </div>
            {onSaveToVault && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs font-cinzel text-amber-300 hover:bg-slate-800 transition-all"
              >
                {saved ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved' : 'Save Cast'}</span>
              </button>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="text-[10px] font-cinzel text-amber-400 uppercase">Elemental Forces:</span>
            <p>{readingResult.elementalForces}</p>
          </div>

          <div className="space-y-2">
            {readingResult.runeInsights.map((ins, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
                <span className="font-cinzel text-amber-300 mr-2">{ins.rune}:</span>
                {ins.counsel}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <span className="font-cinzel font-semibold text-amber-300 block mb-0.5">Sovereign Direct Action:</span>
            {readingResult.runeAction}
          </div>
        </div>
      )}
    </div>
  );
};
