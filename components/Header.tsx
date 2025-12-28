
import React, { useState } from 'react';
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
  const rawRole = currentUser?.role?.toLowerCase() || 'user';
  const hasPanelAccess = rawRole === 'admin' || rawRole === 'brand';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItems = () => (
    <>
      <button onClick={() => { onViewStudio(); setIsMobileMenuOpen(false); }} className="text-[10px] md:text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase py-3 md:py-2 border-b border-white/5 md:border-none w-full md:w-auto text-left md:text-center">{t.studio}</button>
      <button onClick={() => { onViewMarketplace(); setIsMobileMenuOpen(false); }} className="text-[10px] md:text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase py-3 md:py-2 border-b border-white/5 md:border-none w-full md:w-auto text-left md:text-center">{t.showcase}</button>
      <button onClick={() => { onViewArena(); setIsMobileMenuOpen(false); }} className="text-[10px] md:text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase py-3 md:py-2 border-b border-white/5 md:border-none w-full md:w-auto text-left md:text-center">{t.network}</button>
      {hasPanelAccess && (
        <button onClick={() => { onViewAdmin(); setIsMobileMenuOpen(false); }} className="text-[10px] md:text-xs font-black text-cyan-400 hover:text-white transition tracking-widest uppercase py-3 md:py-2 border-b border-white/5 md:border-none w-full md:w-auto text-left md:text-center">PANEL</button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div onClick={onViewHome} className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0 z-[110]">
          <div className="relative h-8 w-8 md:h-11 md:w-11 rounded-lg md:rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10 overflow-hidden transition-all group-hover:border-white/30">
            <svg className="h-5 w-5 md:h-6 md:w-6 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M19 5L5 19" stroke="url(#logo_grad_header_v2)" strokeWidth="3" strokeLinecap="round" />
              <path d="M5 5L19 19" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="logo_grad_header_v2" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d2ff" /><stop offset="1" stopColor="#9d50bb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-black tracking-tighter text-white uppercase leading-none">TryonX</h1>
            <p className="text-[6px] md:text-[7px] font-bold text-gray-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">NEURAL CORE</p>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8">
          <NavItems />
        </nav>

        <div className="flex items-center gap-2 md:gap-4 shrink-0 z-[110]">
          <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-2 group focus-within:border-cyan-500/50 transition-all">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="ARA" 
              className="bg-transparent text-[9px] font-black uppercase tracking-widest outline-none w-16 focus:w-32 transition-all text-white placeholder-gray-700" 
            />
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-0.5">
            <button onClick={() => setLang('tr')} className={`px-2 py-1 text-[8px] md:text-[9px] font-black rounded-full transition ${lang === 'tr' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>TR</button>
            <button onClick={() => setLang('en')} className={`px-2 py-1 text-[8px] md:text-[9px] font-black rounded-full transition ${lang === 'en' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>EN</button>
          </div>
          
          {currentUser ? (
            <div onClick={onOpenProfile} className="relative h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/10 overflow-hidden bg-black flex items-center justify-center cursor-pointer hover:border-cyan-500/50 transition">
              {currentUser.avatar_url ? <img src={currentUser.avatar_url} className="h-full w-full object-cover" /> : <span className="text-[10px] md:text-[12px] font-black text-white">{currentUser.name.charAt(0)}</span>}
            </div>
          ) : (
            <button onClick={onViewAuth} className="rounded-full tryonx-gradient px-4 md:px-6 py-2 md:py-3 text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest hover:brightness-110 active:scale-95 transition">
              {t.login}
            </button>
          )}

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden h-8 w-8 flex flex-col items-center justify-center gap-1.5">
            <span className={`h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
            <span className={`h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : 'w-5'}`} />
            <span className={`h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-3 self-end'}`} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 p-6 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            <NavItems />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
