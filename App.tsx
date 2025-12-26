
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StudioView from './components/StudioView';
import InsightsDashboard from './components/InsightsDashboard';
import PhygitalScanner from './components/PhygitalScanner';
import TechPrivacy from './components/TechPrivacy';
import AuthView from './components/AuthView';
import ArenaView from './components/ArenaView';
import BodyProfileView from './components/BodyProfileView';
import PersonalizationWizard from './components/PersonalizationWizard';
import LiveStylist from './components/LiveStylist';
import LegalView from './components/LegalView';
import BrandDashboard from './components/BrandDashboard';
import MarketplaceView from './components/MarketplaceView';
import ProfileSidebar from './components/ProfileSidebar';
import { TryOnState, GeminiStyleAdvice, GarmentCategory, LookbookEntry, ClosetItem, BrandProduct, UserPreferences, Comment, User, StyleChallenge, RunwayPost, StyleArchitect } from './types';
import { performTryOn } from './services/falService';
import { getFashionAdvice } from './services/geminiService';
import { translations, Language } from './translations';

const ADMIN_EMAIL = 'mert.akmut44@gmail.com';

const INITIAL_CHALLENGES: StyleChallenge[] = [
  { 
    id: 'c1', 
    title: 'Zara Elegant Night', 
    tag: '#ZaraStyle', 
    description: 'Zara\'nın yeni koleksiyonuyla şık bir gece kombini oluşturun.',
    rules: ['Resmi arka plan.', 'Zara Saten Elbise.', 'Minimal takı.'],
    linkedProductId: 'z1',
    deadline: '31.12.2025', 
    prize: '₺1000 Hediye Çeki', 
    participants: 1250, 
    bannerImage: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=800' 
  },
  { 
    id: 'c2', 
    title: 'P&B Urban Beat', 
    tag: '#PullAndBear', 
    description: 'Sokak stilini Pull&Bear sweatshirt ile yansıtın.',
    rules: ['Kent senaryosu.', 'Rahat duruş.', 'Sneaker kombin.'],
    linkedProductId: 'pb1',
    deadline: '15.01.2026', 
    prize: 'Özel Koleksiyon Ürünü', 
    participants: 890, 
    bannerImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800' 
  }
];

