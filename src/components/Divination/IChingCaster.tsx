import React, { useState } from 'react';
import { IChingLine, IChingReadingResult } from '../../types';
import { Sparkles, RefreshCw, Bookmark, CheckCircle, Coins } from 'lucide-react';

interface IChingCasterProps {
  onSaveToVault?: (reading: any) => void;
}

export const IChingCaster: React.FC<IChingCasterProps> = ({ onSaveToVault }) => {
  const [question, setQuestion] = useState('What is the movement of Heaven and Earth in this matter?');
  const [lines, setLines] = useState<IChingLine[]>([]);
  const [currentCoins, setCurrentCoins] = useState<number[]>([2, 3, 2]);
  const [isTossing, setIsTossing] = useState(false);
  const [readingResult, setReadingResult] = useState<IChingReadingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Single coin toss step (generates 1 line from bottom to top)
  const tossCoins = () => {
    if (lines.length >= 6) return;
    setIsTossing(true);

    setTimeout(() => {
      // Each coin has 50% chance of 2 (Yin) or 3 (Yang)
      const c1 = Math.random() < 0.5 ? 2 : 3;
      const c2 = Math.random() < 0.5 ? 2 : 3;
      const c3 = Math.random() < 0.5 ? 2 : 3;
      const sum = c1 + c2 + c3; // 6, 7, 8, or 9
      setCurrentCoins([c1, c2, c3]);

      const newLine: IChingLine = {
        position: lines.length + 1,
        isYang: sum === 7 || sum === 9,
        isChanging: sum === 6 || sum === 9,
        coins: [c1, c2, c3],
      };

      const updatedLines = [...lines, newLine];
      setLines(updatedLines);
      setIsTossing(false);

      // If all 6 lines complete, query oracle
      if (updatedLines.length === 6) {
        completeHexagram(updatedLines);
      }
    }, 600);
  };

  const castAllLines = () => {
    setIsTossing(true);
    setTimeout(() => {
      const generated: IChingLine[] = [];
      for (let i = 1; i <= 6; i++) {
        const c1 = Math.random() < 0.5 ? 2 : 3;
        const c2 = Math.random() < 0.5 ? 2 : 3;
        const c3 = Math.random() < 0.5 ? 2 : 3;
        const sum = c1 + c2 + c3;
        generated.push({
          position: i,
          isYang: sum === 7 || sum === 9,
          isChanging: sum === 6 || sum === 9,
          coins: [c1, c2, c3],
        });
      }
      setLines(generated);
      setIsTossing(false);
      completeHexagram(generated);
    }, 800);
  };

  const completeHexagram = async (completedLines: IChingLine[]) => {
    setLoading(true);
    // Simple heuristic hexagram lookup: 1 to 64
    const binaryValue = completedLines.reduce((acc, l, idx) => acc + (l.isYang ? Math.pow(2, idx) : 0), 0);
    const hexagramNumber = (binaryValue % 64) + 1;

    try {
      const res = await fetch('/api/divination/iching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, hexagramNumber, lines: completedLines }),
      });
      const data = await res.json();
      if (data.reading) {
        setReadingResult(data.reading);
      }
    } catch (e) {
      console.error('Error with I Ching:', e);
    } finally {
      setLoading(false);
    }
  };

  const resetCast = () => {
    setLines([]);
    setReadingResult(null);
  };

  const handleSave = () => {
    if (readingResult && onSaveToVault) {
      onSaveToVault({
        type: 'iching',
        title: `I Ching: ${readingResult.hexagramName}`,
        summary: readingResult.theJudgement,
        details: { question, lines, readingResult },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-cinzel text-amber-300">
            Zhouyi (I Ching / Book of Changes) · Three Coins Cast
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={lines.length === 6 ? resetCast : tossCoins}
              disabled={isTossing || loading}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-cinzel font-semibold transition-all shadow-md disabled:opacity-50"
            >
              <Coins className={`w-3.5 h-3.5 ${isTossing ? 'animate-bounce' : ''}`} />
              <span>
                {lines.length === 6
                  ? 'Reset & Cast Anew'
                  : `Toss Line ${lines.length + 1} of 6`}
              </span>
            </button>

            {lines.length < 6 && (
              <button
                onClick={castAllLines}
                disabled={isTossing || loading}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-amber-500/30 font-cinzel transition-all"
              >
                Cast All 6
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-cinzel text-amber-400/90 mb-1">
            Question of Momentum &amp; Tao
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      {/* Hexagram Construction Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Animated Coins Visual */}
        <div className="p-6 rounded-2xl bg-[#090b14] border border-amber-500/20 flex flex-col items-center justify-center min-h-[220px]">
          <div className="text-[10px] font-cinzel text-slate-400 uppercase tracking-widest mb-4">
            Bronze Divination Coins
          </div>
          <div className="flex items-center gap-4">
            {currentCoins.map((val, idx) => (
              <div
                key={idx}
                className={`w-14 h-14 rounded-full border-2 border-amber-400/70 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg transition-transform duration-500 ${
                  isTossing ? 'animate-spin scale-90' : 'hover:scale-105'
                }`}
              >
                <div className="w-5 h-5 rounded-sm bg-slate-950 border border-amber-300/60 flex items-center justify-center text-[10px] font-bold text-amber-200 font-mono">
                  {val === 3 ? '陽' : '陰'}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-amber-300/80 font-mono mt-4">
            Sum: {currentCoins.reduce((a, b) => a + b, 0)} ·{' '}
            {currentCoins.reduce((a, b) => a + b, 0) % 2 === 1 ? 'Yang (Solid)' : 'Yin (Broken)'}
          </p>
        </div>

        {/* Six Lines Rendered from Top (Line 6) to Bottom (Line 1) */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[220px] space-y-2">
          <div className="text-[10px] font-cinzel text-amber-400 uppercase tracking-widest mb-2">
            Hexagram Lines (Bottom to Top)
          </div>

          {[6, 5, 4, 3, 2, 1].map((pos) => {
            const line = lines.find((l) => l.position === pos);
            return (
              <div key={pos} className="w-48 h-5 flex items-center justify-center gap-1">
                <span className="text-[9px] font-mono text-slate-500 w-4">{pos}</span>
                {line ? (
                  line.isYang ? (
                    // Solid Yang Line
                    <div className="flex-1 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)] relative">
                      {line.isChanging && (
                        <span className="absolute -right-5 -top-1 text-[9px] text-rose-400 font-bold">○</span>
                      )}
                    </div>
                  ) : (
                    // Broken Yin Line
                    <div className="flex-1 h-2 flex items-center justify-between gap-2 relative">
                      <div className="w-[45%] h-full rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
                      <div className="w-[45%] h-full rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
                      {line.isChanging && (
                        <span className="absolute -right-5 -top-1 text-[9px] text-rose-400 font-bold">✕</span>
                      )}
                    </div>
                  )
                ) : (
                  <div className="flex-1 h-1 border-b border-dashed border-slate-800" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hexagram Result & Taoist Wisdom */}
      {readingResult && (
        <div className="p-6 rounded-3xl bg-slate-950/90 border border-amber-500/30 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
            <div>
              <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-amber-400">
                Zhouyi Classical Hexagram
              </span>
              <h3 className="text-xl font-cinzel font-medium text-slate-100 mt-0.5">
                {readingResult.hexagramName}
              </h3>
              <p className="text-xs text-amber-300 font-sans-clean mt-0.5">
                {readingResult.trigramBreakdown}
              </p>
            </div>
            {onSaveToVault && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs font-cinzel text-amber-300 hover:bg-slate-800 transition-all"
              >
                {saved ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved' : 'Save Hexagram'}</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-cinzel text-amber-400 uppercase">The Judgement:</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {readingResult.theJudgement}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-cinzel text-sky-400 uppercase">The Image (Symbolic Nature):</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {readingResult.theImage}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <span className="font-cinzel font-semibold text-amber-300 block mb-0.5">
              Wu Wei (Effortless Action) Guidance:
            </span>
            {readingResult.taoistWisdom}
          </div>
        </div>
      )}
    </div>
  );
};
