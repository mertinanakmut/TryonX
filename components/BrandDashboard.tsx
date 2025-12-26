
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { BrandProduct, StyleChallenge, RunwayPost } from '../types';

interface BrandDashboardProps {
  lang: Language;
  products: BrandProduct[];
  challenges: StyleChallenge[];
  runwayPosts: RunwayPost[];
  onAddProduct: (product: Partial<BrandProduct>) => void;
  onDeleteProduct: (id: string) => void;
  onAddChallenge: (challenge: Partial<StyleChallenge>) => void;
  onDeleteChallenge: (id: string) => void;
  onBack: () => void;
}

const BrandDashboard: React.FC<BrandDashboardProps> = ({ 
  lang, products, challenges, runwayPosts, onAddProduct, onDeleteProduct, onAddChallenge, onDeleteChallenge, onBack 
}) => {
  const t = translations[lang].brandPanel;
  const tc = translations[lang].categories;
  const t_arena = translations[lang].arena;
  const [activeTab, setActiveTab] = useState<'products' | 'challenges'>('products');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingChallenge, setIsAddingChallenge] = useState(false);
  const [inspectingChallengeId, setInspectingChallengeId] = useState<string | null>(null);
  
  const [newProd, setNewProd] = useState<Partial<BrandProduct>>({ name: '', price: 0, description: '', category: 'tops', imageUrl: '', buyLink: '' });
  const [newCh, setNewCh] = useState<Partial<StyleChallenge>>({ title: '', tag: '', description: '', rules: [], linkedProductId: '', prize: '', deadline: '', bannerImage: '' });

  const getEntriesForChallenge = (id: string) => {
    return runwayPosts.filter(p => p.challengeId === id);
  };

  if (inspectingChallengeId) {
    const ch = challenges.find(c => c.id === inspectingChallengeId);
    const entries = getEntriesForChallenge(inspectingChallengeId);

    return (
      <div className="min-h-screen bg-[#020202] text-white p-6 sm:p-12 animate-in slide-in-from-right-10 duration-500">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-center">
            <div>
              <button onClick={() => setInspectingChallengeId(null)} className="text-[10px] font-black text-gray-500 hover:text-white mb-4 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
                {t.back}
              </button>
              <h2 className="text-3xl font-black tracking-tighter uppercase">{ch?.title} - {t.inspect}</h2>
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.4em] mt-2">{ch?.tag}</p>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-gray-500 font-bold uppercase tracking-widest">{t_arena.noEntries}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {entries.map(entry => (
                <div key={entry.id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-cyan-500/50 transition">
                  <div className="aspect-[3/4] relative">
                    <img src={entry.resultImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                       <p className="text-xs font-black uppercase text-white truncate">{entry.userName}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase">{entry.vibe}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-cyan-400 font-black">{entry.votes}</span>
                        <span className="text-[8px] font-bold text-gray-700 uppercase">OY</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 sm:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-10 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
               <div className="h-2 w-10 bg-cyan-500"></div>
               <h1 className="text-4xl font-black tracking-tighter uppercase">{t.title}</h1>
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] ml-1 sm:ml-14">{t.subtitle}</p>
          </div>
          <button onClick={onBack} className="px-10 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition active:scale-95">BACK</button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-8 border-b border-white/5">
           <button 
             onClick={() => setActiveTab('products')} 
             className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'products' ? 'text-cyan-500' : 'text-gray-500 hover:text-white'}`}
           >
             {t.activeProducts}
             {activeTab === 'products' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-500"></div>}
           </button>
           <button 
             onClick={() => setActiveTab('challenges')} 
             className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'challenges' ? 'text-purple-500' : 'text-gray-500 hover:text-white'}`}
           >
             {t.manageChallenges}
             {activeTab === 'challenges' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500"></div>}
           </button>
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-10">
            <div className="flex justify-end">
               <button onClick={() => setIsAddingProduct(true)} className="bg-white text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition shadow-2xl active:scale-95">{t.uploadProduct}</button>
            </div>
            <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-x-auto shadow-inner">
               <table className="w-full text-left min-w-[600px]">
                  <tbody className="divide-y divide-white/5">
                     {products.map(prod => (
                        <tr key={prod.id} className="group hover:bg-white/[0.02] transition-colors">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-6">
                                 <img src={prod.imageUrl} className="h-16 w-16 rounded-2xl object-cover border border-white/10 shadow-lg" />
                                 <div>
                                   <p className="text-sm font-black uppercase tracking-tight">{prod.name}</p>
                                   <p className="text-[8px] font-bold text-gray-500 uppercase mt-1">ID: {prod.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                             {tc[prod.category as keyof typeof tc]}
                           </td>
                           <td className="px-10 py-6 text-[11px] font-black">₺{prod.price.toLocaleString()}</td>
                           <td className="px-10 py-6 text-right">
                              <button 
                                onClick={() => onDeleteProduct(prod.id)} 
                                className="px-4 py-2 border border-red-500/20 text-[9px] font-black text-red-500 uppercase rounded-full hover:bg-red-500 hover:text-white transition"
                              >
                                {t.delete}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-end">
               <button 
                 onClick={() => setIsAddingChallenge(true)} 
                 className="bg-purple-500 text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition shadow-2xl active:scale-95"
               >
                 + ADD CHALLENGE
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {challenges.map(ch => (
                 <div key={ch.id} className="bg-white/[0.03] border border-white/5 p-8 rounded-[3rem] group hover:border-purple-500/40 transition-all shadow-xl">
                    <div className="flex items-center gap-8">
                       <div className="relative h-24 w-24 rounded-[2rem] overflow-hidden border border-white/10 shrink-0">
                          <img src={ch.bannerImage} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                       </div>
                       <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-lg font-black uppercase tracking-tighter">{ch.title}</p>
                              <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">{ch.tag}</p>
                            </div>
                            <button 
                              onClick={() => onDeleteChallenge(ch.id)} 
                              className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                            >
                              {t.delete}
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                             <div>
                                <p className="text-[8px] font-bold text-gray-500 uppercase">{t.challengePrize}</p>
                                <p className="text-[10px] font-black text-white">{ch.prize}</p>
                             </div>
                             <div>
                                <p className="text-[8px] font-bold text-gray-500 uppercase">PARTICIPANTS</p>
                                <p className="text-[10px] font-black text-white">{getEntriesForChallenge(ch.id).length}</p>
                             </div>
                          </div>
                          <div className="pt-4 flex gap-4">
                            <button 
                              onClick={() => setInspectingChallengeId(ch.id)}
                              className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition"
                            >
                              {t.inspect}
                            </button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Upload Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-[600] bg-black/95 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-[#050505] border border-white/10 p-10 sm:p-14 rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar space-y-8 relative">
              <div className="absolute inset-0 scanner-line opacity-10 pointer-events-none"></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">{t.uploadProduct}</h2>
              <div className="space-y-4">
                <input 
                  value={newProd.name} 
                  onChange={e=>setNewProd({...newProd, name: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none transition" 
                  placeholder={t.productName} 
                />
                <div className="grid grid-cols-2 gap-4">
                   <input 
                    type="number"
                    value={newProd.price || ''} 
                    onChange={e=>setNewProd({...newProd, price: parseFloat(e.target.value)})} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none transition" 
                    placeholder={t.price} 
                  />
                  <select 
                    value={newProd.category} 
                    onChange={e=>setNewProd({...newProd, category: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none transition appearance-none"
                  >
                    <option value="tops">TSHIRT / ÜST</option>
                    <option value="bottoms">PANTOLON / ALT</option>
                    <option value="one-piece">ELBİSE</option>
                  </select>
                </div>
                <input 
                  value={newProd.imageUrl} 
                  onChange={e=>setNewProd({...newProd, imageUrl: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none transition" 
                  placeholder="Image URL" 
                />
                <input 
                  value={newProd.buyLink} 
                  onChange={e=>setNewProd({...newProd, buyLink: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none transition" 
                  placeholder={t.buyLink} 
                />
              </div>
              <div className="flex flex-col gap-4 sticky bottom-0 bg-[#050505] pt-4">
                <button 
                  onClick={() => {onAddProduct(newProd); setIsAddingProduct(false); setNewProd({ name: '', price: 0, description: '', category: 'tops', imageUrl: '', buyLink: '' });}} 
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-500 transition shadow-2xl active:scale-95"
                >
                  {t.save}
                </button>
                <button onClick={() => setIsAddingProduct(false)} className="w-full py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition">Cancel</button>
              </div>
           </div>
        </div>
      )}

      {/* Challenge Add Modal */}
      {isAddingChallenge && (
        <div className="fixed inset-0 z-[600] bg-black/95 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-[#050505] border border-white/10 p-10 sm:p-14 rounded-[3.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar space-y-8 relative">
              <div className="absolute inset-0 scanner-line opacity-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, #9d50bb, transparent)', boxShadow: '0 0 15px #9d50bb' }}></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">NEW ARENA CHALLENGE</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <input 
                    value={newCh.title} 
                    onChange={e=>setNewCh({...newCh, title: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none transition" 
                    placeholder={t.challengeTitle} 
                  />
                  <input 
                    value={newCh.tag} 
                    onChange={e=>setNewCh({...newCh, tag: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none transition" 
                    placeholder={t.challengeTag} 
                  />
                  <textarea 
                    value={newCh.description} 
                    onChange={e=>setNewCh({...newCh, description: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none transition h-24" 
                    placeholder={t.challengeDesc} 
                  />
                  <textarea 
                    value={newCh.rules?.join('\n')} 
                    onChange={e=>setNewCh({...newCh, rules: e.target.value.split('\n')})} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none transition h-24" 
                    placeholder={t.challengeRules} 
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t.linkedProductSelect}</label>
                    <select 
                      value={newCh.linkedProductId} 
                      onChange={e=>setNewCh({...newCh, linkedProductId: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none transition appearance-none"
                    >
                      <option value="">Ürün Seçin</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.brandName} - {p.name}</option>
                      ))}
                    </select>
                  </div>
                  <input 
                    value={newCh.prize} 
                    onChange={e=>setNewCh({...newCh, prize: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none transition" 
                    placeholder={t.challengePrize} 
                  />
                  <input 
                    value={newCh.deadline} 
                    onChange={e=>setNewCh({...newCh, deadline: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none transition" 
                    placeholder={t.challengeDeadline} 
                  />
                  <input 
                    value={newCh.bannerImage} 
                    onChange={e=>setNewCh({...newCh, bannerImage: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none transition" 
                    placeholder={t.challengeBanner} 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-6 sticky bottom-0 bg-[#050505]">
                <button 
                  onClick={() => {onAddChallenge(newCh); setIsAddingChallenge(false); setNewCh({ title: '', tag: '', description: '', rules: [], linkedProductId: '', prize: '', deadline: '', bannerImage: '' });}} 
                  className="w-full py-5 bg-purple-500 text-black rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition shadow-2xl active:scale-95"
                >
                  PUBLISH TO ARENA
                </button>
                <button onClick={() => setIsAddingChallenge(false)} className="w-full py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BrandDashboard;