const INITIAL_ARCHITECTS: StyleArchitect[] = [
  { id: 'a1', name: 'NEURAL_QUEEN', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', clones: 12500, votes: 42000, rank: 1 },
  { id: 'a2', name: 'VOID_WALKER', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', clones: 8400, votes: 31000, rank: 2 }
];

const INITIAL_PRODUCTS: BrandProduct[] = [
  {
    id: 'z1', brandId: 'zara', brandName: 'ZARA', brandLogo: 'https://logo.clearbit.com/zara.com',
    name: 'Dökümlü Saten Elbise', price: 1899, currency: '₺', category: 'one-piece',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
    description: 'Zara şıklığı ile buluşan dökümlü saten kumaş.',
    buyLink: 'https://www.zara.com/tr/',
    likes: 850, views: 12000, comments: [], trendScore: 0
  },
  {
    id: 'pb1', brandId: 'pullbear', brandName: 'PULL&BEAR', brandLogo: 'https://logo.clearbit.com/pullandbear.com',
    name: 'Oversize Grafik Sweatshirt', price: 949, currency: '₺', category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    description: 'Pull&Bear sokak ruhu. Rahat kesim.',
    buyLink: 'https://www.pullandbear.com/tr/',
    likes: 420, views: 8500, comments: [], trendScore: 0
  },
  {
    id: 'b1', brandId: 'bershka', brandName: 'BERSHKA', brandLogo: 'https://logo.clearbit.com/bershka.com',
    name: 'Kargo Paraşüt Pantolon', price: 1199, currency: '₺', category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop',
    description: 'Yeni sezon Bershka kargo pantolon.',
    buyLink: 'https://www.bershka.com/tr/',
    likes: 310, views: 6200, comments: [], trendScore: 0
  },
  {
    id: 'z2', brandId: 'zara', brandName: 'ZARA', brandLogo: 'https://logo.clearbit.com/zara.com',
    name: 'Kısa Suni Deri Ceket', price: 2499, currency: '₺', category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=800&fit=crop',
    description: 'Nöral stüdyoda Zara deri ceket deneyimi.',
    buyLink: 'https://www.zara.com/tr/',
    likes: 120, views: 3400, comments: [], trendScore: 0
  },
  {
    id: 'be2', brandId: 'bershka', brandName: 'BERSHKA', brandLogo: 'https://logo.clearbit.com/bershka.com',
    name: 'Yırtık Bol Kesim Jean', price: 1299, currency: '₺', category: 'bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
    description: 'Bershka ikonik jean serisi.',
    buyLink: 'https://www.bershka.com/tr/',
    likes: 540, views: 7200, comments: [], trendScore: 0
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const t = translations[lang];

  const calculateTrendScore = (likes: number, comments: number, views: number) => {
    return (likes * 2) + (comments * 1.5) + (views * 0.1);
  };

  const [state, setState] = useState<TryOnState>(() => {
    const savedLookbook = localStorage.getItem('tryonx_lookbook');
    const savedCloset = localStorage.getItem('tryonx_closet');
    const savedUser = localStorage.getItem('tryonx_user');
    const savedProducts = localStorage.getItem('tryonx_products');
    
    let products = savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS;
    let user = savedUser ? JSON.parse(savedUser) : null;
    
    products = products.map((p: BrandProduct) => ({
      ...p,
      trendScore: calculateTrendScore(p.likes, p.comments.length, p.views)
    }));

    return {
      view: 'home', 
      currentUser: user,
      personImage: null,
      garmentImage: null,
      resultImage: null,
      category: 'tops',
      scenario: 'studio',
      isLoading: false,
      status: 'idle',
      error: null,
      lookbook: savedLookbook ? JSON.parse(savedLookbook) : [],
      closet: savedCloset ? JSON.parse(savedCloset) : [],
      measurements: null,
      preferences: null,
      brandProducts: products,
      challenges: INITIAL_CHALLENGES,
      runwayPosts: [],
      architects: INITIAL_ARCHITECTS,
      activeChallengeId: null
    };
  });

  const [showScanner, setShowScanner] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [advice, setAdvice] = useState<GeminiStyleAdvice | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval: any;
    if (state.isLoading) {
      interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % 4);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [state.isLoading]);

  const updateState = (updates: Partial<TryOnState>) => setState(p => ({ ...p, ...updates }));

  const handleAuthSuccess = (user: User) => {
    updateState({ currentUser: user });
    localStorage.setItem('tryonx_user', JSON.stringify(user));
    updateState({ view: user.email.toLowerCase() === ADMIN_EMAIL ? 'brand' : 'home' });
  };

  const handleLogout = () => {
    updateState({ currentUser: null, view: 'home' });
    localStorage.removeItem('tryonx_user');
    setShowProfile(false);
  };

  const handleTryOnExecute = async () => {
    if (!state.personImage || !state.garmentImage) return;
    updateState({ isLoading: true, status: 'processing', error: null, resultImage: null });
    try {
      const resultUrl = await performTryOn(state.personImage, state.garmentImage, state.category);
      const styleAdvice = await getFashionAdvice(state.personImage, state.garmentImage, lang);
      const newEntry: LookbookEntry = {
        id: Math.random().toString(36).substr(2, 9),
        personImage: state.personImage,
        garmentImage: state.garmentImage,
        resultImage: resultUrl,
        date: Date.now(),
        advice: styleAdvice
      };
      updateState({ 
        resultImage: resultUrl, 
        isLoading: false, 
        status: 'completed', 
        lookbook: [newEntry, ...state.lookbook].slice(0, 10) 
      });
      setAdvice(styleAdvice);
    } catch (err: any) {
      updateState({ isLoading: false, status: 'error', error: err.message, resultImage: null });
    }
  };

  if (state.view === 'arena') {
    return (
      <ArenaView 
        lang={lang} products={state.brandProducts} challenges={state.challenges} 
        posts={state.runwayPosts} architects={state.architects}
        onBack={() => updateState({ view: 'home' })}
        onVote={(id) => updateState({ runwayPosts: state.runwayPosts.map(p => p.id === id ? {...p, votes: p.votes+1} : p)})}
        onParticipate={(cid) => {
          const ch = state.challenges.find(c => c.id === cid);
          const pr = state.brandProducts.find(p => p.id === ch?.linkedProductId);
          updateState({ activeChallengeId: cid, garmentImage: pr?.imageUrl || null, category: pr?.category || 'tops', view: 'studio', resultImage: null, error: null, status: 'idle', isLoading: false });
        }}
      />
    );
  }

  if (state.view === 'marketplace') {
    return (
      <MarketplaceView 
        lang={lang} products={state.brandProducts}
        onBack={() => updateState({ view: 'home' })}
        onTryOn={(p) => updateState({ garmentImage: p.imageUrl, category: p.category, view: 'studio', resultImage: null, error: null, status: 'idle', isLoading: false })}
        onLike={(id) => updateState({ brandProducts: state.brandProducts.map(p => p.id === id ? {...p, likes: p.likes+1} : p)})}
        onComment={(id, text) => {}} 
        onView={() => {}}
        onBuy={(link) => window.open(link, '_blank')}
      />
    );
  }

  if (state.view === 'brand') {
    return (
      <BrandDashboard 
        lang={lang} products={state.brandProducts} challenges={state.challenges} runwayPosts={state.runwayPosts}
        onBack={() => updateState({ view: 'home' })}
        onAddProduct={(p) => updateState({ brandProducts: [p as BrandProduct, ...state.brandProducts] })}
        onDeleteProduct={(id) => updateState({ brandProducts: state.brandProducts.filter(p => p.id !== id) })}
        onAddChallenge={(c) => updateState({ challenges: [c as StyleChallenge, ...state.challenges] })}
        onDeleteChallenge={(id) => updateState({ challenges: state.challenges.filter(c => c.id !== id) })}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <Header 
        lang={lang} setLang={setLang} currentUser={state.currentUser}
        onViewTech={() => updateState({ view: 'tech' })} 
        onViewStudio={() => updateState({ view: 'studio', activeChallengeId: null, error: null, resultImage: null, status: 'idle', isLoading: false })}
        onViewHome={() => updateState({ view: 'home' })}
        onViewAuth={() => updateState({ view: 'auth' })}
        onViewMarketplace={() => updateState({ view: 'marketplace' })}
        onViewArena={() => updateState({ view: 'arena' })}
        onViewAdmin={() => updateState({ view: 'brand' })}
        onLogout={handleLogout}
        onOpenProfile={() => setShowProfile(true)}
      />
      
      {showScanner && (
        <PhygitalScanner lang={lang} onCapture={(b) => updateState({ garmentImage: b, view: 'studio', error: null, resultImage: null, status: 'idle', isLoading: false })} onClose={() => setShowScanner(false)} />
      )}

      {showProfile && state.currentUser && (
        <ProfileSidebar lang={lang} user={state.currentUser} onClose={() => setShowProfile(false)} onLogout={handleLogout} onUpdateUser={() => {}} />
      )}

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {state.view === 'studio' ? (
          <StudioView 
            state={state} lang={lang} 
            onStateUpdate={updateState} 
            onExecute={handleTryOnExecute}
            onSave={() => {}}
            onShare={() => {}}
            loadingStep={loadingStep}
            setShowScanner={setShowScanner}
          />
        ) : (
          <div className="animate-in fade-in duration-1000">
            <div className="relative mb-12 overflow-hidden rounded-[2rem] sm:rounded-[3.5rem] bg-[#030303] border border-white/5 p-8 sm:p-20 shadow-2xl group">
              <div className="relative z-10 max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-6 animate-pulse">
                    <span className="h-[2px] w-12 bg-cyan-400"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">NEURAL PHASE_01</span>
                  </div>
                  <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] sm:leading-none">
                    GET <span className="tryonx-text-gradient">NEURAL</span>
                  </h2>
                  <p className="text-gray-500 text-sm sm:text-lg font-medium max-w-md leading-relaxed opacity-80 mb-10">
                    Dünyanın en gelişmiş yapay zeka deneme stüdyosu. Zara, P&B ve dahası artık nöral ağda.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => updateState({ view: 'studio', activeChallengeId: null, error: null, resultImage: null, status: 'idle', isLoading: false })} className="tryonx-gradient w-full sm:w-auto px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">STÜDYOYU BAŞLAT</button>
                    <button onClick={() => updateState({ view: 'marketplace' })} className="w-full sm:w-auto px-12 py-5 rounded-full border border-white/10 text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">MARKETİ GEZ</button>
                  </div>
              </div>
              <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 studio-grid"></div>
            </div>
          </div>
        )}
      </main>

      <LiveStylist resultImage={state.resultImage} lang={lang} />
    </div>
  );
};

export default App;
