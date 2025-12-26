
import React, { useState } from 'react';
import { LEGAL_CONTENT } from '../legalContent';

interface LegalViewProps {
  onBack: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'agreement'>('privacy');

  return (
    <div className="fixed inset-0 z-[500] bg-black text-white p-6 sm:p-12 animate-in fade-in duration-500 overflow-y-auto">
      <div className="absolute inset-0 studio-grid opacity-20 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-2 w-12 bg-cyan-500"></div>
              <h1 className="text-4xl font-black tracking-tighter uppercase">NEURAL_POLICY_v{LEGAL_CONTENT.version}</h1>
            </div>
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.4em] uppercase">VERİ EGEMENLİĞİ VE HUKUKİ PROTOKOL</p>
          </div>
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition shadow-2xl active:scale-95"
          >
            STÜDYOYA DÖN
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'privacy' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
          >
            GİZLİLİK POLİTİKASI
          </button>
          <button 
            onClick={() => setActiveTab('agreement')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'agreement' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
          >
            KULLANICI SÖZLEŞMESİ
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-16 py-10">
          {activeTab === 'privacy' ? (
            <div className="space-y-12">
              <h2 className="text-2xl font-black tracking-tighter text-cyan-500 uppercase">{LEGAL_CONTENT.privacyPolicy.title}</h2>
              {LEGAL_CONTENT.privacyPolicy.sections.map((section) => (
                <div key={section.id} className="group space-y-4 border-l-2 border-white/5 pl-8 hover:border-cyan-500/30 transition-all">
                  <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors">
                    SECT_{section.id.padStart(2, '0')} // {section.title}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-3xl">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              <h2 className="text-2xl font-black tracking-tighter text-purple-500 uppercase">{LEGAL_CONTENT.userAgreement.title}</h2>
              {LEGAL_CONTENT.userAgreement.sections.map((section) => (
                <div key={section.id} className="group space-y-4 border-l-2 border-white/5 pl-8 hover:border-purple-500/30 transition-all">
                  <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-purple-400 transition-colors">
                    CLAUSE_{section.id} // {section.title}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-3xl">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-20 pb-32 border-t border-white/5 text-center space-y-6">
           <div className="flex justify-center gap-10 opacity-20">
              <div className="text-[8px] font-black uppercase tracking-widest">KVKK_COMPLIANT</div>
              <div className="text-[8px] font-black uppercase tracking-widest">GDPR_VERIFIED</div>
              <div className="text-[8px] font-black uppercase tracking-widest">AES-256_ACTIVE</div>
           </div>
           <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">
             © 2024 TryonX Neural Synthesis Studio. Tüm hakları saklıdır.
           </p>
        </div>
      </div>
    </div>
  );
};

export default LegalView;
