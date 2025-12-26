
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { BrandProduct } from '../types';

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
  const t = translations[lang].arena; // Reusing translations
  const [commentingId, setCommentingId] = useState<string | null>(null);

  const sortedProducts = [...products].sort((a, b) => b.trendScore - a.trendScore);

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
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-cyan-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest">₺{prod.price.toLocaleString()}</div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                  <button onClick={() => onTryOn(prod)} className="bg-white text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition active:scale-95">TRY ON</button>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1"><h3 className="text-xl font-black uppercase tracking-tight mb-2 leading-none">{prod.name}</h3><p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed line-clamp-2">{prod.description}</p></div>
                  <div className="text-right shrink-0"><div className="text-cyan-400 text-xl font-black leading-none">{Math.round(prod.trendScore)}</div><div className="text-[7px] font-bold text-gray-700 uppercase tracking-widest">RANK</div></div>
                </div>
                <button onClick={() => onBuy(prod.buyLink)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">SATIN AL</button>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <button onClick={() => onLike(prod.id)} className="flex items-center gap-2 group/btn"><span className="text-red-500 text-lg group-hover/btn:scale-125 transition">❤️</span><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{prod.likes}</span></button>
                  <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">VIEWS: {prod.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceView;
