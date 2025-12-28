
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudioView from './components/StudioView';
import AuthView from './components/AuthView';
import MarketplaceView from './components/MarketplaceView';
import BrandDashboard from './components/BrandDashboard';
import ArenaView from './components/ArenaView';
import LiveStylist from './components/LiveStylist';
import ProfileSidebar from './components/ProfileSidebar';
import LandingView from './components/LandingView';
import UserSearchView from './components/UserSearchView';
import UserProfileView from './components/UserProfileView';
import { TryOnState, BrandProduct, User, LookbookEntry, StyleChallenge, RunwayPost, StyleArchitect } from './types';
import { performTryOn } from './services/falService';
import { getFashionAdvice } from './services/geminiService';
import { translations, Language } from './translations';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [showProfile, setShowProfile] = useState(false);
  const [marketFilter, setMarketFilter] = useState<string | null>(null);

  const [state, setState] = useState<TryOnState>({
    view: 'landing', 
    currentUser: null,
    targetUser: null,
    personImage: null, garmentImage: null, resultImage: null,
    category: 'tops', scenario: 'studio', isLoading: false,
    status: 'idle', error: null, 
    lookbook: [], 
    closet: [],
    brandProducts: [],
    challenges: [],
    runwayPosts: [],
    architects: [], 
    activeChallengeId: null,
    searchQuery: '',
    allUsers: [],
    measurements: null,
    preferences: null
  });

  const updateState = (updates: Partial<TryOnState>) => setState(p => ({ ...p, ...updates }));

  useEffect(() => {
    const initApp = async () => {
      try {
        // Oturum durumunu kontrol et
        const { data: { session } } = await supabase.auth.getSession();
        let currentUserData = null;
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!profileError && profile) {
            currentUserData = profile;
          }
        }

        // Ürün ve yarışma verilerini çek (hata olsa bile uygulama çalışmaya devam etsin)
        const [productsRes, challengesRes, profilesRes] = await Promise.allSettled([
          supabase.from('products').select('*'),
          supabase.from('challenges').select('*'),
          supabase.from('profiles').select('*')
        ]);

        const brandProducts = productsRes.status === 'fulfilled' ? (productsRes.value.data as BrandProduct[] || []) : [];
        const challenges = challengesRes.status === 'fulfilled' ? (challengesRes.value.data as StyleChallenge[] || []) : [];
        const allUsers = profilesRes.status === 'fulfilled' ? (profilesRes.value.data as User[] || []) : [];

        updateState({
          brandProducts,
          challenges,
          allUsers,
          currentUser: currentUserData
        });
      } catch (e) {
        console.error("Initialization failed:", e);
      }
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (event === 'SIGNED_IN') {
             updateState({ currentUser: profile, view: 'home' });
          } else {
             updateState({ currentUser: profile });
          }
        } else {
          updateState({ currentUser: null });
        }
      } catch (err) {
        console.error("Auth change error:", err);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleTryOnExecute = async () => {
    if (!state.personImage || !state.garmentImage) return;
    updateState({ isLoading: true, status: 'processing', error: null, resultImage: null });
    try {
      const resultUrl = await performTryOn(state.personImage, state.garmentImage, state.category);
      const advice = await getFashionAdvice(state.personImage, state.garmentImage, lang);
      const entry: LookbookEntry = {
        id: Date.now().toString(),
        personImage: state.personImage,
        garmentImage: state.garmentImage,
        resultImage: resultUrl,
        date: Date.now(),
        advice
      };
      updateState({ resultImage: resultUrl, isLoading: false, status: 'completed', lookbook: [entry, ...state.lookbook] });
    } catch (err: any) {
      updateState({ isLoading: false, status: 'error', error: err.message });
    }
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    if (state.currentUser) {
      try {
        const { id, email, ...updatableFields } = updates;
        const { error } = await supabase
          .from('profiles')
          .update(updatableFields)
          .eq('id', state.currentUser.id);
        
        if (!error) {
          updateState({ currentUser: { ...state.currentUser, ...updatableFields } });
        }
      } catch (err) {
        console.error("Update profile error:", err);
      }
    }
  };

  const handleFollow = async (targetId: string) => {
    if (!state.currentUser) {
      updateState({ view: 'auth' });
      return;
    }
    try {
      const targetUser = state.allUsers.find(u => u.id === targetId);
      if (!targetUser) return;

      const isFollowing = state.currentUser.following.includes(targetId);
      const updatedFollowing = isFollowing 
        ? state.currentUser.following.filter(id => id !== targetId)
        : [...state.currentUser.following, targetId];
      
      await supabase.from('profiles').update({ following: updatedFollowing }).eq('id', state.currentUser.id);
      
      const updatedFollowers = isFollowing 
        ? targetUser.followers.filter(id => id !== state.currentUser?.id)
        : [...targetUser.followers, state.currentUser!.id];
      await supabase.from('profiles').update({ followers: updatedFollowers }).eq('id', targetId);

      const { data: profiles } = await supabase.from('profiles').select('*');
      updateState({ allUsers: (profiles as User[]) || [] });
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const NeuralXIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M19 5L5 19" stroke="url(#x_grad_home)" strokeWidth="3" strokeLinecap="round" />
      <path d="M5 5L19 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
      <defs>
        <linearGradient id="x_grad_home" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d2ff" /><stop offset="1" stopColor="#9d50bb" />
        </linearGradient>
      </defs>
    </svg>
  );

  const renderMarquee = () => {
    const brands = Array.from(new Set(state.brandProducts.map(p => p.brandId))).map(id => {
      const brandProd = state.brandProducts.find(p => p.brandId === id);
      return { id, name: brandProd?.brandName || id, url: brandProd?.brandLogo || '' };
    }).filter(b => b.url);
    if (brands.length === 0) return null;
    return (
      <div className="relative flex overflow-hidden border-y border-white/5 py-16 bg-black group/marquee">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...brands, ...brands, ...brands].map((brand, idx) => (
            <div key={`${brand.id}-${idx}`} onClick={() => { setMarketFilter(brand.id); updateState({ view: 'marketplace' }); }} className="mx-16 flex flex-col items-center gap-6 group cursor-pointer shrink-0 transition-all hover:scale-110">
              <div className="h-16 w-16 relative rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] flex items-center justify-center p-3 shadow-2xl">
                <img src={brand.url} className="h-full w-full object-contain grayscale brightness-200 opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt={brand.name} />
              </div>
              <span className="text-[10px] font-black text-white/10 tracking-[0.4em] uppercase group-hover:text-cyan-400 transition-colors">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (state.view === 'landing') {
    return <LandingView lang={lang} setLang={setLang} onEnter={() => updateState({ view: 'home' })} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <Header 
        lang={lang} setLang={setLang} currentUser={state.currentUser}
        onViewTech={() => {}}
        onViewStudio={() => updateState({ view: 'studio', resultImage: null, error: null })}
        onViewHome={() => updateState({ view: 'home', searchQuery: '' })}
        onViewMarketplace={() => { setMarketFilter(null); updateState({ view: 'marketplace' }); }}
        onViewArena={() => updateState({ view: 'arena' })}
        onViewAdmin={() => updateState({ view: 'brand' })}
        onViewAuth={() => updateState({ view: 'auth' })}
        onLogout={async () => { 
          try {
            await supabase.auth.signOut();
            updateState({ currentUser: null, view: 'home' }); 
          } catch (e) {}
        }}
        onOpenProfile={() => setShowProfile(true)}
        onSearch={(q) => updateState({ searchQuery: q, view: q ? 'search' : 'home' })}
        searchQuery={state.searchQuery}
      />
      
      <main className="flex-1 w-full relative z-10">
        {state.view === 'home' && (
          <div className="space-y-32 animate-in fade-in duration-1000 pb-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-12">
              <div className="relative overflow-hidden rounded-[5rem] bg-[#020202] border border-white/5 p-12 sm:p-32 shadow-[0_0_100px_rgba(0,0,0,1)] group min-h-[750px] flex items-center">
                <div className="absolute inset-0 studio-grid opacity-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none hologram-pulse z-0">
                  <NeuralXIcon className="w-full h-full rotate-x-slow drop-shadow-[0_0_120px_rgba(0,210,255,0.4)]" />
                </div>
                <div className="relative z-10 max-w-4xl space-y-12 text-left">
                   <div className="flex items-center gap-4 mb-4 float-tech">
                      <div className="h-[2px] w-16 bg-cyan-500 shadow-[0_0_100px_rgba(0,210,255,0.4)]"></div>
                      <span className="text-[12px] font-black uppercase tracking-[0.8em] text-cyan-500">NEURAL_SYNTHESIS_CORE_02</span>
                   </div>
                   <h2 className="text-8xl sm:text-[13rem] font-black mb-12 tracking-tighter leading-[0.75] uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">GET VIRTUAL <br/><span className="tryonx-text-gradient animate-pulse">STYLE</span></h2>
                   <p className="text-gray-400 text-xl sm:text-2xl font-medium max-w-xl mb-16 leading-relaxed uppercase tracking-tight">Biyometrik eşleşme ve nöral render teknolojisiyle tarzını dijital evrende yeniden inşa et.</p>
                   <div className="flex flex-wrap gap-6 items-center">
                     <button onClick={() => updateState({ view: 'studio' })} className="bg-white text-black px-20 py-8 rounded-full text-sm font-black uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">STÜDYOYU BAŞLAT</button>
                     <button onClick={() => updateState({ view: 'marketplace' })} className="px-14 py-7 rounded-full border border-white/10 text-sm font-black uppercase tracking-[0.2em] backdrop-blur-xl hover:bg-white hover:text-black transition-all">MARKETİ GEZ</button>
                   </div>
                </div>
              </div>
            </div>
            {renderMarquee()}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-24">
              <div className="space-y-16">
                <div className="flex justify-between items-end border-b border-white/5 pb-12">
                   <h3 className="text-6xl font-black tracking-tighter uppercase leading-none">NEURAL ARENA</h3>
                   <button onClick={() => updateState({ view: 'arena' })} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition group flex items-center gap-4">ARENAYI KEŞFET <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth={3} /></svg></button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 group relative aspect-[21/10] rounded-[4rem] overflow-hidden border border-white/10 cursor-pointer shadow-2xl" onClick={() => updateState({ view: 'arena' })}>
                    {state.challenges.length > 0 && (
                      <>
                        <img src={state.challenges[0]?.bannerImage} className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-12 flex flex-col justify-end">
                          <span className="bg-cyan-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,210,255,0.6)] w-fit mb-4">{state.challenges[0]?.tag}</span>
                          <h4 className="text-5xl font-black uppercase tracking-tight">{state.challenges[0]?.title}</h4>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="lg:col-span-4 bg-[#080808] border border-white/5 rounded-[4rem] p-12 flex flex-col justify-between shadow-2xl">
                    <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10">MİMARLAR</h5>
                    <div className="space-y-8">
                        {state.allUsers.slice(0, 3).map((u, i) => (
                          <div key={u.id} onClick={() => updateState({ targetUser: u, view: 'user_profile' })} className="flex items-center gap-6 group cursor-pointer">
                            <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-cyan-500 transition-colors">
                               <img src={u.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <p className="text-lg font-black uppercase group-hover:text-cyan-400 transition-colors">{u.name}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.view === 'search' && (
          <UserSearchView query={state.searchQuery} users={state.allUsers} onViewProfile={(u) => updateState({ targetUser: u, view: 'user_profile' })} />
        )}

        {state.view === 'user_profile' && state.targetUser && (
          <UserProfileView user={state.targetUser} isFollowing={state.currentUser?.following.includes(state.targetUser.id) || false} onFollow={() => handleFollow(state.targetUser!.id)} onBack={() => updateState({ view: 'home', targetUser: null })} />
        )}

        {state.view === 'studio' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
            <StudioView state={state} lang={lang} onStateUpdate={updateState} onExecute={handleTryOnExecute} onSave={() => {}} onShare={() => {}} loadingStep={0} setShowScanner={() => {}} />
          </div>
        )}
        
        {state.view === 'marketplace' && (
          <MarketplaceView lang={lang} products={marketFilter ? state.brandProducts.filter(p => p.brandId === marketFilter) : state.brandProducts} onBack={() => updateState({ view: 'home' })} onTryOn={(p) => updateState({ garmentImage: p.imageUrl, category: p.category, view: 'studio' })} onLike={() => {}} onComment={() => {}} onView={() => {}} onBuy={(l) => window.open(l, '_blank')} />
        )}

        {state.view === 'arena' && (
          <ArenaView lang={lang} challenges={state.challenges} posts={state.runwayPosts} architects={state.architects} products={state.brandProducts} onBack={() => updateState({ view: 'home' })} onVote={() => {}} onParticipate={() => {}} onComment={() => {}} onSave={() => {}} />
        )}

        {state.view === 'auth' && (
          <AuthView lang={lang} onSuccess={(user) => {
            updateState({ currentUser: user, view: 'home' });
          }} onCancel={() => updateState({ view: 'home' })} />
        )}

        {state.view === 'brand' && (
          <BrandDashboard lang={lang} products={state.brandProducts} challenges={state.challenges} runwayPosts={state.runwayPosts} onBack={() => updateState({ view: 'home' })} onAddProduct={() => {}} onDeleteProduct={() => {}} onAddChallenge={() => {}} onDeleteChallenge={() => {}} onUpdateBrand={() => {}} />
        )}
      </main>

      {showProfile && state.currentUser && (
        <ProfileSidebar lang={lang} user={state.currentUser} onClose={() => setShowProfile(false)} onLogout={async () => { 
          try {
            await supabase.auth.signOut();
            updateState({ currentUser: null }); 
            setShowProfile(false); 
          } catch (e) {}
        }} onUpdateUser={handleUpdateProfile} />
      )}
      <LiveStylist resultImage={state.resultImage} lang={lang} />
    </div>
  );
};

export default App;
