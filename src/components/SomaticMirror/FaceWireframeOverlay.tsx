import React, { useState } from 'react';
import { FaceAnalysisResult } from '../../types';

interface FaceWireframeOverlayProps {
  imageSrc: string | null;
  analysis: FaceAnalysisResult | null;
  activeZone: 'all' | 'shang' | 'zhong' | 'xia';
  onSelectZone?: (zone: 'all' | 'shang' | 'zhong' | 'xia') => void;
  showWireframe: boolean;
  label?: string;
}

export const FaceWireframeOverlay: React.FC<FaceWireframeOverlayProps> = ({
  imageSrc,
  analysis,
  activeZone,
  onSelectZone,
  showWireframe,
  label,
}) => {
  const [hoveredOfficer, setHoveredOfficer] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/20 group shadow-2xl">
      {/* Background Image or Archetype */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={label || 'Face Analysis'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 to-slate-950">
          <div className="w-16 h-16 rounded-full border border-dashed border-amber-500/30 flex items-center justify-center text-amber-400/40 mb-3">
            𓁹
          </div>
          <p className="text-xs text-slate-400 font-cinzel">Awaiting Portrait Capture</p>
        </div>
      )}

      {/* Esoteric Computer-Vision Wireframe Overlay */}
      {showWireframe && imageSrc && (
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full pointer-events-auto select-none"
        >
          <defs>
            {/* Shimmer gradient */}
            <linearGradient id="cyberGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="cyanVector" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="purpleVector" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Outer Alchemical Oval Grid */}
          <ellipse
            cx="200"
            cy="195"
            rx="115"
            ry="145"
            fill="none"
            stroke="url(#cyberGold)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            className="animate-[spin_40s_linear_infinite] origin-center opacity-70"
          />

          {/* Central Vertical Symmetry Axis (Yin-Yang Meridian) */}
          <line
            x1="200"
            y1="50"
            x2="200"
            y2="340"
            stroke="#fbbf24"
            strokeWidth="0.8"
            strokeDasharray="3 3"
            strokeOpacity="0.6"
          />

          {/* ======================================================== */}
          {/* ZONE 1: SHANG TING (Upper Zone / Forehead: 50px - 150px) */}
          {/* ======================================================== */}
          <g
            className="cursor-pointer transition-opacity"
            onClick={() => onSelectZone && onSelectZone(activeZone === 'shang' ? 'all' : 'shang')}
            opacity={activeZone === 'all' || activeZone === 'shang' ? 1 : 0.25}
          >
            {activeZone === 'shang' && (
              <rect x="70" y="50" width="260" height="100" rx="8" fill="#38bdf8" fillOpacity="0.08" />
            )}
            {/* Upper Zone Boundary Line */}
            <line x1="80" y1="150" x2="320" y2="150" stroke="url(#cyanVector)" strokeWidth="2" />
            <polygon points="195,147 200,142 205,147" fill="#38bdf8" />
            <polygon points="195,153 200,158 205,153" fill="#38bdf8" />

            {/* Cranial Arch Nodes */}
            <circle cx="140" cy="100" r="3" fill="#38bdf8" />
            <circle cx="200" cy="85" r="3.5" fill="#38bdf8" />
            <circle cx="260" cy="100" r="3" fill="#38bdf8" />
            <line x1="140" y1="100" x2="200" y2="85" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="200" y1="85" x2="260" y2="100" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />

            {/* Label in SVG */}
            <text x="88" y="70" fill="#38bdf8" fontSize="9" fontFamily="'Cinzel', serif" letterSpacing="1">
              SHANG TING · 15-30
            </text>
          </g>

          {/* ======================================================== */}
          {/* ZONE 2: ZHONG TING (Middle Zone / Brows to Nose Base: 150px - 230px) */}
          {/* ======================================================== */}
          <g
            className="cursor-pointer transition-opacity"
            onClick={() => onSelectZone && onSelectZone(activeZone === 'zhong' ? 'all' : 'zhong')}
            opacity={activeZone === 'all' || activeZone === 'zhong' ? 1 : 0.25}
          >
            {activeZone === 'zhong' && (
              <rect x="70" y="150" width="260" height="80" rx="8" fill="#fbbf24" fillOpacity="0.08" />
            )}
            {/* Mid Zone Boundary Line (Base of Nose) */}
            <line x1="80" y1="230" x2="320" y2="230" stroke="url(#cyberGold)" strokeWidth="2" />
            <polygon points="195,227 200,222 205,227" fill="#fbbf24" />
            <polygon points="195,233 200,238 205,233" fill="#fbbf24" />

            {/* Eye alignment reticles */}
            <g
              onMouseEnter={() => setHoveredOfficer('Eyes')}
              onMouseLeave={() => setHoveredOfficer(null)}
              className="cursor-pointer"
            >
              <circle cx="165" cy="180" r="14" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="150" y1="180" x2="180" y2="180" stroke="#38bdf8" strokeWidth="0.75" />
              <circle cx="235" cy="180" r="14" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="220" y1="180" x2="250" y2="180" stroke="#38bdf8" strokeWidth="0.75" />
            </g>

            {/* Nose Bridge Diamond */}
            <g
              onMouseEnter={() => setHoveredOfficer('Nose')}
              onMouseLeave={() => setHoveredOfficer(null)}
              className="cursor-pointer"
            >
              <polygon
                points="200,165 208,215 200,226 192,215"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.2"
              />
              <circle cx="200" cy="226" r="2.5" fill="#fbbf24" />
            </g>

            {/* Zygomatic Arches (Cheekbones) */}
            <path d="M 125 195 Q 155 195 185 210" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.6" />
            <path d="M 275 195 Q 245 195 215 210" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.6" />

            <text x="88" y="165" fill="#fbbf24" fontSize="9" fontFamily="'Cinzel', serif" letterSpacing="1">
              ZHONG TING · 31-50
            </text>
          </g>

          {/* ======================================================== */}
          {/* ZONE 3: XIA TING (Lower Zone / Philtrum to Chin: 230px - 340px) */}
          {/* ======================================================== */}
          <g
            className="cursor-pointer transition-opacity"
            onClick={() => onSelectZone && onSelectZone(activeZone === 'xia' ? 'all' : 'xia')}
            opacity={activeZone === 'all' || activeZone === 'xia' ? 1 : 0.25}
          >
            {activeZone === 'xia' && (
              <rect x="70" y="230" width="260" height="110" rx="8" fill="#c084fc" fillOpacity="0.08" />
            )}
            
            {/* Philtrum Channel */}
            <line x1="200" y1="230" x2="200" y2="248" stroke="#e2e8f0" strokeWidth="1.5" />

            {/* Mouth / Oral Officer */}
            <g
              onMouseEnter={() => setHoveredOfficer('Mouth')}
              onMouseLeave={() => setHoveredOfficer(null)}
              className="cursor-pointer"
            >
              <ellipse cx="200" cy="258" rx="24" ry="7" fill="none" stroke="#f472b6" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="176" y1="258" x2="224" y2="258" stroke="#f472b6" strokeWidth="0.75" />
            </g>

            {/* Chin / Mandible Apex */}
            <path d="M 170 295 Q 200 325 230 295" fill="none" stroke="url(#purpleVector)" strokeWidth="1.5" />
            <circle cx="200" cy="320" r="3" fill="#c084fc" />

            <text x="88" y="245" fill="#c084fc" fontSize="9" fontFamily="'Cinzel', serif" letterSpacing="1">
              XIA TING · 51+
            </text>
          </g>

          {/* Auricular Nodes (Ears) */}
          <circle
            cx="100"
            cy="195"
            r="8"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2 2"
            onMouseEnter={() => setHoveredOfficer('Ears')}
            onMouseLeave={() => setHoveredOfficer(null)}
            className="cursor-pointer"
          />
          <circle
            cx="300"
            cy="195"
            r="8"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2 2"
            onMouseEnter={() => setHoveredOfficer('Ears')}
            onMouseLeave={() => setHoveredOfficer(null)}
            className="cursor-pointer"
          />
        </svg>
      )}

      {/* Hovered Officer Tooltip */}
      {hoveredOfficer && (
        <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between pointer-events-none animate-fadeIn">
          <span className="font-semibold text-amber-300">Wu Guan (Officer): {hoveredOfficer}</span>
          <span className="text-[10px] text-slate-300">
            {hoveredOfficer === 'Eyes' && 'Officer of Monitoring (Shen Spirit)'}
            {hoveredOfficer === 'Nose' && 'Officer of Discrimination (Wealth & Ego)'}
            {hoveredOfficer === 'Mouth' && 'Officer of Outflow (Water / Eloquence)'}
            {hoveredOfficer === 'Ears' && 'Officer of Listening (Ancestral Jing Vitality)'}
          </span>
        </div>
      )}

      {/* Label Kicker */}
      {label && (
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-cinzel text-amber-300/90 tracking-wider">
          {label}
        </div>
      )}
    </div>
  );
};
