import React, { useState } from 'react';
import { SavedReading } from '../types';
import { X, BookOpen, Trash2, Download, ShieldCheck, Sparkles, Eye, Compass, Layers, Shield, Coins } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReadings: SavedReading[];
  onClearReadings: () => void;
  onSelectReading: (reading: SavedReading) => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  savedReadings,
  onClearReadings,
  onSelectReading,
}) => {
  const [selectedItem, setSelectedItem] = useState<SavedReading | null>(null);

  if (!isOpen) return null;

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedReadings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `osiris-ecosystem-vault-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getTypeIcon = (type: SavedReading['type']) => {
    switch (type) {
      case 'face_match':
      case 'face_single':
        return <Eye className="w-4 h-4 text-amber-400" />;
      case 'celestial':
        return <Compass className="w-4 h-4 text-indigo-400" />;
      case 'tarot':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'runes':
        return <Shield className="w-4 h-4 text-sky-400" />;
      case 'iching':
        return <Coins className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#090b14] border border-amber-500/30 p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-cinzel text-amber-400 tracking-widest uppercase">
                  Osiris Ecosystem
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                  Patron Synced
                </span>
              </div>
              <h2 className="text-xl font-cinzel font-semibold text-slate-100">
                Esoteric Readings Vault &amp; Account
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unified Account Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-cinzel font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Unified Account: dawmmilazzo7@gmail.com</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Lifetime Patron tier enables frictionless cross-app sync between Astro-Ephemeris and Somatic Divination.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {savedReadings.length > 0 && (
              <>
                <button
                  onClick={exportJSON}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-cinzel transition-all"
                >
                  <Download className="w-3 h-3 text-amber-400" />
                  <span>Export</span>
                </button>
                <button
                  onClick={onClearReadings}
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950 text-rose-400 border border-rose-800/40 transition-all"
                  title="Clear Vault History"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Readings List or Detail */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedReadings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border border-dashed border-amber-500/30 flex items-center justify-center mx-auto text-amber-400/50">
                𓁹
              </div>
              <p className="text-xs font-cinzel text-slate-400">
                The vault is currently empty.
              </p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto font-sans-clean">
                Perform Mian Xiang facial matches, Tarot readings, Rune casts, or Celestial calculations to record your discoveries here.
              </p>
            </div>
          ) : selectedItem ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4 animate-fadeIn">
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-amber-400 hover:underline font-cinzel"
              >
                ← Back to Vault List
              </button>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedItem.type)}
                  <h3 className="text-base font-cinzel font-semibold text-slate-100">
                    {selectedItem.title}
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(selectedItem.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
                {selectedItem.summary}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{JSON.stringify(selectedItem.details, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {savedReadings.map((reading) => (
                <div
                  key={reading.id}
                  onClick={() => setSelectedItem(reading)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {getTypeIcon(reading.type)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-cinzel font-medium text-slate-200 truncate group-hover:text-amber-200">
                        {reading.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate font-sans-clean">
                        {reading.summary}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {new Date(reading.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-amber-400 font-cinzel group-hover:underline">
                      Inspect →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
