
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthViewProps {
  lang: Language;
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ lang, onSuccess, onCancel }) => {
  const t = translations[lang].auth;
  const [mode, setMode] = useState<'login' | 'register'>('login');
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
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } }
        });
        if (authError) throw authError;
        if (data.user) {
          // Trigger zaten profili oluşturacak, biz sadece başarılı diyoruz.
          alert(lang === 'tr' ? "Kayıt başarılı! Giriş yapabilirsiniz." : "Registration successful! You can now log in.");
          setMode('login');
        }
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
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
    <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10">
        <h2 className="text-3xl font-black text-center uppercase mb-8">
          {mode === 'login' ? t.loginTitle : t.registerTitle}
        </h2>

        {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input type="text" placeholder={t.nameLabel} required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500" />
          )}
          <input type="email" placeholder={t.emailLabel} required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500" />
          <input type="password" placeholder={t.passLabel} required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500" />
          <button type="submit" disabled={isProcessing} className="w-full py-5 tryonx-gradient rounded-2xl font-black uppercase text-white shadow-xl">
            {isProcessing ? t.processing : (mode === 'login' ? t.loginBtn : t.registerBtn)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-xs text-gray-500 uppercase font-black hover:text-white transition">
            {mode === 'login' ? t.noAccount : t.hasAccount}
          </button>
        </div>
        <button onClick={onCancel} className="w-full mt-4 text-[10px] text-gray-700 uppercase font-bold">İPTAL</button>
      </div>
    </div>
  );
};

export default AuthView;
