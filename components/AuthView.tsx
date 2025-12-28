
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

    try {
      if (mode === 'register') {
        // 1. Auth Signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Kullanıcı oluşturulamadı.");

        // 2. Database Profile Creation
        const newUserProfile = {
          id: authData.user.id,
          email: email.toLowerCase(),
          name: name || email.split('@')[0],
          role: 'user',
          visibility: 'public',
          followers: [], // Empty array for Postgres text[]
          following: []
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([newUserProfile]);

        if (profileError) {
          console.error("Profil oluşturma hatası:", profileError);
          // Profil oluşturma başarısız olsa bile kullanıcı auth olmuş olabilir
          onSuccess(newUserProfile as unknown as User);
        } else {
          onSuccess(newUserProfile as unknown as User);
        }
      } else {
        // 1. Auth Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Giriş başarısız.");

        // 2. Fetch Existing Profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          // Profil yoksa (manuel silinmiş olabilir), yeni bir tane oluşturmayı dene
          console.warn("Profil bulunamadı, yeniden oluşturuluyor...");
          const recoveryProfile = {
            id: authData.user.id,
            email: email.toLowerCase(),
            name: email.split('@')[0],
            role: 'user',
            visibility: 'public',
            followers: [],
            following: []
          };
          await supabase.from('profiles').insert([recoveryProfile]);
          onSuccess(recoveryProfile as unknown as User);
        } else {
          onSuccess(profile as User);
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "Bilinmeyen bir hata oluştu.");
      setIsProcessing(false); // Sadece hata durumunda burada kapatıyoruz, başarıda zaten view değişecek
    } finally {
      // Başarılı durumda view 'home'a geçtiği için unmount olabilir, bu yüzden kontrollü reset
      // setIsProcessing(false); // Artık catch bloğunda veya onSuccess sonrası yönetiliyor
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
              disabled={isProcessing}
            />
          )}
          <input 
            type="email" placeholder={t.emailLabel} required 
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500 transition-all" 
            disabled={isProcessing}
          />
          <input 
            type="password" placeholder={t.passLabel} required 
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500 transition-all" 
            disabled={isProcessing}
          />
          
          <button 
            type="submit" disabled={isProcessing}
            className="w-full py-5 tryonx-gradient rounded-2xl font-black uppercase tracking-widest text-white disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            {isProcessing ? t.processing : (mode === 'login' ? t.loginBtn : t.registerBtn)}
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
