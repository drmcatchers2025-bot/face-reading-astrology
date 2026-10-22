import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, Smartphone, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';

interface MobileUploadViewProps {
  sessionId: string;
  slotId?: string;
  onDone?: () => void;
}

export const MobileUploadView: React.FC<MobileUploadViewProps> = ({
  sessionId,
  slotId = '1',
  onDone,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const libraryInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const uploadToComputer = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/mobile-sync/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          image: selectedImage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(data.error || 'Failed to transfer photo to computer. Please check session.');
      }
    } catch (err: any) {
      console.error('Mobile upload error:', err);
      setErrorMessage('Network error communicating with the desktop app.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090e] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans-clean">
      
      {/* Top Mobile Header */}
      <header className="flex items-center justify-between pb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-cinzel">
            𓁹
          </div>
          <div>
            <span className="text-[9px] font-cinzel text-amber-400 uppercase tracking-widest block font-semibold">
              Osiris Ecosystem
            </span>
            <h1 className="text-sm font-cinzel font-medium text-slate-100">
              Mobile Lens Sync
            </h1>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
            Slot {slotId}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full my-6 space-y-6">
        
        {isSuccess ? (
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-4 shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <h2 className="text-xl font-cinzel font-semibold text-slate-100">
              Transferred to Computer!
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed font-sans-clean">
              Your face portrait was received by your computer. You can now look at your computer screen to view the Three Zones and Mian Xiang analysis.
            </p>

            <button
              onClick={() => {
                setSelectedImage(null);
                setIsSuccess(false);
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-cinzel text-amber-300 border border-amber-500/30 transition-all w-full"
            >
              Upload Another Photo
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-cinzel font-semibold text-slate-100">
                Face Portrait Upload
              </h2>
              <p className="text-xs text-slate-400">
                Take a clear front-facing selfie or select a portrait from your photo library.
              </p>
            </div>

            {/* Photo Preview or Placeholder */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-950 border-2 border-dashed border-amber-500/30 flex items-center justify-center shadow-xl">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Captured portrait"
                    className="w-full h-full object-cover"
                  />
                  {/* Facial Alignment Overlay Guide */}
                  <div className="absolute inset-8 rounded-full border border-amber-400/40 pointer-events-none" />
                </>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400/60">
                    <Camera className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-cinzel text-slate-400 block">
                    No Photo Selected Yet
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans-clean block">
                    Keep your head upright and centered in natural light
                  </span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 text-center">
                {errorMessage}
              </div>
            )}

            {/* Hidden Input Elements */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={libraryInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="space-y-3">
              {!selectedImage ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-500 text-slate-950 font-cinzel font-semibold text-xs tracking-wider gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
                  >
                    <Camera className="w-6 h-6" />
                    <span>Take Selfie</span>
                  </button>

                  <button
                    onClick={() => libraryInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-cinzel font-semibold text-xs tracking-wider gap-2 hover:bg-slate-800 active:scale-95 transition-all"
                  >
                    <Upload className="w-6 h-6 text-amber-400" />
                    <span>Choose Photo</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={uploadToComputer}
                    disabled={isUploading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-cinzel font-bold text-sm tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending to Computer...</span>
                      </>
                    ) : (
                      <>
                        <span>Send to Computer</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedImage(null)}
                    disabled={isUploading}
                    className="w-full py-2 text-xs font-cinzel text-slate-400 hover:text-white"
                  >
                    Retake / Choose Different Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-cinzel">
        Connected to Osiris Desktop · Session: {sessionId.substring(0, 10)}...
      </footer>
    </div>
  );
};
