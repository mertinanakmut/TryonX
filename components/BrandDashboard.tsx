
import React, { useState } from 'react';
import { Language, translations } from '../translations.ts';
import { BrandProduct, StyleChallenge, RunwayPost } from '../types.ts';

interface BrandDashboardProps {
  lang: Language;
  products: BrandProduct[];
  challenges: StyleChallenge[];
  runwayPosts: RunwayPost[];
  onAddProduct: (product: Partial<BrandProduct>) => void;
  onDeleteProduct: (id: string) => void;
  onAddChallenge: (challenge: Partial<StyleChallenge>) => void;
  onDeleteChallenge: (id: string) => void;
  onUpdateBrand: (brandId: string, updates: { brandName?: string, brandLogo?: string }) => void;
  onBack: () => void;
}

type DashboardTab = 'brands' | 'products' | 'challenges';

const BrandDashboard: React.FC<BrandDashboardProps> = ({ 
  lang, products, challenges, runwayPosts, onAddProduct, onDeleteProduct, onAddChallenge, onDeleteChallenge, onUpdateBrand, onBack 
}) => {
  const t = translations[lang].brandPanel;
  const [activeTab, setActiveTab] = useState<DashboardTab>('brands');
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingChallenge, setIsAddingChallenge] = useState(false);
  
  const [newProd, setNewProd] = useState<Partial<BrandProduct>>({ name: '', price: 0, description: '', category: 'tops', imageUrl: '', buyLink: '' });
  const [newCh, setNewCh] = useState<Partial<StyleChallenge>>({ title: '', tag: '#', description: '', prize: '', deadline: '', bannerImage: '', linkedProductId: '' });

  const brands = Array.from(new Set((products || []).map(p => p.brandId))).map(id => {
    const brandProd = (products || []).find(p => p.brandId === id);
    return {
      id,
      name: brandProd?.brandName || id,
      logo: brandProd?.brandLogo || '',
      productCount: (products || []).filter(p => p.brandId === id).length
    };
  });

  const activeBrand = brands.find(b => b.id === editingBrandId);
  const brandProducts = (products || []).filter(p => p.brandId === editingBrandId);

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 sm:p-12 animate-in fade-in duration-700 relative z-50">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-10 gap-6">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
               <div className="h-2 w-10 bg-cyan-500"></div>
               <h1 className="text-4xl font-black tracking-tighter uppercase">{t.title}</h1>
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] ml-1 sm:ml-14">{t.subtitle}</p>
          </div>
          <button onClick={onBack} className="px-10 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition active:scale-95 relative z-20">PANELİ KAPAT</button>
        </div>

        <div className="flex gap-8 border-b border-white/5 relative z-10">
           {['brands', 'products', 'challenges'].map(id => (
             <button 
               key={id}
               onClick={() => { setActiveTab(id as DashboardTab); setEditingBrandId(null); }} 
               className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
             >
               {id === 'brands' ? 'MARKALAR' : id === 'products' ? 'ÜRÜNLER' : 'YARIŞMALAR'}
               {activeTab === id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></div>}
             </button>
           ))}
        </div>

        {activeTab === 'brands' && !editingBrandId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {brands.map(brand => (
              <div 
                key={brand.id} 
                onClick={() => setEditingBrandId(brand.id)}
                className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 group hover:border-cyan-500/50 transition cursor-pointer relative overflow-hidden"
              >
                <div className="flex flex-col items-center gap-6 relative z-10">
                   <div className="h-20 w-20 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                      <img src={brand.logo} className="h-full w-full object-cover" alt={brand.name} />
                   </div>
                   <div className="text-center">
                      <h3 className="text-xl font-black uppercase tracking-tighter">{brand.name}</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{brand.productCount} ÜRÜN</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'brands' && editingBrandId && activeBrand && (
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-500 relative z-10">
             <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8 h-fit">
                   <button onClick={() => setEditingBrandId(null)} className="text-[10px] font-black text-gray-500 hover:text-white flex items-center gap-2 mb-4">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" /></svg>
                      GERİ
                   </button>
                   <div className="flex flex-col items-center gap-6">
                      <img src={activeBrand.logo} className="w-32 h-32 object-cover rounded-[2rem] border-2 border-white/10" />
                      <div className="w-full space-y-4">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">LOGO URL</label>
                            <input 
                              defaultValue={activeBrand.logo}
                              onBlur={(e) => onUpdateBrand(activeBrand.id, { brandLogo: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-cyan-500 outline-none" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">MARKA ADI</label>
                            <input 
                              defaultValue={activeBrand.name}
                              onBlur={(e) => onUpdateBrand(activeBrand.id, { brandName: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold focus:border-cyan-500 outline-none" 
                            />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 space-y-8">
                   <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">{activeBrand.name} ÜRÜNLERİ</h2>
                      <button 
                        onClick={() => {
                          setIsAddingProduct(true);
                          setNewProd({ ...newProd, brandId: activeBrand.id, brandName: activeBrand.name, brandLogo: activeBrand.logo });
                        }} 
                        className="bg-cyan-500 text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition active:scale-95"
                      >
                         + YENİ ÜRÜN
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {brandProducts.map(prod => (
                        <div key={prod.id} className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 flex gap-6 group hover:border-white/20 transition">
                           <img src={prod.imageUrl} className="h-24 w-24 object-cover rounded-xl border border-white/10" />
                           <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-start">
                                 <h4 className="text-xs font-black uppercase tracking-tight truncate">{prod.name}</h4>
                                 <button onClick={() => onDeleteProduct(prod.id)} className="text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} /></svg></button>
                              </div>
                              <p className="text-[10px] font-bold text-gray-500 uppercase">₺{prod.price?.toLocaleString()}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-x-auto relative z-10">
             <table className="w-full text-left min-w-[600px]">
                <tbody className="divide-y divide-white/5">
                   {(products || []).map(prod => (
                      <tr key={prod.id} className="group hover:bg-white/[0.02] transition-colors">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-6">
                               <img src={prod.imageUrl} className="h-16 w-16 rounded-2xl object-cover border border-white/10" />
                               <div>
                                 <p className="text-sm font-black uppercase tracking-tight">{prod.name}</p>
                                 <p className="text-[8px] font-bold text-gray-500 uppercase mt-1">MARKA: {prod.brandName}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6 text-[11px] font-black">₺{prod.price?.toLocaleString()}</td>
                         <td className="px-10 py-6 text-right">
                            <button 
                              onClick={() => onDeleteProduct(prod.id)} 
                              className="px-4 py-2 text-[9px] font-black text-red-500 uppercase rounded-full hover:bg-red-500 hover:text-white transition"
                            >
                              SİL
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-12 relative z-10">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter">AKTİF YARIŞMALAR</h2>
                <button 
                  onClick={() => setIsAddingChallenge(true)} 
                  className="bg-purple-500 text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition active:scale-95"
                >
                   + YENİ YARIŞMA
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(challenges || []).map(ch => (
                  <div key={ch.id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden group">
                     <img src={ch.bannerImage} className="h-48 w-full object-cover opacity-60 group-hover:opacity-100 transition" />
                     <div className="p-8 space-y-4">
                        <div className="flex justify-between items-start">
                           <div>
                              <h4 className="text-sm font-black uppercase tracking-widest">{ch.title}</h4>
                              <p className="text-[10px] font-bold text-purple-400 mt-1">{ch.tag}</p>
                           </div>
                           <button onClick={() => onDeleteChallenge(ch.id)} className="text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg></button>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ch.prize}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {isAddingProduct && (
        <div className="fixed inset-0 z-[600] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
           <div className="bg-[#050505] border border-white/10 p-10 rounded-[3rem] w-full max-w-xl space-y-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter">YENİ ÜRÜN EKLE</h2>
              <div className="space-y-4">
                <input placeholder="Ürün Adı" value={newProd.name} onChange={e=>setNewProd({...newProd, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none" />
                <input placeholder="Fiyat" type="number" value={newProd.price || ''} onChange={e=>setNewProd({...newProd, price: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none" />
                <input placeholder="Görsel URL" value={newProd.imageUrl} onChange={e=>setNewProd({...newProd, imageUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none" />
                <input placeholder="Satın Alma Linki" value={newProd.buyLink} onChange={e=>setNewProd({...newProd, buyLink: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-cyan-500 outline-none" />
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    onAddProduct(newProd); 
                    setIsAddingProduct(false); 
                    setNewProd({ name: '', price: 0, description: '', category: 'tops', imageUrl: '', buyLink: '' });
                  }} 
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-500 transition"
                >
                  EKLE
                </button>
                <button onClick={() => setIsAddingProduct(false)} className="w-full py-2 text-[10px] font-black text-gray-500 uppercase">İPTAL</button>
              </div>
           </div>
        </div>
      )}

      {isAddingChallenge && (
        <div className="fixed inset-0 z-[600] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
           <div className="bg-[#050505] border border-white/10 p-10 rounded-[3rem] w-full max-w-xl space-y-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter">YENİ YARIŞMA</h2>
              <div className="space-y-4">
                <input placeholder="Yarışma Başlığı" value={newCh.title} onChange={e=>setNewCh({...newCh, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none" />
                <input placeholder="Hashtag (#)" value={newCh.tag} onChange={e=>setNewCh({...newCh, tag: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none" />
                <input placeholder="Ödül" value={newCh.prize} onChange={e=>setNewCh({...newCh, prize: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none" />
                <input placeholder="Açıklama" value={newCh.description} onChange={e=>setNewCh({...newCh, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none" />
                <input placeholder="Banner Görsel URL" value={newCh.bannerImage} onChange={e=>setNewCh({...newCh, bannerImage: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none" />
                <select 
                  value={newCh.linkedProductId} 
                  onChange={e=>setNewCh({...newCh, linkedProductId: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold focus:border-purple-500 outline-none text-white"
                >
                  <option value="" className="bg-black">Gerekli Ürün Seçin</option>
                  {(products || []).map(p => <option key={p.id} value={p.id} className="bg-black">{p.brandName} - {p.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    onAddChallenge(newCh); 
                    setIsAddingChallenge(false); 
                    setNewCh({ title: '', tag: '#', description: '', prize: '', deadline: '', bannerImage: '', linkedProductId: '' });
                  }} 
                  className="w-full py-5 bg-purple-500 text-black rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition"
                >
                  OLUŞTUR
                </button>
                <button onClick={() => setIsAddingChallenge(false)} className="w-full py-2 text-[10px] font-black text-gray-500 uppercase">İPTAL</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BrandDashboard;
