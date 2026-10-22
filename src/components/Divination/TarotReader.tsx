import React, { useState } from 'react';
import { TarotCard, DrawnCard, TarotReadingResult } from '../../types';
import { TAROT_DECK } from '../../data/archetypes';
import { Sparkles, RefreshCw, Bookmark, CheckCircle, ArrowRight } from 'lucide-react';

interface TarotReaderProps {
  onSaveToVault?: (reading: any) => void;
}

export const TarotReader: React.FC<TarotReaderProps> = ({ onSaveToVault }) => {
  const [spreadType, setSpreadType] = useState<'trinity' | 'mirror' | 'single'>('trinity');
  const [question, setQuestion] = useState('What is the energetic truth between our two souls?');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [readingResult, setReadingResult] = useState<TarotReadingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const getSpreadPositions = () => {
    switch (spreadType) {
      case 'single':
        return ['Oracle Pivot'];
      case 'mirror':
        return ['Soul 1 (Inner Foundation)', 'The Alchemical Mirror', 'Soul 2 (Outer Expression)'];
      case 'trinity':
      default:
        return ['Past Origin (Root)', 'Present Crucible (Momentum)', 'Future Synthesis (Threshold)'];
    }
  };

  const drawSpread = async () => {
    setLoading(true);
    setReadingResult(null);

    // Shuffle and pick cards
    const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
    const positions = getSpreadPositions();
    const selected: DrawnCard[] = positions.map((pos, idx) => ({
      ...shuffled[idx],
      isReversed: Math.random() < 0.25, // 25% chance of reversal
      position: pos,
    }));

    setDrawnCards(selected);

    try {
      const res = await fetch('/api/divination/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          cards: selected,
          spreadType,
        }),
      });
      const data = await res.json();
      if (data.reading) {
        setReadingResult(data.reading);
      }
    } catch (e) {
      console.error('Error drawing tarot:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (readingResult && onSaveToVault) {
      onSaveToVault({
        type: 'tarot',
        title: `Tarot: ${readingResult.theme}`,
        summary: readingResult.oracleSynthesis,
        details: { question, drawnCards, readingResult },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Spread Selector & Query Input */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setSpreadType('trinity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                spreadType === 'trinity' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Past / Present / Future
            </button>
            <button
              onClick={() => setSpreadType('mirror')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                spreadType === 'mirror' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              2-Soul Mirror
            </button>
            <button
              onClick={() => setSpreadType('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                spreadType === 'single' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Single Card
            </button>
          </div>

          <button
            onClick={drawSpread}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-cinzel font-semibold tracking-wider transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{drawnCards.length > 0 ? 'Shuffle & Draw Anew' : 'Cast Sacred Tarot Spread'}</span>
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-cinzel text-amber-400/90 mb-1">
            Inquiry or Interpersonal Focus
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Focus your question into the mirror..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      {/* Drawn Cards Display */}
      {drawnCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {drawnCards.map((card, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col items-center p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border transition-all duration-500 hover:scale-[1.02] shadow-xl ${
                card.isReversed ? 'border-purple-500/40' : 'border-amber-500/40'
              }`}
            >
              {/* Position Header */}
              <span className="text-[10px] font-cinzel text-amber-400/80 uppercase tracking-widest mb-3 text-center">
                {card.position}
              </span>

              {/* Card Face Graphic */}
              <div className="relative w-32 h-52 rounded-xl bg-[#090b14] border-2 border-amber-400/40 p-3 flex flex-col items-center justify-between shadow-inner overflow-hidden group">
                <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

                <div className="text-[10px] font-mono text-amber-300/80 self-start">
                  #{card.number}
                </div>

                <div
                  className={`text-5xl transition-transform duration-500 ${
                    card.isReversed ? 'rotate-180' : ''
                  }`}
                >
                  {card.imageSymbol}
                </div>

                <div className="text-center w-full">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 font-cinzel">
                    {card.element}
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <h4 className="text-sm font-cinzel font-semibold text-slate-100 mt-4 text-center">
                {card.name}
              </h4>
              <p className="text-[10px] text-amber-300/90 font-mono mt-0.5">
                {card.isReversed ? '⟲ Reversed' : '⟰ Upright'}
              </p>
              <p className="text-xs text-slate-300 text-center font-cormorant italic mt-2 line-clamp-3">
                "{card.isReversed ? card.reversedMeaning : card.uprightMeaning}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Oracle Interpretation Result */}
      {readingResult && (
        <div className="p-6 rounded-3xl bg-slate-950/90 border border-amber-500/30 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
            <div>
              <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-amber-400">
                Divinatory Oracle Revelation
              </span>
              <h3 className="text-xl font-cinzel font-medium text-slate-100 mt-0.5">
                {readingResult.theme}
              </h3>
            </div>
            {onSaveToVault && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs font-cinzel text-amber-300 hover:bg-slate-800 transition-all"
              >
                {saved ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved' : 'Save Reading'}</span>
              </button>
            )}
          </div>

          {/* Positional Interpretations */}
          <div className="space-y-3">
            {readingResult.cardInterpretations.map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs font-cinzel text-amber-300">
                  <span>{item.position}</span>
                  <span className="text-slate-400 font-sans-clean font-normal text-[11px]">{item.cardName}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>

          {/* Somatic Embodiment Guidance */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
            <h5 className="text-xs font-cinzel text-amber-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Somatic Embodiment Practice
            </h5>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {readingResult.somaticGuidance}
            </p>
          </div>

          {/* Poetic Synthesis */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-sm font-cormorant italic text-slate-200 leading-relaxed text-center sm:text-base">
              "{readingResult.oracleSynthesis}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
