import React, { useState } from 'react';
import { ComparativeMatchResult, FaceAnalysisResult } from '../../types';
import { Sparkles, ArrowRight, Zap, Flame, Shield, Bookmark, Share2, Compass, CheckCircle } from 'lucide-react';

interface ComparativeFaceMatchProps {
  matchResult: ComparativeMatchResult;
  portrait1: { name: string; image: string | null; analysis?: FaceAnalysisResult | null };
  portrait2: { name: string; image: string | null; analysis?: FaceAnalysisResult | null };
  onSaveToVault: () => void;
  onCrossReferenceSynastry: () => void;
}

export const ComparativeFaceMatch: React.FC<ComparativeFaceMatchProps> = ({
  matchResult,
  portrait1,
  portrait2,
  onSaveToVault,
  onCrossReferenceSynastry,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'zones' | 'elemental' | 'synthesis'>('flow');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveToVault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-[#0d101c] to-[#080911] border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background sacred ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with Score and Classification */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-cinzel tracking-[0.2em] text-amber-400 uppercase">
              Somatic Physiognomy Synastry
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-serif">Mian Xiang Biometric Interlock</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-semibold text-slate-100 flex items-center gap-3">
            <span>{portrait1.name}</span>
            <span className="text-amber-400 font-cormorant italic text-lg sm:text-xl font-normal">☍</span>
            <span>{portrait2.name}</span>
          </h2>
          <p className="text-sm font-cormorant italic text-amber-200/90 mt-1">
            Resonance Class: <span className="font-sans-clean font-medium not-italic text-amber-300">{matchResult.resonanceClassification}</span>
          </p>
        </div>

        {/* Harmonic Synergy Score Dial */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-3.5 rounded-2xl border border-amber-500/30 shadow-inner">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${matchResult.overallSynergyScore}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-cinzel font-bold text-amber-300 leading-none">
                {matchResult.overallSynergyScore}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-cinzel text-amber-400/90 uppercase tracking-wider">
              Harmonic Synergy
            </div>
            <div className="text-xs text-slate-300 font-medium">
              Alchemical Concord
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 my-6 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 max-w-md">
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'flow'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Energetic Flow
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'zones'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Three Zones
        </button>
        <button
          onClick={() => setActiveTab('elemental')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'elemental'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Elemental Polarity
        </button>
        <button
          onClick={() => setActiveTab('synthesis')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'synthesis'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Synthesis
        </button>
      </div>

      {/* Tab 1: COMPLEMENTARY ENERGETIC FLOW DIAGRAM */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-cinzel tracking-[0.25em] text-amber-400 uppercase">
              Somatic Resonance Map
            </span>
            <h3 className="text-lg font-cinzel font-medium text-slate-100">
              COMPLEMENTARY ENERGETIC FLOW
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
              Live morphopsychological vectors transmitting between cranial (Heaven), zygomatic (Man), and mandibular (Earth) centers.
            </p>
          </div>

          {/* Interactive SVG Diagram connecting the two face silhouettes */}
          <div className="relative w-full aspect-[16/9] max-h-[380px] rounded-2xl bg-[#070910] border border-amber-500/20 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 800 450" className="w-full h-full">
              <defs>
                <linearGradient id="flowGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="vectorAnim" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Sacred Circles */}
              <circle cx="400" cy="225" r="180" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="400" cy="225" r="100" fill="none" stroke="#d4af37" strokeWidth="0.75" strokeOpacity="0.3" />
              <line x1="400" y1="25" x2="400" y2="425" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />

              {/* Left Face Silhouette & Anchors (Portrait 1) */}
              <g transform="translate(40, 25)">
                <ellipse cx="160" cy="200" rx="90" ry="120" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                {/* Zone lines */}
                <line x1="90" y1="160" x2="230" y2="160" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.7" />
                <line x1="95" y1="230" x2="225" y2="230" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.7" />

                {/* Nodes */}
                <circle cx="160" cy="120" r="6" fill="#38bdf8" filter="url(#glow)" />
                <text x="160" y="105" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="'Cinzel', serif">
                  HEAVEN (15-30)
                </text>

                <circle cx="160" cy="195" r="6" fill="#fbbf24" filter="url(#glow)" />
                <text x="160" y="180" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="'Cinzel', serif">
                  MAN (31-50)
                </text>

                <circle cx="160" cy="275" r="6" fill="#c084fc" filter="url(#glow)" />
                <text x="160" y="305" textAnchor="middle" fill="#c084fc" fontSize="10" fontFamily="'Cinzel', serif">
                  EARTH (51+)
                </text>

                <text x="160" y="340" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontFamily="'Cinzel', serif" fontWeight="bold">
                  {portrait1.name.toUpperCase()}
                </text>
              </g>

              {/* Right Face Silhouette & Anchors (Portrait 2) */}
              <g transform="translate(440, 25)">
                <ellipse cx="160" cy="200" rx="90" ry="120" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                {/* Zone lines */}
                <line x1="90" y1="160" x2="230" y2="160" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.7" />
                <line x1="95" y1="230" x2="225" y2="230" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.7" />

                {/* Nodes */}
                <circle cx="160" cy="120" r="6" fill="#38bdf8" filter="url(#glow)" />
                <text x="160" y="105" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="'Cinzel', serif">
                  HEAVEN (15-30)
                </text>

                <circle cx="160" cy="195" r="6" fill="#fbbf24" filter="url(#glow)" />
                <text x="160" y="180" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="'Cinzel', serif">
                  MAN (31-50)
                </text>

                <circle cx="160" cy="275" r="6" fill="#c084fc" filter="url(#glow)" />
                <text x="160" y="305" textAnchor="middle" fill="#c084fc" fontSize="10" fontFamily="'Cinzel', serif">
                  EARTH (51+)
                </text>

                <text x="160" y="340" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontFamily="'Cinzel', serif" fontWeight="bold">
                  {portrait2.name.toUpperCase()}
                </text>
              </g>

              {/* ======================================================== */}
              {/* Dynamic Connecting Glowing Flow Curves */}
              {/* ======================================================== */}
              
              {/* Flow 1: P1 Heaven -> P2 Man (Inspiration to Action) */}
              <path
                d="M 200 145 C 320 145, 480 220, 600 220"
                fill="none"
                stroke="url(#flowGold)"
                strokeWidth="2.5"
                filter="url(#glow)"
                strokeDasharray="6 4"
                className="animate-[dash_20s_linear_infinite]"
              />
              <circle cx="400" cy="182" r="4" fill="#fbbf24" filter="url(#glow)" />

              {/* Flow 2: P1 Earth -> P2 Earth (Mutual Sanctuary / Somatic Trust) */}
              <path
                d="M 200 300 C 350 360, 450 360, 600 300"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2"
                filter="url(#glow)"
              />
              <circle cx="400" cy="345" r="4" fill="#c084fc" />

              {/* Flow 3: P2 Heaven -> P1 Man (Vision to Manifestation) */}
              <path
                d="M 600 145 C 480 145, 320 220, 200 220"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                filter="url(#glow)"
                strokeDasharray="4 4"
              />

              {/* Center Portal Text */}
              <rect x="330" y="210" width="140" height="30" rx="8" fill="#020617" stroke="#d4af37" strokeWidth="1" />
              <text x="400" y="230" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="'Cinzel', serif" letterSpacing="1">
                YIN-YANG CIRCUIT
              </text>
            </svg>
          </div>

          {/* Vectors List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {matchResult.energeticFlowVectors.map((v, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-cinzel text-[11px]">
                  <span>Vector {i + 1}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {v.intensity} Intensity
                  </span>
                </div>
                <div className="text-slate-200 font-medium">
                  {v.from} <ArrowRight className="inline w-3 h-3 text-amber-400 mx-1" /> {v.to}
                </div>
                <p className="text-[11px] text-slate-400">{v.nature}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: THREE ZONES INTERLOCK */}
      {activeTab === 'zones' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="text-sm font-cinzel text-sky-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Shang Ting (Upper Zone / Intellect &amp; Divine Vision) Interlock
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {matchResult.zoneInterlock.shangTingHarmony}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="text-sm font-cinzel text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Zhong Ting (Middle Zone / Ego, Willpower &amp; Collaboration) Interlock
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {matchResult.zoneInterlock.zhongTingHarmony}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="text-sm font-cinzel text-purple-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Xia Ting (Lower Zone / Somatic Stamina, Trust &amp; Legacy) Interlock
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {matchResult.zoneInterlock.xiaTingHarmony}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: ELEMENTAL POLARITY */}
      {activeTab === 'elemental' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-cinzel text-slate-400 uppercase">Portrait 1 Resonance</span>
              <p className="text-base font-cinzel font-semibold text-amber-300">
                {matchResult.elementalPolarity.p1Element}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-cinzel text-slate-400 uppercase">Portrait 2 Resonance</span>
              <p className="text-base font-cinzel font-semibold text-sky-300">
                {matchResult.elementalPolarity.p2Element}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-cinzel text-amber-400 uppercase tracking-wider">
              Wu Xing Cycle: {matchResult.elementalPolarity.cycle}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {matchResult.elementalPolarity.dynamic}
            </p>
          </div>

          {/* Somatic Strengths & Shadow Dynamics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <h5 className="text-xs font-cinzel text-emerald-300 flex items-center gap-1.5 font-semibold">
                <Shield className="w-3.5 h-3.5" /> Somatic Synergy Strengths
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {matchResult.somaticStrengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <h5 className="text-xs font-cinzel text-amber-300 flex items-center gap-1.5 font-semibold">
                <Flame className="w-3.5 h-3.5" /> Shadow Tensions &amp; Growth Edge
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {matchResult.shadowDynamics.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: MYSTICAL SYNTHESIS */}
      {activeTab === 'synthesis' && (
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-cinzel text-xs tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>The Oracle’s Physiognomic Decree</span>
          </div>
          <p className="text-sm font-cormorant italic text-slate-200 text-lg sm:text-xl leading-relaxed">
            "{matchResult.mysticalSynthesis}"
          </p>
        </div>
      )}

      {/* Action Footer: Save to Vault & Cross-reference with Celestial Synastry */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-cinzel text-amber-300 transition-all shadow-sm"
          >
            {saved ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved to Ecosystem Vault!' : 'Save Somatic Dossier'}</span>
          </button>
        </div>

        <button
          onClick={onCrossReferenceSynastry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600/40 to-purple-600/40 hover:from-indigo-600/60 hover:to-purple-600/60 border border-indigo-400/40 text-xs font-cinzel text-indigo-100 transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)]"
        >
          <Compass className="w-4 h-4 text-indigo-300" />
          <span>Cross-Reference with Syncretic Star-Hexagram</span>
        </button>
      </div>
    </div>
  );
};
