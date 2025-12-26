
import React, { useState, useRef, useEffect } from 'react';
import { Language, translations } from '../translations';

interface PhygitalScannerProps {
  lang: Language;
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const PhygitalScanner: React.FC<PhygitalScannerProps> = ({ lang, onCapture, onClose }) => {
  const t = translations[lang].phygital;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        onCapture(canvas.toDataURL('image/jpeg'));
        setIsScanning(false);
        onClose();
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in zoom-in duration-500">
      <div className="absolute top-10 right-10 z-50">
        <button onClick={onClose} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="relative w-full max-w-md aspect-[9/16] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,210,255,0.2)]">
        <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover grayscale brightness-110" />
        
        {/* Scanning Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 studio-grid opacity-30"></div>
          <div className="absolute inset-0 border-[40px] border-black/40"></div>
          
          {/* Neural Target Area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-cyan-500/30 rounded-2xl">
             <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
             <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
             <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
             <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>
             
             {isScanning && (
               <div className="absolute inset-0 scanner-line shadow-[0_0_30px_#00d2ff]"></div>
             )}
          </div>

          <div className="absolute bottom-20 left-0 right-0 text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 animate-pulse">
                {isScanning ? t.scanning : "NEURAL_LINK_READY"}
             </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="tryonx-gradient px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition flex items-center gap-4"
        >
          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin hidden data-[active=true]:block" data-active={isScanning}></div>
          {t.scanBtn}
        </button>
      </div>
    </div>
  );
};

export default PhygitalScanner;
