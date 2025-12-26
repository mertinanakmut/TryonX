
import React, { useState, useEffect } from 'react';
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

  // Simulation of a data stream in the corner
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
    // Deep cinematic entry simulation
    setTimeout(() => {
      onEnter();
    }, 3000);
  };

  const NeuralXIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 5L5 19" stroke="url(#land_grad_pro)" strokeWidth="3" strokeLinecap="round" />
      <path d="M5 5L19 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.9" />
      <circle cx="5" cy="5" r="1" fill="#00d2ff" className="animate-pulse" />
      <circle cx="19" cy="19" r="1" fill="#9d50bb" className="animate-pulse" />
      <defs>
        <linearGradient id="land_grad_pro" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d2ff" />
          <stop offset="1" stopColor="#9d50bb" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Immersive Background */}
      <div className="absolute inset-0 studio-grid opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[200px] pointer-events-none animate-pulse"></div>
      
      {/* Floating Particles Simulation (Visual Only) */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-20"></div>
         <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-20 delay-1000"></div>
         <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full animate-ping opacity-20 delay-500"></div>
      </div>

      {/* Top Header Section */}
      <div className="absolute top-0 left-0 right-0 p-10 flex justify-between items-start z-50">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <NeuralXIcon className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{t.title}</p>
              <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">{t.status}</p>
           </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex flex-col items-end">
             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{t.nodes}</p>
             <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">{t.latency}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 shadow-2xl backdrop-blur-md">
            <button 
              onClick={() => setLang('tr')} 
              className={`px-4 py-1.5 text-[9px] font-black rounded-full transition-all ${lang === 'tr' ? 'bg-white text-black shadow-lg scale-105' : 'text-white/40 hover:text-white'}`}
            >
              TR
            </button>
            <button 
              onClick={() => setLang('en')} 
              className={`px-4 py-1.5 text-[9px] font-black rounded-full transition-all ${lang === 'en' ? 'bg-white text-black shadow-lg scale-105' : 'text-white/40 hover:text-white'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Data Stream (Left Sidebar) */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 pointer-events-none opacity-40">
         {dataFlow.map((log, i) => (
           <p key={i} className="text-[7px] font-mono text-cyan-400 uppercase tracking-widest whitespace-nowrap animate-in slide-in-from-left duration-500">
             {`> ${log}`}
           </p>
         ))}
      </div>

      {/* Centerpiece Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl text-center">
        <div className="mb-16 relative group cursor-pointer">
          <div className="absolute -inset-16 tryonx-gradient opacity-10 blur-3xl animate-pulse group-hover:opacity-30 transition-opacity"></div>
          <div className="relative h-40 w-40 flex items-center justify-center">
            <NeuralXIcon className="w-full h-full float drop-shadow-[0_0_50px_rgba(0,210,255,0.3)]" />
          </div>
          
          {/* Circular Scanner Ring */}
          <div className="absolute inset-0 -m-4 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_#00d2ff]"></div>
          </div>
          <div className="absolute inset-0 -m-8 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]">
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_10px_#9d50bb]"></div>
          </div>
        </div>

        <h1 className="text-8xl sm:text-[12rem] font-black tracking-tighter mb-6 uppercase tryonx-text-gradient select-none">
          {t.title}
        </h1>
        <p className="text-white/40 text-[11px] font-black uppercase tracking-[1.2em] mb-24 animate-pulse select-none">
          {t.tagline}
        </p>

        {/* Biometric Link Button */}
        <div className="relative w-full max-w-md flex flex-col items-center">
          {isScanning ? (
            <div className="flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-1000">
              <div className="relative w-24 h-24">
                 <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                 <div className="absolute inset-0 scanner-line scale-x-50"></div>
                 <div className="absolute inset-6 bg-cyan-500/10 rounded-full flex items-center justify-center">
                    <NeuralXIcon className="w-8 h-8 animate-pulse" />
                 </div>
              </div>
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

          <div className="mt-16 flex items-center gap-6 opacity-30 group">
             <div className="h-[1px] w-12 bg-white/40 group-hover:w-20 group-hover:bg-cyan-500 transition-all duration-700"></div>
             <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">{t.secure}</span>
                <span className="text-[7px] font-bold uppercase text-gray-700">AES-256_ACTIVE</span>
             </div>
             <div className="h-[1px] w-12 bg-white/40 group-hover:w-20 group-hover:bg-purple-500 transition-all duration-700"></div>
          </div>
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
        
        {/* Engineering Badges */}
        <div className="flex gap-10 items-center opacity-40 hover:opacity-100 transition-opacity duration-700">
           <div className="text-right">
              <p className="text-[8px] font-black text-white uppercase">ETHICAL_AI</p>
              <p className="text-[7px] font-bold text-gray-600 uppercase tracking-widest">VERIFIED_2025</p>
           </div>
           <div className="h-8 w-[1px] bg-white/10"></div>
           <div className="text-right">
              <p className="text-[8px] font-black text-white uppercase">CARBON_NEUTRAL</p>
              <p className="text-[7px] font-bold text-gray-600 uppercase tracking-widest">ECO_COMPUTE</p>
           </div>
           <div className="h-8 w-[1px] bg-white/10"></div>
           <div className="flex gap-2">
              <div className="h-10 w-2 bg-cyan-500/20 rounded-full overflow-hidden">
                 <div className="h-2/3 w-full bg-cyan-500 animate-pulse"></div>
              </div>
              <div className="h-10 w-2 bg-purple-500/20 rounded-full overflow-hidden">
                 <div className="h-1/2 w-full bg-purple-500 animate-pulse delay-700"></div>
              </div>
              <div className="h-10 w-2 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-1/3 w-full bg-white/20 animate-pulse delay-1000"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
