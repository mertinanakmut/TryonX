
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthViewProps {
  lang: Language;
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

type AuthMode = 'login' | 'register';

const AuthView: React.FC<AuthViewProps> = ({ lang, onSuccess, onCancel }) => {
  const t = translations[lang].auth;
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (mode === 'register') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: name.trim() }
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Kayıt işlemi başlatılamadı.");

        const newUserProfile = {
          id: authData.user.id,
          email: cleanEmail,
          name: name.trim() || cleanEmail.split('@')[0],
          role: 'user' as const,
          visibility: 'public' as const,
          followers: [],
          following: []
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([newUserProfile]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
        
        onSuccess(newUserProfile as User);
      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (authError) {
          // Özel hata yönetimi
          if (authError.message.includes("Invalid login credentials")) {
             throw new Error(lang === 'tr' ? "E-posta veya şifre hatalı." : "Invalid email or password.");
          }
          throw authError;
        }
        
        if (!authData.user) throw new Error("Giriş yapılamadı.");

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          const recoveryProfile = {
            id: authData.user.id,
            email: authData.user.email!,
            name: authData.user.user_metadata?.full_name || authData.user.email!.split('@')[0],
            role: 'user' as const,
            visibility: 'public' as const,
            followers: [],
            following: []
          };
          await supabase.from('profiles').upsert([recoveryProfile]);
          onSuccess(recoveryProfile as User);
        } else {
          onSuccess(profile as User);
        }
      }
    } catch (err: any) {
      console.error("Auth process failed:", err);
      setError(err.message || (lang === 'tr' ? "Bir hata oluştu." : "An error occurred."));
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 rounded-3xl tryonx-gradient p-1 flex items-center justify-center shadow-2xl">
           <div className="h-full w-full bg-black rounded-[1.4rem] flex items-center justify-center">
              <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M19 5L5 19" stroke="cyan" strokeWidth="3" strokeLinecap="round" />
                <path d="M5 5L19 19" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
           </div>
        </div>

        <h2 className="text-3xl font-black text-center uppercase tracking-tighter mb-8 mt-6">
          {mode === 'login' ? t.loginTitle : t.registerTitle}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-black uppercase text-center animate-in slide-in-from-top-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input 
              type="text" 
              placeholder={t.nameLabel} 
              required 
              autoComplete="name"
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500 transition-all" 
              disabled={isProcessing}
            />
          )}
          <input 
            type="email" 
            placeholder={t.emailLabel} 
            required 
            autoComplete="email"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500 transition-all" 
            disabled={isProcessing}
          />
          <input 
            type="password" 
            placeholder={t.passLabel} 
            required 
            autoComplete={mode === 'login' ? "current-password" : "new-password"}
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500 transition-all" 
            disabled={isProcessing}
          />
          
          <button 
            type="submit" disabled={isProcessing}
            className="w-full py-5 tryonx-gradient rounded-2xl font-black uppercase tracking-widest text-white disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            {isProcessing ? (lang === 'tr' ? "İŞLENİYOR..." : "PROCESSING...") : (mode === 'login' ? t.loginBtn : t.registerBtn)}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-center">
          <button 
            type="button"
            disabled={isProcessing}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
            className="w-full text-[10px] text-gray-500 uppercase font-black hover:text-white transition-colors"
          >
            {mode === 'login' ? t.noAccount : t.hasAccount}
          </button>
          <button type="button" onClick={onCancel} className="w-full text-[9px] text-gray-700 uppercase font-bold tracking-widest hover:text-gray-400">GERİ DÖN</button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
