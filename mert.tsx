
import React, { useState, useEffect, useCallback } from 'react';
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
import { TryOnState, User, BrandProduct, StyleChallenge, RunwayPost, Comment, LookbookEntry } from './types.ts';
import { performTryOn } from './services/falService.ts';
import { getFashionAdvice } from './services/geminiService.ts';
import { Language } from './translations.ts';
import { supabase } from './lib/supabase.ts';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
    const [p, c, pr, r] = await Promise.all([
      supabase.from('products').select('*').order('trendScore', { ascending: false }),
      supabase.from('challenges').select('*'),
      supabase.from('profiles').select('*'),
      supabase.from('runway_posts').select('*').order('trend_score', { ascending: false }) // Trend sıralaması
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
  }, [updateState]);

  useEffect(() => {
    fetchInitialData().then(() => setIsCheckingAuth(false));
  }, [fetchInitialData]);

  const handleArenaVote = async (postId: string) => {
    if (!state.currentUser) return updateState({ view: 'auth' });
    const { error } = await supabase.rpc('increment_runway_like', { 
      post_id: postId, 
      user_id: state.currentUser.id 
    });
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
    const { error } = await supabase.rpc('add_runway_comment', { 
      post_id: postId, 
      new_comment: newComment 
    });
    if (!error) fetchInitialData();
  };

  const handleManualUpload = async (base64Image: string) => {
    if (!state.currentUser) return;
    
    const entry: LookbookEntry = {
      id: Math.random().toString(36).substr(2, 9),
      resultImage: base64Image,
      date: Date.now(),
      isManual: true
    };

    const updatedLookbook = [entry, ...(state.currentUser.lookbook || [])];
    
    // 1. Profil Lookbook güncelle
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ lookbook: updatedLookbook })
      .eq('id', state.currentUser.id);

    // 2. Arena'ya Manuel Post olarak ekle
    if (!profileError) {
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
        const entry: LookbookEntry = {
          id: Math.random().toString(36).substr(2, 9),
          personImage: state.personImage, garmentImage: state.garmentImage,
          resultImage: resultUrl, date: Date.now(), advice
        };
        
        await supabase.from('profiles')
          .update({ lookbook: [entry, ...(state.currentUser.lookbook || [])] })
          .eq('id', state.currentUser.id);
        
        // AI sonucunu otomatik Arena'da paylaş
        const post: Partial<RunwayPost> = {
          userId: state.currentUser.id,
          userName: state.currentUser.name,
          userAvatar: state.currentUser.avatar_url,
          resultImage: resultUrl,
          garmentImage: state.garmentImage,
          category: state.category.toUpperCase(),
          vibe: advice.vibe.toUpperCase(),
          is_manual: false,
          trend_score: 50 // AI Render başlangıç puanı
        };
        await supabase.from('runway_posts').insert([post]);
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
        onLogout={async () => await supabase.auth.signOut()}
        onOpenProfile={() => updateState({ view: 'user_profile', targetUser: state.currentUser })}
        onSearch={(q) => updateState({ searchQuery: q, view: q ? 'search' : 'home' })}
        searchQuery={state.searchQuery}
        onViewTech={() => {}}
      />
      
      <main>
        {state.view === 'landing' && <LandingView lang={lang} setLang={setLang} onEnter={() => updateState({ view: 'home' })} />}
        {state.view === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-in fade-in duration-1000">
            <h1 className="text-8xl font-black mb-4">Tryon<span className="tryonx-text-gradient">X</span></h1>
            <p className="text-gray-500 uppercase tracking-[0.4em] mb-12">Nöral Sentez & Stil Ağı</p>
            <button onClick={() => updateState({ view: 'studio' })} className="px-16 py-6 tryonx-gradient rounded-full font-black uppercase tracking-widest hover:scale-105 transition shadow-2xl">BAŞLAT</button>
          </div>
        )}
        {state.view === 'studio' && <StudioView state={state} lang={lang} onStateUpdate={updateState} onExecute={handleTryOnExecute} onSave={() => {}} onShare={() => {}} loadingStep={0} setShowScanner={() => {}} />}
        {state.view === 'auth' && <AuthView lang={lang} onSuccess={(u) => updateState({ currentUser: u, view: 'home' })} onCancel={() => updateState({ view: 'home' })} />}
        {state.view === 'marketplace' && (
          <MarketplaceView 
            lang={lang} products={state.brandProducts} 
            onBack={() => updateState({ view: 'home' })} 
            onTryOn={(p) => { updateState({ garmentImage: p.imageUrl, category: p.category, view: 'studio' }); }} 
            onLike={async (id) => { await supabase.rpc('increment_product_like', { pid: id }); fetchInitialData(); }} 
            onComment={async (id, text) => { 
                const nc = { id: Math.random().toString(36).substr(2,9), userId: state.currentUser?.id, userName: state.currentUser?.name, userAvatar: state.currentUser?.avatar_url, text, timestamp: Date.now() };
                await supabase.rpc('add_product_comment', { pid: id, new_comment: nc });
                fetchInitialData();
            }} 
            onView={async (id) => { await supabase.rpc('increment_product_view', { pid: id }); fetchInitialData(); }} 
            onBuy={(link) => window.open(link, '_blank')} 
          />
        )}
        {state.view === 'arena' && (
          <ArenaView 
            lang={lang} challenges={state.challenges} posts={state.runwayPosts} 
            architects={state.architects} products={state.brandProducts} 
            onBack={() => updateState({ view: 'home' })} 
            onVote={handleArenaVote} 
            onParticipate={() => {}} 
            onComment={handleArenaComment} 
            onSave={(post) => {
              if (state.currentUser) {
                const updatedSaved = [...(state.currentUser.saved_posts || []), post.id];
                supabase.from('profiles').update({ saved_posts: updatedSaved }).eq('id', state.currentUser.id).then(() => fetchInitialData());
              }
            }} 
            currentUser={state.currentUser} 
          />
        )}
        {state.view === 'brand' && (
          <BrandDashboard 
            lang={lang} products={state.brandProducts} challenges={state.challenges} runwayPosts={state.runwayPosts}
            onAddProduct={async (p) => { await supabase.from('products').insert([p]); fetchInitialData(); }}
            onDeleteProduct={async (id) => { await supabase.from('products').delete().eq('id', id); fetchInitialData(); }}
            onAddChallenge={async (c) => { await supabase.from('challenges').insert([c]); fetchInitialData(); }}
            onDeleteChallenge={async (id) => { await supabase.from('challenges').delete().eq('id', id); fetchInitialData(); }}
            onUpdateBrand={async (id, up) => { await supabase.from('profiles').update(up).eq('id', id); fetchInitialData(); }}
            onBack={() => updateState({ view: 'home' })}
          />
        )}
        {state.view === 'search' && <UserSearchView query={state.searchQuery} users={state.allUsers} architects={state.architects} onViewProfile={(u) => updateState({ view: 'user_profile', targetUser: u })} />}
        {state.view === 'user_profile' && state.targetUser && (
          <UserProfileView 
            user={state.targetUser} 
            rank={1} 
            isMe={state.currentUser?.id === state.targetUser.id} 
            lookbook={state.targetUser.lookbook || []}
            isFollowing={state.currentUser?.following?.includes(state.targetUser.id) || false}
            onFollow={async () => {
              if (state.currentUser && state.targetUser) {
                const newFollowing = [...(state.currentUser.following || []), state.targetUser.id];
                const newFollowers = [...(state.targetUser.followers || []), state.currentUser.id];
                await Promise.all([
                  supabase.from('profiles').update({ following: newFollowing }).eq('id', state.currentUser.id),
                  supabase.from('profiles').update({ followers: newFollowers }).eq('id', state.targetUser.id)
                ]);
                fetchInitialData();
              }
            }} 
            onEdit={() => setShowProfileSettings(true)} 
            onLogout={() => supabase.auth.signOut()} 
            onBack={() => updateState({ view: 'home' })}
            onManualUpload={handleManualUpload}
          />
        )}
      </main>

      {showProfileSettings && state.currentUser && (
        <ProfileSidebar lang={lang} user={state.currentUser} onClose={() => setShowProfileSettings(false)} onLogout={() => supabase.auth.signOut()} onUpdateUser={async (u) => { await supabase.from('profiles').update(u).eq('id', state.currentUser!.id); fetchInitialData(); }} />
      )}
      <LiveStylist resultImage={state.resultImage} lang={lang} />
    </div>
  );
};

export default App;
