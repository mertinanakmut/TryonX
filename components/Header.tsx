
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
}

const Header: React.FC<HeaderProps> = ({ 
  lang, setLang, currentUser, onViewTech, onViewStudio, onViewHome, onViewAuth, onViewMarketplace, onViewArena, onViewAdmin, onLogout, onOpenProfile 
}) => {
  const t = translations[lang].header;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div 
          onClick={onViewHome}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10 overflow-hidden transition-all group-hover:border-white/30">
            <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M19 5L5 19" stroke="url(#logo_grad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M5 5L19 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.9" />
              <defs>
                <linearGradient id="logo_grad" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d2ff" /><stop offset="1" stopColor="#9d50bb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="hidden xs:block">
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase leading-none">TryonX</h1>
            <p className="text-[7px] sm:text-[8px] font-bold text-gray-500 uppercase tracking-[0.4em]">NEURAL CORE</p>
          </div>
        </div>
        
        {/* Nav - Scrollable on mobile */}
        <nav className="flex items-center overflow-x-auto no-scrollbar mx-4 gap-6 sm:gap-10 mask-fade-edges lg:mask-none">
          <button onClick={onViewStudio} className="text-[10px] sm:text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase whitespace-nowrap">{t.studio}</button>
          <button onClick={onViewMarketplace} className="text-[10px] sm:text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase whitespace-nowrap">{t.showcase}</button>
          <button onClick={onViewArena} className="text-[10px] sm:text-xs font-black text-gray-400 hover:text-white transition tracking-widest uppercase whitespace-nowrap">{t.network}</button>
          {isAdmin && (
            <button onClick={onViewAdmin} className="text-[10px] sm:text-xs font-black text-cyan-400 hover:text-white transition tracking-widest uppercase whitespace-nowrap">PANEL</button>
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1">
            <button onClick={() => setLang('tr')} className={`px-2 py-1 text-[9px] font-black rounded-full transition ${lang === 'tr' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>TR</button>
            <button onClick={() => setLang('en')} className={`px-2 py-1 text-[9px] font-black rounded-full transition ${lang === 'en' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>EN</button>
          </div>
          
          {currentUser ? (
            <div onClick={onOpenProfile} className="relative h-10 w-10 rounded-full border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center group cursor-pointer hover:border-cyan-500/50 transition">
              {currentUser.avatar ? <img src={currentUser.avatar} className="h-full w-full object-cover" /> : <span className="text-[12px] font-black text-white">{currentUser.name.charAt(0)}</span>}
            </div>
          ) : (
            <button onClick={onViewAuth} className="rounded-full tryonx-gradient px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest hover:brightness-110 active:scale-95 transition">
              {t.login}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
