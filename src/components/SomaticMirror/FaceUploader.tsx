import React, { useState, useRef, useEffect } from 'react';
import { PortraitSlot } from '../../types';
import { FaceWireframeOverlay } from './FaceWireframeOverlay';
import { MobileSyncModal } from './MobileSyncModal';
import { Camera, Upload, Smartphone, RefreshCw, X, RotateCcw } from 'lucide-react';

interface FaceUploaderProps {
  slot: PortraitSlot;
  onUpdateSlot: (updated: Partial<PortraitSlot>) => void;
  onAnalyzeSingle: () => void;
  otherSlotName?: string;
}

export const FaceUploader: React.FC<FaceUploaderProps> = ({
  slot,
  onUpdateSlot,
  onAnalyzeSingle,
  otherSlotName,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMobileSyncOpen, setIsMobileSyncOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-trigger single-face analysis behind the scenes when an image arrives without analysis
  useEffect(() => {
    if (slot.image && !slot.analysis && !slot.loading) {
      onAnalyzeSingle();
    }
  }, [slot.image, slot.analysis, slot.loading, onAnalyzeSingle]);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onUpdateSlot({
          image: base64,
          name: slot.name || file.name.split('.')[0] || `Portrait ${slot.id}`,
          analysis: null,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Camera Activation
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Please use file upload or Phone sync.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror horizontally for natural webcam feel
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onUpdateSlot({ image: dataUrl, analysis: null });
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const clearPhoto = () => {
    onUpdateSlot({ image: null, analysis: null });
  };

  return (
    <div className="flex flex-col rounded-3xl bg-gradient-to-b from-[#0f121d] to-[#090b14] border border-slate-800/80 p-5 shadow-xl transition-all hover:border-amber-500/30">
      
      {/* Slot Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-bold font-mono">
            {slot.id}
          </span>
          <input
            type="text"
            value={slot.name}
            onChange={(e) => onUpdateSlot({ name: e.target.value })}
            placeholder={`Portrait ${slot.id} Name`}
            className="text-sm font-cinzel font-medium bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-b focus:border-amber-400 max-w-[160px]"
          />
        </div>

        {slot.image && (
          <button
            onClick={clearPhoto}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-300 transition-colors"
            title="Replace with new photo"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Change</span>
          </button>
        )}
      </div>

      {/* Main Visual Display: Camera or Wireframe Overlay */}
      {isCameraActive ? (
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-amber-500/40 flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
          <div className="absolute inset-0 pointer-events-none border border-amber-400/40 rounded-2xl">
            <div className="absolute inset-10 rounded-full border border-dashed border-amber-400/50" />
          </div>
          <div className="absolute bottom-4 flex items-center gap-3">
            <button
              onClick={capturePhoto}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs font-cinzel tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Face</span>
            </button>
            <button
              onClick={stopCamera}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : slot.image ? (
        <FaceWireframeOverlay
          imageSrc={slot.image}
          analysis={slot.analysis}
          activeZone="all"
          showWireframe={true}
          label={`PORTRAIT ${slot.id}: ${slot.name.toUpperCase()}`}
        />
      ) : (
        /* Streamlined Empty Drop / Upload Zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-amber-500/30 hover:border-amber-400/60 bg-slate-950/50 hover:bg-amber-500/5 transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center group"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all flex items-center justify-center text-amber-400 mb-3">
            <Upload className="w-7 h-7" />
          </div>
          <p className="text-xs font-cinzel font-medium text-slate-200">
            Click to Upload Portrait {slot.id}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
            JPG, PNG, WebP or selfie directly from computer
          </p>
        </div>
      )}

      {cameraError && (
        <p className="mt-2 text-[11px] text-rose-400 bg-rose-950/30 border border-rose-800/40 rounded p-2">
          {cameraError}
        </p>
      )}

      {/* Streamlined Upload Options: Upload Image | Upload from Phone | Camera */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Primary Option: Device File / Camera */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-500/40 text-xs font-medium text-slate-100 transition-all shadow-sm"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Upload</span>
        </button>

        {/* Direct Mobile Upload (Continuity Camera via Phone) */}
        <button
          onClick={() => setIsMobileSyncOpen(true)}
          title="Upload face image directly from your mobile phone"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-indigo-900/40 hover:from-amber-500/30 hover:to-indigo-900/60 border border-amber-500/40 text-xs font-medium text-amber-200 transition-all shadow-sm group"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-300 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">From Phone</span>
        </button>

        {/* Desktop Webcam */}
        <button
          onClick={startCamera}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-500/40 text-xs font-medium text-slate-200 transition-all shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Webcam</span>
        </button>
      </div>

      {/* Automatic Analysis Status (Behind the Scenes) */}
      {slot.image && (
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          {slot.loading ? (
            <div className="flex items-center justify-center gap-2 py-2 text-xs font-cinzel text-amber-300">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Mapping Three Zones automatically...</span>
            </div>
          ) : slot.analysis ? (
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-cinzel">
                <span>{slot.analysis.elementalBalance.somaticTemperament}</span>
                <span className="font-mono text-[10px] text-slate-400">
                  Yin {slot.analysis.elementalBalance.yinRatio}% / Yang {slot.analysis.elementalBalance.yangRatio}%
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans-clean line-clamp-2">
                {slot.analysis.somaticSummary}
              </p>
            </div>
          ) : (
            <div className="text-center py-1 text-[11px] text-slate-400 font-mono">
              Facial structure mapped &amp; ready for match
            </div>
          )}
        </div>
      )}

      {/* Mobile Continuity Upload Modal */}
      <MobileSyncModal
        isOpen={isMobileSyncOpen}
        onClose={() => setIsMobileSyncOpen(false)}
        slotId={slot.id}
        slotName={slot.name}
        onImageReceived={(imageData) => {
          onUpdateSlot({ image: imageData, analysis: null });
        }}
      />
    </div>
  );
};
