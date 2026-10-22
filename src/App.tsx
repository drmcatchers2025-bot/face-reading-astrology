import React, { useState, useEffect } from 'react';
import { AppMode, PortraitSlot, FaceAnalysisResult, ComparativeMatchResult, SavedReading } from './types';
import { PRESET_PORTRAITS } from './data/archetypes';
import { Header } from './components/Header';
import { FaceUploader } from './components/SomaticMirror/FaceUploader';
import { ComparativeFaceMatch } from './components/SomaticMirror/ComparativeFaceMatch';
import { InstantDivinationHub } from './components/Divination/InstantDivinationHub';
import { CelestialCalculator } from './components/SyncreticOracle/CelestialCalculator';
import { SplitView } from './components/SplitView';
import { VaultModal } from './components/VaultModal';
import { MobileUploadView } from './components/MobileUploadView';
import { Eye, Compass, ArrowRight, Sparkles, RefreshCw, ChevronDown, ChevronUp, Smartphone } from 'lucide-react';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const mobileSyncSession = urlParams.get('mobileSyncSession');
  const mobileSlot = urlParams.get('slot') || '1';

  // Dedicated Mobile Capture Interface when accessed from phone
  if (mobileSyncSession) {
    return (
      <MobileUploadView
        sessionId={mobileSyncSession}
        slotId={mobileSlot}
      />
    );
  }

  const [mode, setMode] = useState<AppMode>('somatic');
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isDivinationExpanded, setIsDivinationExpanded] = useState(false);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>(() => {
    try {
      const stored = localStorage.getItem('osiris_vault_readings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Portrait 1 Slot
  const [slot1, setSlot1] = useState<PortraitSlot>({
    id: '1',
    name: 'You',
    image: PRESET_PORTRAITS[0].image,
    analysis: null,
    loading: false,
  });

  // Portrait 2 Slot
  const [slot2, setSlot2] = useState<PortraitSlot>({
    id: '2',
    name: 'Counterpart',
    image: PRESET_PORTRAITS[1].image,
    analysis: null,
    loading: false,
  });

  // Comparative Face Match State
  const [matchResult, setMatchResult] = useState<ComparativeMatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Sync saved readings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('osiris_vault_readings', JSON.stringify(savedReadings));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [savedReadings]);

  // Analyze single face form
  const handleAnalyzeSingle = async (slotId: '1' | '2') => {
    const targetSlot = slotId === '1' ? slot1 : slot2;
    const setSlot = slotId === '1' ? setSlot1 : setSlot2;

    if (!targetSlot.image) return;

    setSlot((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/mian-xiang/analyze-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: targetSlot.image,
          portraitId: slotId,
          subjectName: targetSlot.name,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setSlot((prev) => ({ ...prev, analysis: data.analysis }));
      }
    } catch (err) {
      console.error('Error analyzing face:', err);
    } finally {
      setSlot((prev) => ({ ...prev, loading: false }));
    }
  };

  // Analyze comparative face match between Portrait 1 & Portrait 2
  const handleAnalyzeFaceMatch = async () => {
    if (!slot1.image || !slot2.image) return;
    setMatchLoading(true);

    try {
      const res = await fetch('/api/mian-xiang/compare-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image1: slot1.image,
          image2: slot2.image,
          name1: slot1.name,
          name2: slot2.name,
        }),
      });
      const data = await res.json();
      if (data.matchAnalysis) {
        setMatchResult(data.matchAnalysis);
      }
    } catch (err) {
      console.error('Error matching faces:', err);
    } finally {
      setMatchLoading(false);
    }
  };

  // Load sample demo faces for quick testing
  const loadSampleDuo = () => {
    setSlot1({
      id: '1',
      name: 'Aurelius (Solar)',
      image: PRESET_PORTRAITS[0].image,
      analysis: null,
      loading: false,
    });
    setSlot2({
      id: '2',
      name: 'Selene (Lunar)',
      image: PRESET_PORTRAITS[1].image,
      analysis: null,
      loading: false,
    });
    setMatchResult(null);
  };

  // Save item to vault
  const handleSaveToVault = (readingData: any) => {
    const newEntry: SavedReading = {
      id: `reading_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type: readingData.type || 'face_match',
      title: readingData.title || 'Untitled Reading',
      summary: readingData.summary || '',
      score: readingData.score,
      details: readingData.details || readingData,
    };
    setSavedReadings((prev) => [newEntry, ...prev]);
  };

  // Clear vault
  const handleClearReadings = () => {
    if (window.confirm('Clear all stored readings in your local ecosystem vault?')) {
      setSavedReadings([]);
      localStorage.removeItem('osiris_vault_readings');
    }
  };

  return (
    <div className="min-h-screen bg-[#08090e] text-slate-100 flex flex-col font-sans-clean selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Osiris Ecosystem Navigation */}
      <Header
        mode={mode}
        setMode={setMode}
        savedReadingsCount={savedReadings.length}
        onOpenVault={() => setIsVaultOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* ======================================================== */}
        {/* MODE 1: THE SOMATIC MIRROR & DIVINATORY COMPANION (Primary) */}
        {/* ======================================================== */}
        {mode === 'somatic' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Streamlined Hero Section */}
            <div className="relative rounded-3xl bg-quartz-glass border border-amber-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 uppercase font-semibold">
                    The Somatic &amp; Divinatory Mirror
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400 font-serif">Mian Xiang Form &amp; Energetic Flow</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-medium text-slate-100 tracking-tight leading-tight">
                  Somatic Face Reading &amp; Interpersonal Harmony
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans-clean max-w-2xl">
                  Upload your portrait directly from your computer or snap a selfie with your phone. The computer-vision model automatically maps the Three Zones to compute your harmonic synergy and energetic flow.
                </p>

                {/* Mobile camera notice */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-300/90 font-cinzel">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Click "From Phone" on either portrait card to transfer photos directly from your smartphone camera.</span>
                </div>
              </div>
            </div>

            {/* SECTION: MIAN XIANG (FACE & FORM ANALYSIS) */}
            <section id="mian-xiang-section" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-slate-100">
                    MIAN XIANG (FACE READING)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload Portrait 1 and Portrait 2 to compute somatic compatibility.
                  </p>
                </div>

                <button
                  onClick={loadSampleDuo}
                  className="text-xs text-amber-400/80 hover:text-amber-300 font-cinzel underline underline-offset-4"
                >
                  Load Sample Duo
                </button>
              </div>

              {/* Two Portrait Slots Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FaceUploader
                  slot={slot1}
                  onUpdateSlot={(updated) => setSlot1((prev) => ({ ...prev, ...updated }))}
                  onAnalyzeSingle={() => handleAnalyzeSingle('1')}
                  otherSlotName={slot2.name}
                />
                <FaceUploader
                  slot={slot2}
                  onUpdateSlot={(updated) => setSlot2((prev) => ({ ...prev, ...updated }))}
                  onAnalyzeSingle={() => handleAnalyzeSingle('2')}
                  otherSlotName={slot1.name}
                />
              </div>

              {/* Central Action: ANALYZE FACE MATCH */}
              <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-950/70 border border-amber-500/25 text-center space-y-3">
                <div className="flex items-center gap-3 text-xs font-cinzel text-amber-300 uppercase tracking-widest">
                  <span>{slot1.name}</span>
                  <span className="text-amber-400 font-serif">𓁹</span>
                  <span>{slot2.name}</span>
                </div>

                <button
                  onClick={handleAnalyzeFaceMatch}
                  disabled={!slot1.image || !slot2.image || matchLoading}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-cinzel font-bold text-base tracking-widest flex items-center gap-3 shadow-[0_0_35px_rgba(212,175,55,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {matchLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                      <span>Synthesizing Somatic Interlock...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5 text-slate-950" />
                      <span>ANALYZE FACE MATCH</span>
                      <ArrowRight className="w-5 h-5 text-slate-950" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 font-cormorant italic text-sm">
                  Computes complementary energetic flow vectors, zone interlock, and elemental harmony.
                </p>
              </div>

              {/* Active Comparative Result Screen */}
              {matchResult && (
                <div className="pt-4">
                  <ComparativeFaceMatch
                    matchResult={matchResult}
                    portrait1={slot1}
                    portrait2={slot2}
                    onSaveToVault={() =>
                      handleSaveToVault({
                        type: 'face_match',
                        title: `Mian Xiang Match: ${slot1.name} & ${slot2.name}`,
                        summary: `${matchResult.resonanceClassification} · ${matchResult.overallSynergyScore}% Synergy`,
                        details: matchResult,
                      })
                    }
                    onCrossReferenceSynastry={() => setMode('syncretic')}
                  />
                </div>
              )}
            </section>

            {/* SECTION: OPTIONAL COLLAPSIBLE DIVINATION CASTS */}
            <section className="pt-4">
              <div className="rounded-3xl bg-slate-950/60 border border-slate-800/80 overflow-hidden">
                <button
                  onClick={() => setIsDivinationExpanded(!isDivinationExpanded)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-900/60 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-cinzel font-semibold text-slate-200">
                        Optional: Instant Divination Casts (Tarot · Runes · I Ching)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Immediate interpersonal guidance without needing birthdates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-cinzel text-amber-300">
                    <span>{isDivinationExpanded ? 'Hide Casts' : 'Explore Casts'}</span>
                    {isDivinationExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isDivinationExpanded && (
                  <div className="p-6 border-t border-slate-800 animate-fadeIn">
                    <InstantDivinationHub onSaveToVault={handleSaveToVault} />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 2: SYNCRETIC STAR & HEXAGRAM ORACLE (Date-Based) */}
        {/* ======================================================== */}
        {mode === 'syncretic' && (
          <div className="space-y-8 animate-fadeIn">
            <CelestialCalculator
              initialName1={slot1.name}
              initialName2={slot2.name}
              onSaveToVault={handleSaveToVault}
              onSwitchToSomatic={() => setMode('somatic')}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 3: DUAL SANCTUARY (SIDE-BY-SIDE SPLIT VIEW) */}
        {/* ======================================================== */}
        {mode === 'split' && (
          <SplitView
            slot1={slot1}
            slot2={slot2}
            onUpdateSlot1={(updated) => setSlot1((prev) => ({ ...prev, ...updated }))}
            onUpdateSlot2={(updated) => setSlot2((prev) => ({ ...prev, ...updated }))}
            onAnalyzeFaceMatch={handleAnalyzeFaceMatch}
            matchResult={matchResult}
            matchLoading={matchLoading}
            onAnalyzeSingle={handleAnalyzeSingle}
            onSaveToVault={handleSaveToVault}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-[#06070c] py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-cinzel text-slate-400">
            <span>OSIRIS ECOSYSTEM</span>
            <span>·</span>
            <span>The Somatic Mirror &amp; Syncretic Oracle</span>
          </div>
          <div className="text-[11px] font-sans-clean text-slate-500">
            Unified Lifetime Subscription: dawmmilazzo7@gmail.com · Classical Physiognomy &amp; Celestial Ephemeris
          </div>
        </div>
      </footer>

      {/* Saved Readings Vault Modal */}
      <VaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        savedReadings={savedReadings}
        onClearReadings={handleClearReadings}
        onSelectReading={(reading) => {
          // Replay reading in modal
        }}
      />
    </div>
  );
}
