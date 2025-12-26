
import React from 'react';
import { translations, Language } from '../translations';
import { User } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  currentUser: User | null;
  onViewTech: () => void;
  onViewStudio: () => void;
  onViewHome: () => void;
  onViewAuth: () => void;
  onViewMarketplace: () => void;
  onViewArena: () => void;
  onViewAdmin: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ 
  lang, setLang, currentUser, onViewStudio, onViewHome, onViewAuth, onViewMarketplace, onViewArena, onViewAdmin, onOpenProfile, onLogout, onViewTech,
  onSearch, searchQuery
}) => {
  const t = translations[lang].header;
  const hasPanelAccess = currentUser?.role === 'admin' || currentUser?.role === 'brand';

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div onClick={onViewHome} className="flex items-center gap-3 cursor-pointer group shrink-0 z-[110]">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10 overflow-hidden transition-all group-hover:border-white/30">
            <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M19 5L5 19" stroke="url(#logo_grad_main)" strokeWidth="3" strokeLinecap="round" />
              <path d="M5 5L19 19" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="logo_grad_main" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d2ff" /><stop offset="1" stopColor="#9d50bb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="hidden xs:block">
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase leading-none">TryonX</h1>
            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.4em]">NEURAL CORE</p>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 z-[110]">
          <button onClick={onViewStudio} className="text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase py-2">{t.studio}</button>
          <button onClick={onViewMarketplace} className="text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase py-2">{t.showcase}</button>
          <button onClick={onViewArena} className="text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase py-2">{t.network}</button>
          {hasPanelAccess && (
            <button onClick={onViewAdmin} className="text-xs font-black text-cyan-400 hover:text-white transition tracking-widest uppercase py-2">PANEL</button>
          )}
        </nav>

        <div className="flex items-center gap-4 shrink-0 z-[110]">
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-2 gap-3 group focus-within:border-cyan-500/50 transition-all">
            <svg className="w-3.5 h-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="MİMAR ARA" 
              className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none w-28 focus:w-48 transition-all text-white placeholder-gray-700" 
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1">
            <button onClick={() => setLang('tr')} className={`px-2 py-1 text-[9px] font-black rounded-full transition ${lang === 'tr' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>TR</button>
            <button onClick={() => setLang('en')} className={`px-2 py-1 text-[9px] font-black rounded-full transition ${lang === 'en' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>EN</button>
          </div>
          
          {currentUser ? (
            <div onClick={onOpenProfile} className="relative h-10 w-10 rounded-full border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center cursor-pointer hover:border-cyan-500/50 transition">
              {/* Corrected avatar to avatar_url to match User interface */}
              {currentUser.avatar_url ? <img src={currentUser.avatar_url} className="h-full w-full object-cover" /> : <span className="text-[12px] font-black text-white">{currentUser.name.charAt(0)}</span>}
            </div>
          ) : (
            <button onClick={onViewAuth} className="rounded-full tryonx-gradient px-6 py-3 text-[10px] font-black text-white uppercase tracking-widest hover:brightness-110 active:scale-95 transition">
              {t.login}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
