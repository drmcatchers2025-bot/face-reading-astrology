import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Smartphone, CheckCircle, Copy, Check, RefreshCw, X, ShieldCheck, ArrowRight, Upload } from 'lucide-react';

interface MobileSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotId: '1' | '2';
  slotName: string;
  onImageReceived: (imageData: string) => void;
}

export const MobileSyncModal: React.FC<MobileSyncModalProps> = ({
  isOpen,
  onClose,
  slotId,
  slotName,
  onImageReceived,
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [mobileUrl, setMobileUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isReceived, setIsReceived] = useState(false);
  const [loading, setLoading] = useState(true);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize sync session
  useEffect(() => {
    if (!isOpen) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    setLoading(true);
    setIsReceived(false);

    fetch('/api/mobile-sync/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId, slotName }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.sessionId) {
          setSessionId(data.sessionId);
          setPairCode(data.pairCode);

          const fullUrl = `${window.location.origin}/?mobileSyncSession=${data.sessionId}&slot=${slotId}`;
          setMobileUrl(fullUrl);

          try {
            const qr = await QRCode.toDataURL(fullUrl, {
              width: 280,
              margin: 1.5,
              color: {
                dark: '#080a14',
                light: '#ffffff',
              },
            });
            setQrDataUrl(qr);
          } catch (qrErr) {
            console.error('QR code generation failed:', qrErr);
          }

          // Start polling status every 1.5s
          startPolling(data.sessionId);
        }
      })
      .catch((err) => console.error('Failed to initiate sync session:', err))
      .finally(() => setLoading(false));

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, slotId, slotName]);

  const startPolling = (sid: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/mobile-sync/status/${sid}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.hasImage && data.image) {
          setIsReceived(true);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

          setTimeout(() => {
            onImageReceived(data.image);
            onClose();
          }, 1200);
        }
      } catch (err) {
        console.warn('Poll error:', err);
      }
    }, 1500);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-[#0d101d] to-[#070912] border border-amber-500/30 p-6 sm:p-8 shadow-2xl text-center space-y-5 overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-cinzel text-amber-300 uppercase tracking-widest">
            <Smartphone className="w-3 h-3 text-amber-400" />
            <span>Mobile Continuity Lens</span>
          </div>
          <h3 className="text-xl font-cinzel font-semibold text-slate-100">
            Upload from Your Phone
          </h3>
          <p className="text-xs text-slate-400 font-sans-clean">
            Take a selfie or choose a portrait on your smartphone to upload directly to <span className="text-amber-300 font-medium">Portrait {slotId} ({slotName})</span>.
          </p>
        </div>

        {/* Status: Transferred Success */}
        {isReceived ? (
          <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 animate-fadeIn">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-cinzel text-emerald-300 font-semibold">
              Photo Received!
            </h4>
            <p className="text-xs text-slate-300">
              Transferring portrait into the Somatic Mirror analysis...
            </p>
          </div>
        ) : loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs font-cinzel text-slate-400">
              Generating secure mobile bridge...
            </span>
          </div>
        ) : (
          <div className="space-y-5">
            {/* QR Code Container */}
            <div className="relative mx-auto w-56 h-56 p-3 rounded-2xl bg-white border-2 border-amber-400/70 shadow-[0_0_25px_rgba(212,175,55,0.25)] flex items-center justify-center">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Scan with smartphone camera"
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
              {/* Radar scanner pulse animation */}
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/50 animate-ping pointer-events-none opacity-20" />
            </div>

            {/* Instruction Checklist */}
            <div className="text-left p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 font-sans-clean">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Open your phone's camera app and point it at the QR code.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Tap the notification to open the instant photo uploader.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Snap your portrait; it transfers to your computer in real-time.</span>
              </div>
            </div>

            {/* 6-Digit Pair Code Fallback */}
            {pairCode && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="text-left">
                  <span className="text-[10px] font-cinzel text-slate-400 uppercase tracking-wider block">
                    Pairing Code
                  </span>
                  <span className="text-base font-mono font-bold tracking-widest text-amber-300">
                    {pairCode}
                  </span>
                </div>

                <button
                  onClick={copyUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-cinzel transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copied ? 'Link Copied' : 'Copy Mobile Link'}</span>
                </button>
              </div>
            )}

            {/* Live Polling Status Indicator */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-amber-400/90 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Awaiting photo upload from phone...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
