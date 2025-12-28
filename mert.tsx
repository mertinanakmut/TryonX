
import React, { useState, useEffect, useCallback } from 'react';
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
import { TryOnState, User, BrandProduct, StyleChallenge, RunwayPost } from './types';
import { performTryOn } from './services/falService';
import { getFashionAdvice } from './services/geminiService';
import { Language } from './translations';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
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

  const updateState = useCallback((updates: Partial<TryOnState>) => {
    setState(p => ({ ...p, ...updates }));
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) return null;
    return data as User;
  };

  const fetchInitialData = useCallback(async () => {
    const [p, c, pr, r] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('challenges').select('*'),
      supabase.from('profiles').select('*'),
      supabase.from('runway_posts').select('*')
    ]);
    updateState({
      brandProducts: p.data || [],
      challenges: c.data || [],
      allUsers: pr.data || [],
      runwayPosts: r.data || []
    });
  }, [updateState]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) updateState({ currentUser: profile, view: 'home' });
      }
      await fetchInitialData();
      setIsCheckingAuth(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setState(prev => ({ ...prev, currentUser: profile, view: 'home' }));
        }
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({ ...prev, currentUser: null, view: 'landing' }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchInitialData, updateState]);

  const handleTryOnExecute = async () => {
    if (!state.personImage || !state.garmentImage) return;
    updateState({ isLoading: true, status: 'processing', error: null });
    try {
      const resultUrl = await performTryOn(state.personImage, state.garmentImage, state.category);
      updateState({ resultImage: resultUrl, isLoading: false, status: 'completed' });
    } catch (err: any) {
      updateState({ isLoading: false, status: 'error', error: err.message });
    }
  };

  // Veritabanı Yönetim Fonksiyonları
  const addProduct = async (prod: Partial<BrandProduct>) => {
    const { error } = await supabase.from('products').insert([prod]);
    if (!error) fetchInitialData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchInitialData();
  };

  const addChallenge = async (ch: Partial<StyleChallenge>) => {
    const { error } = await supabase.from('challenges').insert([ch]);
    if (!error) fetchInitialData();
  };

  const deleteChallenge = async (id: string) => {
    const { error } = await supabase.from('challenges').delete().eq('id', id);
    if (!error) fetchInitialData();
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
      {state.view !== 'landing' && (
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
      )}
      
      <main>
        {state.view === 'landing' && <LandingView lang={lang} setLang={setLang} onEnter={() => updateState({ view: 'home' })} />}
        {state.view === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
            <h1 className="text-8xl font-black mb-4">Tryon<span className="tryonx-text-gradient">X</span></h1>
            <p className="text-gray-500 uppercase tracking-[0.4em] mb-12">Nöral Sentez Stüdyosu</p>
            <button onClick={() => updateState({ view: 'studio' })} className="px-16 py-6 tryonx-gradient rounded-full font-black uppercase tracking-widest hover:scale-105 transition shadow-2xl">BAŞLAT</button>
          </div>
        )}
        {state.view === 'studio' && <StudioView state={state} lang={lang} onStateUpdate={updateState} onExecute={handleTryOnExecute} onSave={() => {}} onShare={() => {}} loadingStep={0} setShowScanner={() => {}} />}
        {state.view === 'auth' && <AuthView lang={lang} onSuccess={(u) => updateState({ currentUser: u, view: 'home' })} onCancel={() => updateState({ view: 'home' })} />}
        {state.view === 'marketplace' && <MarketplaceView lang={lang} products={state.brandProducts} onBack={() => updateState({ view: 'home' })} onTryOn={(p) => updateState({ garmentImage: p.imageUrl, category: p.category, view: 'studio' })} onLike={() => {}} onComment={() => {}} onView={() => {}} onBuy={() => {}} />}
        {state.view === 'arena' && <ArenaView lang={lang} challenges={state.challenges} posts={state.runwayPosts} architects={state.architects} products={state.brandProducts} onBack={() => updateState({ view: 'home' })} onVote={() => {}} onParticipate={() => {}} onComment={() => {}} onSave={() => {}} currentUser={state.currentUser} />}
        {state.view === 'brand' && (
          <BrandDashboard 
            lang={lang} 
            products={state.brandProducts} 
            challenges={state.challenges} 
            runwayPosts={state.runwayPosts}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
            onAddChallenge={addChallenge}
            onDeleteChallenge={deleteChallenge}
            onUpdateBrand={async (id, up) => { await supabase.from('profiles').update(up).eq('id', id); fetchInitialData(); }}
            onBack={() => updateState({ view: 'home' })}
          />
        )}
        {state.view === 'search' && <UserSearchView query={state.searchQuery} users={state.allUsers} architects={state.architects} onViewProfile={(u) => updateState({ view: 'user_profile', targetUser: u })} />}
        {state.view === 'user_profile' && state.targetUser && <UserProfileView user={state.targetUser} rank={1} isMe={state.currentUser?.id === state.targetUser.id} isFollowing={false} onFollow={() => {}} onEdit={() => setShowProfileSettings(true)} onLogout={() => supabase.auth.signOut()} onBack={() => updateState({ view: 'home' })} />}
      </main>

      {showProfileSettings && state.currentUser && (
        <ProfileSidebar lang={lang} user={state.currentUser} onClose={() => setShowProfileSettings(false)} onLogout={() => supabase.auth.signOut()} onUpdateUser={async (u) => { await supabase.from('profiles').update(u).eq('id', state.currentUser!.id); fetchInitialData(); }} />
      )}
      <LiveStylist resultImage={state.resultImage} lang={lang} />
    </div>
  );
};

export default App;
