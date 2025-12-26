
import React from 'react';
import { Language, translations } from '../translations';
import { BrandInsight } from '../types';

interface InsightsDashboardProps {
  lang: Language;
  onBack: () => void;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ lang, onBack }) => {
  const t = translations[lang].insights;

  // Mock Data
  const data: BrandInsight = {
    totalTryOns: 142850,
    engagementRate: 24.5,
    clonesCount: 8420,
    bodyTypeData: [
      { type: 'ECTOMORPH', percentage: 42 },
      { type: 'MESOMORPH', percentage: 38 },
      { type: 'ENDOMORPH', percentage: 20 }
    ],
    topPairings: [
      { item: 'Cyber-Biker Boots', frequency: 65 },
      { item: 'Glass-Fiber Tote', frequency: 42 },
      { item: 'Neon Choker', frequency: 33 }
    ],
    productionRisk: {
      score: 78,
      issue: 'WAIST_RESTRICTION',
      description: '70% of users with high-waist ratios experienced fabric clipping. Recommend adjusting elastane content by 4%.'
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-8 w-8 bg-cyan-500 rounded-lg flex items-center justify-center font-black text-black">B</div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">{t.title}</h2>
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">{t.subtitle}</p>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition"
          >
            {t.backToStudio}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: t.totalTryOns, val: data.totalTryOns.toLocaleString(), change: '+12%', color: 'text-cyan-400' },
             { label: t.engagement, val: `${data.engagementRate}%`, change: '+5.4%', color: 'text-purple-400' },
             { label: 'CLONE_VIRALITY', val: data.clonesCount.toLocaleString(), change: '+22%', color: 'text-white' }
           ].map((stat, i) => (
             <div key={i} className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl group hover:border-white/20 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{stat.label}</p>
                <div className="flex items-end justify-between">
                   <h4 className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.val}</h4>
                   <span className="text-[10px] font-black text-green-500 mb-2">{stat.change}</span>
                </div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Production Risk Matrix */}
           <div className="lg:col-span-8 bg-white/[0.03] border border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition duration-1000">
                 <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/></svg>
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-10">
                    <span className="px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black rounded-full uppercase tracking-widest">{t.riskHigh}</span>
                    <h3 className="text-2xl font-black tracking-tighter uppercase">{t.riskTitle}</h3>
                 </div>

                 <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                          <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f97316" strokeWidth="10" strokeDasharray={`${data.productionRisk.score * 2.82} 282`} strokeLinecap="round" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black">{data.productionRisk.score}</span>
                          <span className="text-[8px] font-bold text-gray-500">RISK_INDEX</span>
                       </div>
                    </div>
                    <div className="flex-1 space-y-6">
                       <div className="space-y-2">
                          <h4 className="text-orange-500 font-black text-sm uppercase tracking-widest">{data.productionRisk.issue}</h4>
                          <p className="text-gray-400 text-lg leading-relaxed">{data.productionRisk.description}</p>
                       </div>
                       <div className="flex gap-4">
                          <button className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition">GENERATE_FIX</button>
                          <button className="border border-white/10 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition">EXPORT_CAD</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Biometric Map */}
           <div className="lg:col-span-4 bg-[#050505] border border-white/5 rounded-[3.5rem] p-10 flex flex-col">
              <h3 className="text-xl font-black tracking-tighter uppercase mb-10">{t.biometrics}</h3>
              <div className="flex-1 space-y-8">
                 {data.bodyTypeData.map((item, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-gray-400">{item.type}</span>
                         <span className="text-cyan-400">{item.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-10 pt-10 border-t border-white/5">
                 <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed">
                    Source: Aggregated Biometric Neural Mapping (142k Sessions)
                 </p>
              </div>
           </div>
        </div>

        {/* Neural Pairings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
           <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
              <h3 className="text-xl font-black tracking-tighter uppercase mb-10">{t.pairings}</h3>
              <div className="space-y-6">
                 {data.topPairings.map((pair, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 group hover:border-purple-500/40 transition">
                      <div className="flex items-center gap-6">
                         <div className="h-12 w-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-purple-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth={2}/></svg>
                         </div>
                         <div>
                            <h5 className="text-[11px] font-black uppercase tracking-widest mb-1">{pair.item}</h5>
                            <span className="text-[8px] font-bold text-gray-500">CATEGORY: ACCESSORIES</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-purple-400">{pair.frequency}%</div>
                         <div className="text-[8px] font-bold text-gray-600 uppercase">CO-OCCURRENCE</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-cyan-500 text-black rounded-[3rem] p-12 flex flex-col justify-between relative overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.3)]">
              <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 pointer-events-none">
                 <svg className="w-80 h-80" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tighter uppercase mb-6 leading-none">Market<br/>Forecast AI</h3>
                <p className="text-black/70 text-lg font-bold max-w-sm leading-relaxed mb-10">
                   Based on synthesis velocity, this garment is projected to sell out in 14 days if dropped with "Cyber-Biker" aesthetic tags.
                </p>
              </div>
              <button className="w-fit bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:scale-105 transition shadow-2xl">
                 Approve AI Drop
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
