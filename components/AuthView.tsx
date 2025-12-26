
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { User } from '../types';

interface AuthViewProps {
  lang: Language;
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

const AuthView: React.FC<AuthViewProps> = ({ lang, onSuccess, onCancel }) => {
  const t = translations[lang].auth;
  const [mode, setMode] = useState<AuthMode>('login');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const ADMIN_EMAIL = 'mert.akmut44@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate neural authentication delay
    setTimeout(() => {
      setIsProcessing(false);
      if (mode !== 'forgot') {
        // Fix: Added missing 'visibility' property to satisfy User interface requirements
        const user: User = {
          email: email.toLowerCase(),
          name: name || (email.split('@')[0]),
          role: email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user',
          visibility: 'private'
        };
        onSuccess(user);
      } else {
        setMode('login');
      }
    }, 2000);
  };

  const NeuralXIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 5L5 19" stroke="url(#auth_grad)" strokeWidth="3" strokeLinecap="round" />
      <path d="M5 5L19 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
      <defs>
        <linearGradient id="auth_grad" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d2ff" />
          <stop offset="1" stopColor="#9d50bb" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 studio-grid opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <div className="relative w-full max-w-md">
        <button 
          onClick={onCancel}
          className="absolute -top-16 right-0 p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition group"
        >
          <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-[#050505] border border-white/10 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden relative group">
          <div className="absolute inset-0 scanner-line opacity-20 pointer-events-none"></div>

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 mb-6">
                 <NeuralXIcon className="w-full h-full float" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white text-center leading-tight">
                {mode === 'login' ? t.loginTitle : mode === 'register' ? t.registerTitle : t.forgotTitle}
              </h2>
              <p className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.4em] mt-1">CORE_LINK_v2.5</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.nameLabel}</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all" 
                    placeholder="E.g. Mert Akmut"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.emailLabel}</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all" 
                  placeholder="mert.akmut44@gmail.com"
                />
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t.passLabel}</label>
                    {mode === 'login' && (
                      <button 
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[9px] font-black text-cyan-500 uppercase tracking-widest hover:underline"
                      >
                        {t.forgotLink}
                      </button>
                    )}
                  </div>
                  <input 
                    type="password" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all" 
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                disabled={isProcessing}
                className="group relative w-full overflow-hidden rounded-2xl p-[2px] transition-all active:scale-[0.97] disabled:opacity-50 mt-4"
              >
                <div className="absolute inset-0 tryonx-gradient animate-pulse"></div>
                <div className="relative bg-black rounded-2xl py-5 transition-all group-hover:bg-transparent flex items-center justify-center gap-3">
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{t.processing}</span>
                    </>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                      {mode === 'login' ? t.loginBtn : mode === 'register' ? t.registerBtn : t.forgotBtn}
                    </span>
                  )}
                </div>
              </button>
            </form>

            <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                {mode === 'login' ? t.noAccount : mode === 'register' ? t.hasAccount : ''}
                {' '}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-white hover:text-cyan-400 transition ml-2"
                >
                  {mode === 'login' ? t.registerTitle : mode === 'forgot' ? t.backToLogin : t.loginTitle}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
