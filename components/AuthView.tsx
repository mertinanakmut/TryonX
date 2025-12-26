
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
    setIsProcessing(true);
    setError(null);

    try {
      if (mode === 'register') {
        // Supabase Signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create database profile
          const newUser = {
            id: authData.user.id,
            email,
            name: name || email.split('@')[0],
            role: 'user',
            visibility: 'public',
            followers: [],
            following: []
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .insert([newUser]);

          if (profileError) throw profileError;
          onSuccess(newUser as unknown as User);
        }
      } else {
        // Supabase Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Fetch profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileError) throw profileError;
          onSuccess(profile as User);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 rounded-3xl tryonx-gradient p-1 flex items-center justify-center">
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
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-black uppercase text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input 
              type="text" placeholder={t.nameLabel} required 
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500 transition-all" 
            />
          )}
          <input 
            type="email" placeholder={t.emailLabel} required 
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500 transition-all" 
          />
          <input 
            type="password" placeholder={t.passLabel} required 
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500 transition-all" 
          />
          
          <button 
            type="submit" disabled={isProcessing}
            className="w-full py-5 tryonx-gradient rounded-2xl font-black uppercase tracking-widest text-white disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            {isProcessing ? t.processing : (mode === 'login' ? t.loginBtn : t.registerBtn)}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="w-full text-[10px] text-gray-500 uppercase font-black hover:text-white transition-colors"
          >
            {mode === 'login' ? t.noAccount : t.hasAccount}
          </button>
          <button onClick={onCancel} className="w-full text-[9px] text-gray-700 uppercase font-bold tracking-widest hover:text-gray-400">GERİ DÖN</button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
