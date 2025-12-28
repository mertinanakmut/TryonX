
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
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!error && profile) return profile as User;
    } catch (e) {
      console.error("Profile Fetch Error:", e);
    }
    return null;
  };

  const checkAndSetAuth = async () => {
    // 8 Saniyelik Güvenlik Zaman Aşımı (Zayıf bağlantılar için artırıldı)
    const safetyTimeout = setTimeout(() => {
      if (isCheckingAuth) {
        console.warn("Auth check timed out, proceeding to landing.");
        setIsCheckingAuth(false);
        setIsAuthReady(true);
      }
    }, 8000);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Supabase Session Error:", sessionError);
        throw sessionError;
      }

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          updateState({ currentUser: profile, view: 'home' });
        } else {
          updateState({ 
            view: 'home',
            currentUser: { 
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              role: 'user',
              following: [],
              followers: [],
            } as User
          });
        }
      } else {
        updateState({ view: 'landing' });
      }
    } catch (e) {
      console.error("Auth initialization failed:", e);
      updateState({ view: 'landing' });
    } finally {
      clearTimeout(safetyTimeout);
      setIsCheckingAuth(false);
      setIsAuthReady(true);
    }
  };

  useEffect(() => {
    checkAndSetAuth();

    const fetchGlobalData = async () => {
      try {
        const [prodRes, chalRes, profRes] = await Promise.allSettled([
          supabase.from('products').select('*'),
          supabase.from('challenges').select('*'),
          supabase.from('profiles').select('*')
        ]);
        
        updateState({ 
          brandProducts: prodRes.status === 'fulfilled' ? (prodRes.value.data as BrandProduct[] || []) : [], 
          challenges: chalRes.status === 'fulfilled' ? (chalRes.value.data as StyleChallenge[] || []) : [], 
          allUsers: profRes.status === 'fulfilled' ? (profRes.value.data as User[] || []) : [] 
        });
      } catch (e) {
        console.error("Background data fetch error:", e);
      }
    };

    fetchGlobalData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          updateState({ 
            currentUser: profile || null,
            view: state.view === 'landing' || state.view === 'auth' ? 'home' : state.view
          });
        }
      } else if (event === 'SIGNED_OUT') {
        updateState({ currentUser: null, view: 'landing' });
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleUpdateProfile = async (updates: Partial<User>) => {
    if (!state.currentUser) return;
    try {
      const { id, email, ...updatableFields } = updates;
      const { error } = await supabase
        .from('profiles')
        .update(updatableFields)
        .eq('id', state.currentUser.id);
      
      if (error) throw error;
      const freshProfile = await fetchUserProfile(state.currentUser.id);
      if (freshProfile) updateState({ currentUser: freshProfile });
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

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

  const handleFollow = async (targetId: string) => {
    if (!state.currentUser) { updateState({ view: 'auth' }); return; }
    try {
      const isFollowing = state.currentUser.following.includes(targetId);
      const updatedFollowing = isFollowing 
        ? state.currentUser.following.filter(id => id !== targetId)
        : [...state.currentUser.following, targetId];
      
      await supabase.from('profiles').update({ following: updatedFollowing }).eq('id', state.currentUser.id);
      const { data: profiles } = await supabase.from('profiles').select('*');
      updateState({ allUsers: (profiles as User[]) || [] });
    } catch (err) { console.error("Follow error:", err); }
  };

  const NeuralXIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 5L5 19" stroke="url(#x_grad_home_v2)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M5 5L19 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
      <defs>
        <linearGradient id="x_grad_home_v2" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d2ff" /><stop offset="1" stopColor="#9d50bb" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (isCheckingAuth && !isAuthReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="h-12 w-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-500 font-black text-[10px] tracking-[0.5em] uppercase animate-pulse">CONNECTING_CORE</p>
        </div>
      </div>
    );
  }

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
          await supabase.auth.signOut();
          updateState({ currentUser: null, view: 'landing' }); 
        }}
        onOpenProfile={() => setShowProfile(true)}
        onSearch={(q) => updateState({ searchQuery: q, view: q ? 'search' : 'home' })}
        searchQuery={state.searchQuery}
      />
      
      <main className="flex-1 w-full relative z-10">
        {state.view === 'home' && (
          <div className="space-y-16 md:space-y-32 animate-in fade-in duration-1000 pb-16 md:pb-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 md:pt-12">
              <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[5rem] bg-[#020202] border border-white/5 p-8 md:p-32 shadow-[0_0_100px_rgba(0,0,0,1)] group min-h-[500px] md:min-h-[750px] flex items-center">
                <div className="absolute inset-0 studio-grid opacity-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] md:w-[900px] md:h-[900px] pointer-events-none hologram-pulse z-0">
                  <div className="w-full h-full rotate-x-slow flex items-center justify-center">
                    <NeuralXIcon className="w-full h-full drop-shadow-[0_0_40px_rgba(0,210,255,0.3)] md:drop-shadow-[0_0_80px_rgba(0,210,255,0.4)]" />
                  </div>
                </div>
                <div className="relative z-10 max-w-4xl space-y-8 md:space-y-12 text-center md:text-left mx-auto md:mx-0">
                   <div className="flex items-center justify-center md:justify-start gap-4 mb-2 md:mb-4 float-tech">
                      <div className="h-[2px] w-8 md:w-16 bg-cyan-500 shadow-[0_0_100px_rgba(0,210,255,0.4)]"></div>
                      <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[0.8em] text-cyan-500">NEURAL_SYNTHESIS</span>
                   </div>
                   <h2 className="text-5xl sm:text-8xl md:text-[13rem] font-black mb-6 md:mb-12 tracking-tighter leading-[0.85] md:leading-[0.75] uppercase">
                    GET VIRTUAL <br/>
                    <span className="tryonx-text-gradient animate-pulse">STYLE</span>
                   </h2>
                   <p className="text-gray-400 text-sm md:text-2xl font-medium max-w-xl mb-10 md:mb-16 leading-relaxed uppercase tracking-tight mx-auto md:mx-0">Biyometrik eşleşme teknolojisiyle tarzını dijital evrende yeniden inşa et.</p>
                   <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center md:justify-start">
                     <button onClick={() => updateState({ view: 'studio' })} className="w-full sm:w-auto bg-white text-black px-12 md:px-20 py-4 md:py-8 rounded-full text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:scale-105 transition-all">STÜDYOYU BAŞLAT</button>
                     <button onClick={() => updateState({ view: 'marketplace' })} className="w-full sm:w-auto px-10 md:px-14 py-4 md:py-7 rounded-full border border-white/10 text-[10px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.2em] backdrop-blur-xl hover:bg-white hover:text-black transition-all">MARKETİ GEZ</button>
                   </div>
                </div>
              </div>
            </div>

            {state.view === 'home' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 md:space-y-24">
                <div className="space-y-8 md:space-y-16">
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end border-b border-white/5 pb-8 md:pb-12 gap-4">
                     <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase leading-none">NEURAL ARENA</h3>
                     <button onClick={() => updateState({ view: 'arena' })} className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition group flex items-center gap-2">ARENAYI KEŞFET</button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    <div className="lg:col-span-8 group relative aspect-[16/9] md:aspect-[21/10] rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-white/10 cursor-pointer shadow-2xl" onClick={() => updateState({ view: 'arena' })}>
                      {state.challenges.length > 0 && (
                        <>
                          <img src={state.challenges[0]?.bannerImage} className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-6 md:p-12 flex flex-col justify-end">
                            <span className="bg-cyan-500 text-black px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest w-fit mb-3">{state.challenges[0]?.tag}</span>
                            <h4 className="text-2xl md:text-5xl font-black uppercase tracking-tight">{state.challenges[0]?.title}</h4>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="lg:col-span-4 bg-[#080808] border border-white/5 rounded-[2rem] md:rounded-[4rem] p-8 md:p-12 flex flex-col justify-between shadow-2xl">
                      <h5 className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 md:mb-10">MİMARLAR</h5>
                      <div className="space-y-6 md:space-y-8">
                          {state.allUsers.slice(0, 3).map((u, i) => (
                            <div key={u.id} onClick={() => updateState({ targetUser: u, view: 'user_profile' })} className="flex items-center gap-4 md:gap-6 group cursor-pointer">
                              <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-cyan-500 transition-colors">
                                 <img src={u.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                              </div>
                              <p className="text-sm md:text-lg font-black uppercase group-hover:text-cyan-400 transition-colors truncate">{u.name}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {state.view === 'search' && <UserSearchView query={state.searchQuery} users={state.allUsers} onViewProfile={(u) => updateState({ targetUser: u, view: 'user_profile' })} />}
        {state.view === 'user_profile' && state.targetUser && <UserProfileView user={state.targetUser} isFollowing={state.currentUser?.following.includes(state.targetUser.id) || false} onFollow={() => handleFollow(state.targetUser!.id)} onBack={() => updateState({ view: 'home' })} />}
        {state.view === 'studio' && <div className="max-w-7xl mx-auto px-4 py-8"><StudioView state={state} lang={lang} onStateUpdate={updateState} onExecute={handleTryOnExecute} onSave={() => {}} onShare={() => {}} loadingStep={0} setShowScanner={() => {}} /></div>}
        {state.view === 'marketplace' && <MarketplaceView lang={lang} products={marketFilter ? state.brandProducts.filter(p => p.brandId === marketFilter) : state.brandProducts} onBack={() => updateState({ view: 'home' })} onTryOn={(p) => updateState({ garmentImage: p.imageUrl, category: p.category, view: 'studio' })} onLike={() => {}} onComment={() => {}} onView={() => {}} onBuy={(l) => window.open(l, '_blank')} />}
        {state.view === 'arena' && <ArenaView lang={lang} challenges={state.challenges} posts={state.runwayPosts} architects={state.architects} products={state.brandProducts} onBack={() => updateState({ view: 'home' })} onVote={() => {}} onParticipate={() => {}} onComment={() => {}} onSave={() => {}} />}
        {state.view === 'auth' && <AuthView lang={lang} onSuccess={(user) => updateState({ currentUser: user, view: 'home' })} onCancel={() => updateState({ view: 'home' })} />}
        {state.view === 'brand' && <BrandDashboard lang={lang} products={state.brandProducts} challenges={state.challenges} runwayPosts={state.runwayPosts} onBack={() => updateState({ view: 'home' })} onAddProduct={() => {}} onDeleteProduct={() => {}} onAddChallenge={() => {}} onDeleteChallenge={() => {}} onUpdateBrand={() => {}} />}
      </main>

      {showProfile && state.currentUser && (
        <ProfileSidebar lang={lang} user={state.currentUser} onClose={() => setShowProfile(false)} onLogout={async () => { 
          await supabase.auth.signOut();
          updateState({ currentUser: null, view: 'landing' }); 
          setShowProfile(false); 
        }} onUpdateUser={handleUpdateProfile} />
      )}
      <LiveStylist resultImage={state.resultImage} lang={lang} />
    </div>
  );
};

export default App;
