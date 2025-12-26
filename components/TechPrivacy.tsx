
import React from 'react';
import { Language, translations } from '../translations';

interface TechPrivacyProps {
  lang: Language;
  onBack: () => void;
}

const TechPrivacy: React.FC<TechPrivacyProps> = ({ lang, onBack }) => {
  const t = translations[lang].techPrivacy;

  return (
    <div className="min-h-screen bg-black text-white p-8 animate-in fade-in duration-700 relative overflow-hidden">
      <div className="absolute inset-0 studio-grid opacity-20 pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-20 relative z-10 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="h-2 w-12 bg-cyan-500"></div>
                <h1 className="text-4xl font-black tracking-tighter uppercase">{t.title}</h1>
             </div>
             <p className="text-gray-500 text-xs font-bold tracking-[0.4em] uppercase">{t.subtitle}</p>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition"
          >
            {t.back}
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {/* Neural Engine */}
           <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 hover:border-cyan-500/30 transition-all group">
              <div className="h-14 w-14 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 transition duration-500">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t.engineTitle}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{t.engineDesc}</p>
              <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                 <span className="text-[8px] font-bold text-cyan-400/60 uppercase">KLING_V1.5_CORE</span>
                 <span className="text-[8px] font-bold text-purple-400/60 uppercase">REALISM_LAYER_V2</span>
              </div>
           </div>

           {/* Privacy */}
           <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 hover:border-purple-500/30 transition-all group">
              <div className="h-14 w-14 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition duration-500">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t.privacyTitle}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{t.privacyDesc}</p>
              <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                 <span className="text-[8px] font-bold text-green-500/60 uppercase">AES-256_ENCRYPTED</span>
                 <span className="text-[8px] font-bold text-gray-500 uppercase">LOCAL_START_SYNC</span>
              </div>
           </div>

           {/* Resolution */}
           <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 hover:border-white/20 transition-all group">
              <div className="h-14 w-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition duration-500">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t.resolutionTitle}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{t.resolutionDesc}</p>
              <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                 <span className="text-[8px] font-bold text-gray-500 uppercase">4K_SYNTHESIS</span>
                 <span className="text-[8px] font-bold text-gray-500 uppercase">TIER_1_BANDWIDTH</span>
              </div>
           </div>

           {/* Data Sovereignty */}
           <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 hover:border-red-500/30 transition-all group">
              <div className="h-14 w-14 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 transition duration-500">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t.dataSovereignty}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{t.dataSovereigntyDesc}</p>
              <div className="mt-8 pt-8 border-t border-white/5">
                 <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">PURGE_NEURAL_HISTORY</button>
              </div>
           </div>
        </div>

        {/* Verification Banner */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-black to-purple-950/40 rounded-[3rem] p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                 <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <div>
                 <h4 className="text-2xl font-black uppercase tracking-tight">{t.verified}</h4>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Audit Log: #TRX-992-SEC</p>
              </div>
           </div>
           <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed max-w-sm text-center md:text-right">
              All infrastructure is compliant with global AI safety and privacy protocols. 
              Physical servers located in Tier-4 Secure Zones.
           </p>
        </div>
      </div>
    </div>
  );
};

export default TechPrivacy;
