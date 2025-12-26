
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudioView from './components/StudioView';
import AuthView from './components/AuthView';
import ArenaView from './components/ArenaView';
import MarketplaceView from './components/MarketplaceView';
import BrandDashboard from './components/BrandDashboard';
import LiveStylist from './components/LiveStylist';
import { TryOnState, GeminiStyleAdvice, BrandProduct, User, StyleChallenge, StyleArchitect, LookbookEntry } from './types';
import { performTryOn } from './services/falService';
import { getFashionAdvice } from './services/geminiService';
import { translations, Language } from './translations';

const PARTNER_LOGOS = [
  { id: 'zara', name: 'ZARA', url: 'https://images.unsplash.com/photo-1539109132381-3151b8a75c6a?w=200&h=200&fit=crop&fm=png' },
  { id: 'pb', name: 'PULL&BEAR', url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&h=200&fit=crop&fm=png' },
  { id: 'bershka', name: 'BERSHKA', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&h=200&fit=crop&fm=png' },
  { id: 'strad', name: 'STRADIVARIUS', url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop&fm=png' },
  { id: 'inditex', name: 'NEURAL_LINK', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop&fm=png' }
];

const INITIAL_PRODUCTS: BrandProduct[] = [
  {
    id: 'z1', brandId: 'zara', brandName: 'ZARA', 
    brandLogo: 'https://images.unsplash.com/photo-1539109132381-3151b8a75c6a?w=100&fm=png',
    name: 'Saten Gece Elbisesi', price: 2199, currency: '₺', category: 'one-piece',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&fm=jpg',
    description: 'Yüksek parlaklıkta saten doku.', buyLink: 'https://zara.com', likes: 1200, views: 45000, comments: [], trendScore: 98
  },
  {
    id: 'pb1', brandId: 'pullbear', brandName: 'P&B', 
    brandLogo: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&fm=png',
    name: 'Oversize Grafik Hoodie', price: 1299, currency: '₺', category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&fm=jpg',
    description: 'Yumuşak pamuklu sokak stili.', buyLink: 'https://pullandbear.com', likes: 850, views: 32000, comments: [], trendScore: 85
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const t = translations[lang];
  const [loadingStep, setLoadingStep] = useState(0);

  // Added missing properties (searchQuery, allUsers, preferences) to satisfy TryOnState interface
  const [state, setState] = useState<TryOnState>(() => {
    const savedUser = localStorage.getItem('tryonx_user');
    return {
      view: 'home', currentUser: savedUser ? JSON.parse(savedUser) : null,
      targetUser: null,
      personImage: null, garmentImage: null, resultImage: null,
      category: 'tops', scenario: 'studio', isLoading: false,
      status: 'idle', error: null, lookbook: [], closet: [],
      measurements: null, brandProducts: INITIAL_PRODUCTS,
      challenges: [], runwayPosts: [], architects: [], activeChallengeId: null,
      searchQuery: '',
      allUsers: [],
      preferences: null
    };
  });

  const updateState = (updates: Partial<TryOnState>) => setState(p => ({ ...p, ...updates }));

  const handleTryOnExecute = async () => {
    if (!state.personImage || !state.garmentImage) return;
    updateState({ isLoading: true, status: 'processing', error: null, resultImage: null });
    try {
      const resultUrl = await performTryOn(state.personImage, state.garmentImage, state.category);
      const advice = await getFashionAdvice(state.personImage, state.garmentImage, lang);
      const entry: LookbookEntry = {
        id: Date.now().toString(), personImage: state.personImage,
        garmentImage: state.garmentImage, resultImage: resultUrl, date: Date.now(), advice
      };
      updateState({ resultImage: resultUrl, isLoading: false, status: 'completed', lookbook: [entry, ...state.lookbook] });
    } catch (err: any) {
      updateState({ isLoading: false, status: 'error', error: err.message });
    }
  };

  const renderMarquee = () => {
    const items = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];
    return (
      <div className="relative flex overflow-hidden border-y border-white/5 py-16 bg-[#030303]">
        <div className="flex animate-marquee whitespace-nowrap">
          {items.map((partner, idx) => (
            <div key={`${partner.id}-${idx}`} className="mx-16 flex flex-col items-center gap-6 group cursor-pointer">
              <div className="h-16 w-auto relative">
                <img src={partner.url} className="h-full object-contain grayscale brightness-200 opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt={partner.name} />
                <div className="absolute inset-0 bg-cyan-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase group-hover:text-cyan-400 transition-colors">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <Header 
        lang={lang} setLang={setLang} currentUser={state.currentUser}
        onViewStudio={() => updateState({ view: 'studio', resultImage: null, error: null })}
        onViewHome={() => updateState({ view: 'home' })}
        onViewMarketplace={() => updateState({ view: 'marketplace' })}
        onViewArena={() => updateState({ view: 'arena' })}
        onViewAdmin={() => updateState({ view: 'brand' })}
        onViewAuth={() => updateState({ view: 'auth' })}
        onLogout={() => { updateState({ currentUser: null, view: 'home' }); localStorage.removeItem('tryonx_user'); }}
        onOpenProfile={() => {}} onViewTech={() => {}}
        // Fix: Added missing onSearch and searchQuery properties to Header
        onSearch={(query: string) => updateState({ searchQuery: query })}
        searchQuery={state.searchQuery}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative z-10">
        {state.view === 'home' ? (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <div className="relative overflow-hidden rounded-[3.5rem] bg-[#050505] border border-white/5 p-12 sm:p-24 shadow-2xl group">
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-[2px] w-12 bg-cyan-500"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">NEURAL_TRANSITION</span>
                </div>
                <h2 className="text-6xl sm:text-8xl font-black mb-8 tracking-tighter leading-[0.85]">GET <span className="tryonx-text-gradient">NEURAL</span></h2>
                <p className="text-gray-500 text-lg mb-12 max-w-md">Geleceğin deneme kabini. Biyometrik eşleşme ile mükemmel tarzı keşfet.</p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => updateState({ view: 'studio' })} className="tryonx-gradient px-12 py-5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition">STÜDYOYU BAŞLAT</button>
                  <button onClick={() => updateState({ view: 'marketplace' })} className="px-12 py-5 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition">MARKETİ GEZ</button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 studio-grid"></div>
            </div>

            <div className="space-y-12">
               <div className="text-center">
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.6em] mb-4">BİYOMETRİ KARTLARI</p>
                  <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
               </div>
               {renderMarquee()}
            </div>
          </div>
        ) : state.view === 'studio' ? (
          <StudioView 
            state={state} lang={lang} onStateUpdate={updateState} 
            onExecute={handleTryOnExecute} onSave={() => {}} onShare={() => {}}
            loadingStep={loadingStep} setShowScanner={() => {}}
          />
        ) : state.view === 'marketplace' ? (
          <MarketplaceView lang={lang} products={state.brandProducts} onBack={() => updateState({ view: 'home' })} onTryOn={(p) => updateState({ garmentImage: p.imageUrl, category: p.category, view: 'studio' })} onLike={() => {}} onComment={() => {}} onView={() => {}} onBuy={() => {}} />
        ) : state.view === 'auth' ? (
          <AuthView lang={lang} onSuccess={(user) => updateState({ currentUser: user, view: 'home' })} onCancel={() => updateState({ view: 'home' })} />
        ) : null}
      </main>
      <LiveStylist resultImage={state.resultImage} lang={lang} />
    </div>
  );
};

export default App;
