
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
  const hasPanelAccess = currentUser?.role === 'admin' || currentUser?.role === 'brand';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="MİMAR ARA" 
              className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none w-24 focus:w-40 transition-all text-white placeholder-gray-700" 
            />
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
            <button onClick={() => setLang('tr')} className={`px-2 py-1 text-[8px] sm:text-[9px] font-black rounded-full transition ${lang === 'tr' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>TR</button>
            <button onClick={() => setLang('en')} className={`px-2 py-1 text-[8px] sm:text-[9px] font-black rounded-full transition ${lang === 'en' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>EN</button>
          </div>
          
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button onClick={onLogout} className="hidden sm:block text-[9px] font-black text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest">ÇIKIŞ</button>
              <div onClick={onOpenProfile} className="relative h-10 w-10 rounded-full border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center cursor-pointer hover:border-cyan-500/50 transition shadow-lg shadow-cyan-500/10">
                {currentUser.avatar_url ? <img src={currentUser.avatar_url} className="h-full w-full object-cover" /> : <span className="text-[12px] font-black text-white">{currentUser.name.charAt(0)}</span>}
              </div>
            </div>
          ) : (
            <button onClick={onViewAuth} className="rounded-full tryonx-gradient px-6 py-3 text-[10px] font-black text-white uppercase tracking-widest hover:brightness-110 active:scale-95 transition">
              {t.login}
            </button>
          )}

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden h-10 w-10 flex flex-col items-center justify-center gap-1.5 p-2 bg-white/5 rounded-full border border-white/10">
            <span className={`h-0.5 bg-white transition-all w-5 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 bg-white transition-all w-5 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-white transition-all w-5 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 p-8 animate-in slide-in-from-top duration-300 flex flex-col gap-6">
           <button onClick={() => { onViewStudio(); setIsMobileMenuOpen(false); }} className="text-sm font-black text-white text-left uppercase tracking-[0.2em]">{t.studio}</button>
           <button onClick={() => { onViewMarketplace(); setIsMobileMenuOpen(false); }} className="text-sm font-black text-white text-left uppercase tracking-[0.2em]">{t.showcase}</button>
           <button onClick={() => { onViewArena(); setIsMobileMenuOpen(false); }} className="text-sm font-black text-white text-left uppercase tracking-[0.2em]">{t.network}</button>
           {currentUser && <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="text-sm font-black text-red-500 text-left uppercase tracking-[0.2em]">SİSTEMDEN AYRIL</button>}
        </div>
      )}
    </header>
  );
};

export default Header;
