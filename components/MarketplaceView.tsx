
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { BrandProduct, Comment } from '../types';

interface MarketplaceViewProps {
  lang: Language;
  products: BrandProduct[];
  onTryOn: (product: BrandProduct) => void;
  onLike: (productId: string) => void;
  onComment: (productId: string, text: string) => void;
  onView: (productId: string) => void;
  onBuy: (link: string) => void;
  onBack: () => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ 
  lang, products, onTryOn, onLike, onComment, onView, onBuy, onBack 
}) => {
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const sortedProducts = [...(products || [])].sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0));
  const activeProduct = (products || []).find(p => p.id === activeCommentId);

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase">NEURAL MARKET</h1>
            <p className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-[0.6em] uppercase">ZARA, P&B, BERSHKA & MORE</p>
          </div>
          <button onClick={onBack} className="w-full sm:w-auto px-10 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition active:scale-95">BACK</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {sortedProducts.map((prod) => (
            <div key={prod.id} className="group relative flex flex-col bg-white/[0.01] border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden hover:border-white/20 transition-all shadow-2xl">
              <div className="aspect-[4/5] relative overflow-hidden bg-[#0a0a0a]">
                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-80" />
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 pr-4 rounded-full border border-white/10">
                  <div className="h-6 w-6 rounded-full overflow-hidden border border-white/20"><img src={prod.brandLogo} alt={prod.brandName} className="w-full h-full object-cover" /></div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/70">{prod.brandName}</span>
                </div>
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-cyan-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest">₺{prod.price?.toLocaleString()}</div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-[2px] gap-4">
                  <button onClick={() => onTryOn(prod)} className="bg-white text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition active:scale-95">TRY ON</button>
                  <button onClick={() => setActiveCommentId(prod.id)} className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-full text-[9px] font-black uppercase hover:bg-white/20 transition">REVIEWS ({prod.comments?.length || 0})</button>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1"><h3 className="text-xl font-black uppercase tracking-tight mb-2 leading-none">{prod.name}</h3><p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed line-clamp-2">{prod.description}</p></div>
                  <div className="text-right shrink-0"><div className="text-cyan-400 text-xl font-black leading-none">{Math.round(prod.trendScore || 0)}</div><div className="text-[7px] font-bold text-gray-700 uppercase tracking-widest">RANK</div></div>
                </div>
                <button onClick={() => onBuy(prod.buyLink)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">SATIN AL</button>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <button onClick={() => onLike(prod.id)} className="flex items-center gap-2 group/btn"><span className="text-red-500 text-lg group-hover/btn:scale-125 transition">❤️</span><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{prod.likes || 0}</span></button>
                  <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">VIEWS: {prod.views || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeCommentId && activeProduct && (
        <div className="fixed inset-0 z-[700] bg-black/80 backdrop-blur-sm flex justify-end">
           <div className="w-full max-w-md bg-[#050505] border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-widest">PRODUCT REVIEWS</h2>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">{activeProduct.name}</p>
                 </div>
                 <button onClick={() => setActiveCommentId(null)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">×</button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                 {activeProduct.comments && activeProduct.comments.length > 0 ? activeProduct.comments.map(c => (
                    <div key={c.id} className="space-y-2">
                       <div className="flex items-center gap-3">
                          <img src={c.userAvatar || 'https://via.placeholder.com/40'} className="h-6 w-6 rounded-full" />
                          <span className="text-[10px] font-black uppercase text-cyan-400">{c.userName}</span>
                          <span className="text-[8px] font-bold text-gray-600 ml-auto">{new Date(c.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <p className="text-[11px] text-gray-400 leading-relaxed pl-9">{c.text}</p>
                    </div>
                 )) : (
                    <div className="text-center py-20 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Henüz inceleme yok.</div>
                 )}
              </div>
              <div className="p-8 border-t border-white/5 space-y-4">
                 <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Ürün hakkında ne düşünüyorsun?" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium outline-none h-24 focus:border-cyan-500 transition-all resize-none"></textarea>
                 <button onClick={() => { if (newComment.trim()) { onComment(activeCommentId, newComment); setNewComment(""); } }} className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest">GÖNDER</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceView;
