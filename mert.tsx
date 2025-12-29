
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header.tsx';
import StudioView from './components/StudioView.tsx';
import AuthView from './components/AuthView.tsx';
import MarketplaceView from './components/MarketplaceView.tsx';
import BrandDashboard from './components/BrandDashboard.tsx';
import ArenaView from './components/ArenaView.tsx';
import LiveStylist from './components/LiveStylist.tsx';
import ProfileSidebar from './components/ProfileSidebar.tsx';
import LandingView from './components/LandingView.tsx';
import UserSearchView from './components/UserSearchView.tsx';
import UserProfileView from './components/UserProfileView.tsx';
import NeuralLogo from './components/NeuralLogo.tsx';
import { TryOnState, User, BrandProduct, StyleChallenge, RunwayPost, Comment, LookbookEntry } from './types.ts';
import { performTryOn } from './services/falService.ts';
import { getFashionAdvice } from './services/geminiService.ts';
import { Language } from './translations.ts';
import { supabase } from './lib/supabase.ts';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [synapticLoad, setSynapticLoad] = useState(24);

  const [state, setState] = useState<TryOnState>({
    view: 'landing', currentUser: null, targetUser: null,
    personImage: null, garmentImage: null, resultImage: null,
    category: 'tops', scenario: 'studio', isLoading: false,
    status: 'idle', error: null, lookbook: [], closet: [],
    brandProducts: [], challenges: [], runwayPosts: [], architects: [], 
    activeChallengeId: null, searchQuery: '', allUsers: [], measurements: null, preferences: null
  });

  const updateState = useCallback((updates: Partial<TryOnState>) => {
    setState(p => ({ ...p, ...updates }));
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const [p, c, pr, r] = await Promise.all([
        supabase.from('products').select('*').order('trendScore', { ascending: false }),
        supabase.from('challenges').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('runway_posts').select('*').order('trend_score', { ascending: false })
      ]);
      
      updateState({
        brandProducts: p.data || [],
        challenges: c.data || [],
        allUsers: pr.data || [],
        runwayPosts: r.data || []
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) updateState({ currentUser: profile });
      }
    } catch (err) {
      console.error("Data Fetch Error:", err);
    }
  }, [updateState]);

  useEffect(() => {
    fetchInitialData().then(() => setIsCheckingAuth(false));
    const interval = setInterval(() => {
      setSynapticLoad(Math.floor(Math.random() * 15) + 15);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchInitialData]);

  // Filtered posts for Arena: respect user visibility settings
  const filteredArenaPosts = useMemo(() => {
    return state.runwayPosts.filter(post => {
      const author = state.allUsers.find(u => u.id === post.userId);
      // Rules:
      // 1. If it's the current user's own post, show it.
      // 2. If the author's profile is 'public', show it.
      // 3. Otherwise, hide it from the global Arena.
      return post.userId === state.currentUser?.id || author?.visibility === 'public';
    });
  }, [state.runwayPosts, state.allUsers, state.currentUser]);

  const handleArenaVote = async (postId: string) => {
    if (!state.currentUser) return updateState({ view: 'auth' });
    const { error } = await supabase.rpc('increment_runway_like', { post_id: postId, user_id: state.currentUser.id });
    if (!error) fetchInitialData();
  };

  const handleArenaComment = async (postId: string, text: string) => {
    if (!state.currentUser) return updateState({ view: 'auth' });
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      userAvatar: state.currentUser.avatar_url,
      text,
      timestamp: Date.now()
    };
    const { error } = await supabase.rpc('add_runway_comment', { post_id: postId, new_comment: newComment });
    if (!error) fetchInitialData();
  };

  const handleManualUpload = async (base64Image: string) => {
    if (!state.currentUser) return;
    const entry: LookbookEntry = { id: Math.random().toString(36).substr(2, 9), resultImage: base64Image, date: Date.now(), isManual: true };
    const { error: profileError } = await supabase.from('profiles').update({ lookbook: [entry, ...(state.currentUser.lookbook || [])] }).eq('id', state.currentUser.id);
    
    // Only share to Arena if user is public
    if (!profileError && state.currentUser.visibility !== 'private') {
      const post: Partial<RunwayPost> = { 
        userId: state.currentUser.id, 
        userName: state.currentUser.name, 
        userAvatar: state.currentUser.avatar_url, 
        resultImage: base64Image, 
        category: 'LIFESTYLE', 
        vibe: 'AUTHENTIC', 
        is_manual: true, 
        trend_score: 0 
      };
      await supabase.from('runway_posts').insert([post]);
      fetchInitialData();
    }
  };

  const handleTryOnExecute = async () => {
    if (!state.personImage || !state.garmentImage) return;
    updateState({ isLoading: true, status: 'processing', error: null });
    try {
      const resultUrl = await performTryOn(state.personImage, state.garmentImage, state.category);
      if (state.currentUser) {
        const advice = await getFashionAdvice(state.personImage, state.garmentImage, lang);
        const entry: LookbookEntry = { id: Math.random().toString(36).substr(2, 9), personImage: state.personImage, garmentImage: state.garmentImage, resultImage: resultUrl, date: Date.now(), advice };
        
        // Update Lookbook
        await supabase.from('profiles').update({ lookbook: [entry, ...(state.currentUser.lookbook || [])] }).eq('id', state.currentUser.id);
        
        // Share to Arena only if user is not private
        if (state.currentUser.visibility !== 'private') {
          const post: Partial<RunwayPost> = { 
            userId: state.currentUser.id, 
            userName: state.currentUser.name, 
            userAvatar: state.currentUser.avatar_url, 
            resultImage: resultUrl, 
            garmentImage: state.garmentImage, 
            category: state.category.toUpperCase(), 
            vibe: (advice.vibe || 'CHIC').toUpperCase(), 
            is_manual: false, 
            trend_score: 50 
          };
          await supabase.from('runway_posts').insert([post]);
        }
      }
      updateState({ resultImage: resultUrl, isLoading: false, status: 'completed' });
      fetchInitialData();
    } catch (err: any) {
      updateState({ isLoading: false, status: 'error', error: err.message });
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Header 
        lang={lang} setLang={setLang} currentUser={state.currentUser}
        onViewStudio={() => updateState({ view: 'studio', resultImage: null })}
        onViewHome={() => updateState({ view: 'home' })}
        onViewMarketplace={() => updateState({ view: 'marketplace' })}
        onViewArena={() => updateState({ view: 'arena' })}
        onViewAdmin={() => updateState({ view: 'brand' })}
        onViewAuth={() => updateState({ view: 'auth' })}
        onLogout={async () => { await supabase.auth.signOut(); updateState({ currentUser: null, view: 'landing' }); }}
        onOpenProfile={() => updateState({ view: 'user_profile', targetUser: state.currentUser })}
        onSearch={(q) => updateState({ searchQuery: q, view: q ? 'search' : 'home' })}
        searchQuery={state.searchQuery}
        onViewTech={() => {}}
      />
      
      <main>
        {state.view === 'landing' && <LandingView lang={lang} setLang={setLang} onEnter={() => updateState({ view: 'home' })} />}
        {state.view === 'home' && (
          <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
              <div className="lg:col-span-7 space-y-10 relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md">
                   <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">NEURAL_SYNTHESIS_ONLINE</span>
                </div>
                <h1 className="text-7xl sm:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase flex flex-wrap items-center gap-x-8">
                  <span>Tryon</span>
                  <NeuralLogo className="w-24 h-24 sm:w-32 sm:h-32" />
                </h1>
                <p className="text-gray-500 text-xl font-medium max-w-xl leading-relaxed uppercase tracking-tighter">
                  Geleceğin deneme kabini. Biyometrik eşleşme ve nöral kumaş simülasyonu ile <span className="text-white">mükemmel tarzı</span> milisaniyeler içinde keşfedin.
                </p>
                <div className="flex flex-wrap gap-6 pt-6">
                  <button onClick={() => updateState({ view: 'studio' })} className="px-16 py-6 tryonx-gradient rounded-full font-black uppercase tracking-widest hover:scale-105 transition shadow-[0_0_50px_rgba(0,210,255,0.3)] relative group overflow-hidden"><span className="relative z-10">SİSTEMİ BAŞLAT</span><div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div></button>
                  <button onClick={() => updateState({ view: 'marketplace' })} className="px-12 py-6 border border-white/10 rounded-full font-black uppercase tracking-widest hover:bg-white/5 transition backdrop-blur-xl">MARKETİ GEZ</button>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="glass-panel rounded-[3.5rem] p-10 space-y-8 relative z-10">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">NEURAL_CORE_STATUS</h3><div className="h-2 w-2 rounded-full bg-green-500"></div></div>
                  <div className="space-y-6">
                     <div className="space-y-2"><div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-gray-500">SYNAPTIC_LOAD</span><span className="text-cyan-400">{synapticLoad}%</span></div><div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${synapticLoad}%` }}></div></div></div>
                     <div className="grid grid-cols-2 gap-4"><div className="p-6 bg-white/5 rounded-[2rem] border border-white/5"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">ACTIVE_NODES</p><p className="text-2xl font-black">1,024</p></div><div className="p-6 bg-white/5 rounded-[2rem] border border-white/5"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">LATENCY</p><p className="text-2xl font-black text-purple-400">12ms</p></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {state.view === 'studio' && <StudioView state={state} lang={lang} onStateUpdate={updateState} onExecute={handleTryOnExecute} onSave={() => {}} onShare={() => {}} loadingStep={0} setShowScanner={() => {}} />}
        {state.view === 'auth' && <AuthView lang={lang} onSuccess={(u) => updateState({ currentUser: u, view: 'home' })} onCancel={() => updateState({ view: 'home' })} />}
        {state.view === 'marketplace' && <MarketplaceView lang={lang} products={state.brandProducts} onBack={() => updateState({ view: 'home' })} onTryOn={(p) => { updateState({ garmentImage: p.imageUrl, category: p.category, view: 'studio' }); }} onLike={async (id) => { await supabase.rpc('increment_product_like', { pid: id }); fetchInitialData(); }} onComment={async (id, text) => { const nc = { id: Math.random().toString(36).substr(2,9), userId: state.currentUser?.id, userName: state.currentUser?.name, userAvatar: state.currentUser?.avatar_url, text, timestamp: Date.now() }; await supabase.rpc('add_product_comment', { pid: id, new_comment: nc }); fetchInitialData(); }} onView={async (id) => { await supabase.rpc('increment_product_view', { pid: id }); fetchInitialData(); }} onBuy={(link) => window.open(link, '_blank')} />}
        {state.view === 'arena' && (
          <ArenaView lang={lang} challenges={state.challenges} posts={filteredArenaPosts} architects={state.architects} products={state.brandProducts} onBack={() => updateState({ view: 'home' })} onVote={handleArenaVote} onParticipate={() => {}} onComment={handleArenaComment} onSave={(post) => { if (state.currentUser) { const updatedSaved = [...(state.currentUser.saved_posts || []), post.id]; supabase.from('profiles').update({ saved_posts: updatedSaved }).eq('id', state.currentUser.id).then(() => fetchInitialData()); } }} currentUser={state.currentUser} />
        )}
        {state.view === 'brand' && <BrandDashboard lang={lang} products={state.brandProducts} challenges={state.challenges} runwayPosts={state.runwayPosts} onAddProduct={async (p) => { await supabase.from('products').insert([p]); fetchInitialData(); }} onDeleteProduct={async (id) => { await supabase.from('products').delete().eq('id', id); fetchInitialData(); }} onAddChallenge={async (c) => { await supabase.from('challenges').insert([c]); fetchInitialData(); }} onDeleteChallenge={async (id) => { await supabase.from('challenges').delete().eq('id', id); fetchInitialData(); }} onUpdateBrand={async (id, up) => { await supabase.from('profiles').update(up).eq('id', id); fetchInitialData(); }} onBack={() => updateState({ view: 'home' })} />}
        {state.view === 'search' && <UserSearchView query={state.searchQuery} users={state.allUsers} architects={state.architects} onViewProfile={(u) => updateState({ view: 'user_profile', targetUser: u })} />}
        {state.view === 'user_profile' && state.targetUser && <UserProfileView user={state.targetUser} rank={1} isMe={state.currentUser?.id === state.targetUser.id} lookbook={state.targetUser.lookbook || []} isFollowing={state.currentUser?.following?.includes(state.targetUser.id) || false} onFollow={async () => { if (state.currentUser && state.targetUser) { const newFollowing = [...(state.currentUser.following || []), state.targetUser.id]; const newFollowers = [...(state.targetUser.followers || []), state.currentUser.id]; await Promise.all([supabase.from('profiles').update({ following: newFollowing }).eq('id', state.currentUser.id), supabase.from('profiles').update({ followers: newFollowers }).eq('id', state.targetUser.id)]); fetchInitialData(); } }} onEdit={() => setShowProfileSettings(true)} onLogout={() => supabase.auth.signOut()} onBack={() => updateState({ view: 'home' })} onManualUpload={handleManualUpload} />}
      </main>

      {showProfileSettings && state.currentUser && <ProfileSidebar lang={lang} user={state.currentUser} onClose={() => setShowProfileSettings(false)} onLogout={() => supabase.auth.signOut()} onUpdateUser={async (u) => { await supabase.from('profiles').update(u).eq('id', state.currentUser!.id); fetchInitialData(); }} />}
      <LiveStylist resultImage={state.resultImage} lang={lang} />
    </div>
  );
};

export default App;
