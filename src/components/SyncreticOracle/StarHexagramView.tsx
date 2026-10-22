import React from 'react';
import { CelestialAlignmentResult } from '../../types';
import { Compass, Sparkles, Orbit, Sun, Moon, Zap, Star } from 'lucide-react';

interface StarHexagramViewProps {
  alignment: CelestialAlignmentResult;
  name1: string;
  name2: string;
}

export const StarHexagramView: React.FC<StarHexagramViewProps> = ({
  alignment,
  name1,
  name2,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Central Star-Hexagram Map Display */}
      <div className="relative w-full aspect-[16/10] max-h-[420px] rounded-3xl bg-[#030612] border-2 border-indigo-500/30 p-6 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)]">
        
        {/* Deep Galaxy Starfield background */}
        <div className="absolute inset-0 bg-radial from-indigo-900/20 via-[#05091a] to-[#02040a] pointer-events-none" />
        
        {/* Interactive SVG Celestial Wheel & Golden Hexagram */}
        <svg viewBox="0 0 600 600" className="w-full h-full max-w-[520px]">
          <defs>
            <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#4f46e5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <filter id="hexGlow">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Core nebula circle */}
          <circle cx="300" cy="300" r="160" fill="url(#starCore)" />

          {/* Outer Zodiac / Decan Ring */}
          <circle cx="300" cy="300" r="260" fill="none" stroke="#4338ca" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="300" cy="300" r="235" fill="none" stroke="#6366f1" strokeWidth="0.75" strokeOpacity="0.4" />
          <circle cx="300" cy="300" r="185" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.7" />

          {/* Zodiac Degree Hash Marks (12 sectors) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 300 + 235 * Math.cos(rad);
            const y1 = 300 + 235 * Math.sin(rad);
            const x2 = 300 + 260 * Math.cos(rad);
            const y2 = 300 + 260 * Math.sin(rad);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.6" />;
          })}

          {/* ======================================================== */}
          {/* THE GOLDEN HEXAGRAM (Two Interlocking Equilateral Triangles) */}
          {/* ======================================================== */}
          
          {/* Triangle 1: Pointing Up (Fire / Spirit) */}
          <polygon
            points="300,165 420,370 180,370"
            fill="none"
            stroke="url(#goldEdge)"
            strokeWidth="3"
            filter="url(#hexGlow)"
          />

          {/* Triangle 2: Pointing Down (Water / Matter) */}
          <polygon
            points="300,435 420,230 180,230"
            fill="none"
            stroke="url(#goldEdge)"
            strokeWidth="3"
            filter="url(#hexGlow)"
          />

          {/* Central Sun/Hexagram Nexus */}
          <circle cx="300" cy="300" r="32" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
          <text x="300" y="306" textAnchor="middle" fill="#fbbf24" fontSize="20" fontFamily="'Cinzel', serif" fontWeight="bold">
            {alignment.starHexagram.symbol || '䷊'}
          </text>

          {/* Planet Nodes along the Vertices */}
          {/* Top Vertex: Sun ☉ */}
          <circle cx="300" cy="165" r="14" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="300" y="170" textAnchor="middle" fill="#fbbf24" fontSize="12">☉</text>

          {/* Bottom Vertex: Moon ☽ */}
          <circle cx="300" cy="435" r="14" fill="#1e1b4b" stroke="#e0e7ff" strokeWidth="1.5" />
          <text x="300" y="440" textAnchor="middle" fill="#e0e7ff" fontSize="12">☽</text>

          {/* Top-Right Vertex: Venus ♀ */}
          <circle cx="420" cy="230" r="14" fill="#1e1b4b" stroke="#f472b6" strokeWidth="1.5" />
          <text x="420" y="235" textAnchor="middle" fill="#f472b6" fontSize="12">♀</text>

          {/* Bottom-Right Vertex: Mars ♂ */}
          <circle cx="420" cy="370" r="14" fill="#1e1b4b" stroke="#ef4444" strokeWidth="1.5" />
          <text x="420" y="375" textAnchor="middle" fill="#ef4444" fontSize="12">♂</text>

          {/* Top-Left Vertex: Jupiter ♃ */}
          <circle cx="180" cy="230" r="14" fill="#1e1b4b" stroke="#60a5fa" strokeWidth="1.5" />
          <text x="180" y="235" textAnchor="middle" fill="#60a5fa" fontSize="12">♃</text>

          {/* Bottom-Left Vertex: Saturn ♄ */}
          <circle cx="180" cy="370" r="14" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="180" y="375" textAnchor="middle" fill="#a78bfa" fontSize="12">♄</text>

          {/* Outer Header Text inside SVG */}
          <text x="300" y="70" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="'Cinzel', serif" letterSpacing="3">
            SYNCHRONICITY via PRECISION CALCULATION
          </text>
        </svg>

        {/* Floating badge for Degree and Hexagram */}
        <div className="absolute bottom-4 left-6 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs">
          <span className="font-cinzel text-amber-300 font-semibold block">
            {alignment.starHexagram.name}
          </span>
          <span className="text-[10px] text-indigo-300 font-mono">
            {alignment.starHexagram.celestialDegree}
          </span>
        </div>

        {/* Synchronicity Index Badge */}
        <div className="absolute bottom-4 right-6 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-xs flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-mono font-bold text-amber-300">{alignment.synchronicityIndex}%</span>
          <span className="text-[10px] text-slate-400 font-cinzel">Alignment Index</span>
        </div>
      </div>

      {/* PAST. PRESENT. FUTURE. SYNTHESIS. TRIAD */}
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="text-xs font-cinzel tracking-[0.25em] text-indigo-300 uppercase font-semibold">
            PAST · PRESENT · FUTURE · SYNTHESIS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-1.5">
            <span className="text-[10px] font-cinzel text-indigo-400 uppercase tracking-widest font-semibold">
              01. The Karmic Root (Past)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {alignment.celestialTriad.past}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
            <span className="text-[10px] font-cinzel text-amber-400 uppercase tracking-widest font-semibold">
              02. The Present Crucible
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {alignment.celestialTriad.present}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-1.5">
            <span className="text-[10px] font-cinzel text-purple-400 uppercase tracking-widest font-semibold">
              03. The Celestial Threshold (Future)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              {alignment.celestialTriad.future}
            </p>
          </div>
        </div>
      </div>

      {/* Planetary Aspects Breakdown */}
      <div className="space-y-3">
        <div className="text-xs font-cinzel text-indigo-300 uppercase tracking-wider">
          Planetary Synastry Interlock
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {alignment.planetaryAspects.map((asp, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-cinzel">
                <span>{asp.aspect}</span>
                <span className="text-indigo-400 font-mono text-[10px]">{asp.harmony}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans-clean leading-relaxed">{asp.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Osiris Synthesis */}
      <div className="p-5 rounded-2xl bg-[#080b18] border border-indigo-500/30 text-center space-y-2">
        <p className="text-sm sm:text-base font-cormorant italic text-slate-200 leading-relaxed max-w-2xl mx-auto">
          "{alignment.osirisSynthesis}"
        </p>
        <span className="text-[10px] font-cinzel tracking-[0.2em] text-indigo-400 uppercase block">
          Calculated by Osiris Celestial Engine
        </span>
      </div>
    </div>
  );
};
