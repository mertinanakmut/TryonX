
import React, { useState, useEffect } from 'react';
import NeuralLogo from './NeuralLogo';
import { Language, translations } from '../translations';

interface LandingViewProps {
  lang: Language;
  onEnter: () => void;
  setLang: (lang: Language) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ lang, onEnter, setLang }) => {
  const t = translations[lang].landing;
  const [isScanning, setIsScanning] = useState(false);
  const [dataFlow, setDataFlow] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        `NEURAL_LINK_${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
        `SYNCING_CORE_NODES...`,
        `FETCHING_PHYSICS_ENGINE_V2.5`,
        `ENCRYPTING_BIOMETRICS_AES256`,
        `LATENCY_CALC: ${Math.floor(Math.random() * 20 + 10)}ms`,
        `PHASE_MAPPING_ACTIVE`
      ];
      setDataFlow(prev => [logs[Math.floor(Math.random() * logs.length)], ...prev].slice(0, 8));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setIsScanning(true);
    setTimeout(() => {
      onEnter();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 studio-grid opacity-30 pointer-events-none"></div>
      
      {/* Centerpiece Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl text-center">
        <div className="mb-16 relative group cursor-pointer animate-float">
          <NeuralLogo className="w-40 h-40" isProcessing={isScanning} />
          
          {/* Circular Scanner Ring */}
          <div className="absolute inset-0 -m-8 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]">
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_10px_#9d50bb]"></div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 group">
           <h1 className="text-8xl sm:text-[10rem] font-black tracking-tighter uppercase tryonx-text-gradient select-none">
             Tryon
           </h1>
           <NeuralLogo className="w-20 h-20 sm:w-32 sm:h-32" />
        </div>

        <p className="text-white/40 text-[11px] font-black uppercase tracking-[1.2em] mb-24 animate-pulse select-none">
          {t.tagline}
        </p>

        {/* Biometric Link Button */}
        <div className="relative w-full max-w-md flex flex-col items-center">
          {isScanning ? (
            <div className="flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-1000">
              <div className="space-y-2">
                 <p className="text-cyan-400 text-[11px] font-black uppercase tracking-[0.5em] animate-pulse">
                   {t.scanning}
                 </p>
                 <p className="text-gray-700 text-[8px] font-bold uppercase tracking-widest italic">ESTABLISHING_ENCRYPTED_TUNNEL...</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleEnter}
              className="group relative w-full overflow-hidden rounded-full p-[3px] transition-all hover:scale-105 active:scale-95 shadow-[0_0_80px_rgba(0,210,255,0.1)]"
            >
              <div className="absolute inset-0 tryonx-gradient animate-pulse group-hover:animate-none group-hover:opacity-100 opacity-60"></div>
              <div className="relative bg-black rounded-full py-8 px-16 transition-all group-hover:bg-transparent duration-700">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-[13px] font-black uppercase tracking-[0.4em] text-white">
                    {t.cta}
                  </span>
                  <svg className="w-5 h-5 text-cyan-400 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Technical Footer Info */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">{t.ver}</p>
           </div>
           <p className="text-[9px] font-bold text-gray-800 uppercase tracking-tighter max-w-[200px] leading-tight">
             {t.footer}
           </p>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
