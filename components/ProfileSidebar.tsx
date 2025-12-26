
import React, { useState, useRef } from 'react';
import { Language, translations } from '../translations';
import { User, ProfileVisibility } from '../types';

interface ProfileSidebarProps {
  lang: Language;
  user: User;
  onClose: () => void;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ lang, user, onClose, onLogout, onUpdateUser }) => {
  const t = translations[lang].profile;
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [visibility, setVisibility] = useState<ProfileVisibility>(user.visibility || 'private');
  const [avatar_url, setAvatarUrl] = useState(user.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateUser({ name, bio, visibility, avatar_url });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-[#050505] border-l border-white/10 shadow-[-20px_0_100px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-500">
        <div className="absolute inset-0 pointer-events-none opacity-10 studio-grid"></div>
        <div className="relative p-10 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">{t.identity}</h2>
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mt-2">BİYOMETRİK AYARLAR</p>
          </div>
          <button onClick={onClose} className="h-12 w-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-16 no-scrollbar relative z-10 pb-32">
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              <div className="absolute -inset-6 tryonx-gradient rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition duration-700"></div>
              <div className="relative h-40 w-40 rounded-[3.5rem] border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center shadow-2xl">
                {avatar_url ? <img src={avatar_url} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /> : <span className="text-5xl font-black">{user.name.charAt(0)}</span>}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-[10px] font-black uppercase tracking-widest">GÜNCELLE</span>
                </div>
              </div>
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>

            <div className="mt-12 w-full space-y-4">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">NEURAL_ID</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm font-black uppercase tracking-widest outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">BİYO / MANİFESTO</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              placeholder="Stil vizyonunuzu buraya yazın..." 
              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-xs font-medium text-gray-300 outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all h-40 resize-none leading-relaxed uppercase tracking-tight" 
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">ARENA GÖRÜNÜRLÜĞÜ</label>
            <div className="grid grid-cols-1 gap-4">
              {(['public', 'brands', 'private'] as ProfileVisibility[]).map((v) => (
                <button 
                  key={v} 
                  onClick={() => setVisibility(v)} 
                  className={`flex flex-col p-6 rounded-3xl border text-left transition-all relative overflow-hidden group/opt ${visibility === v ? 'bg-white/10 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                >
                  <span className={`text-[11px] font-black uppercase tracking-widest mb-1 ${visibility === v ? 'text-white' : 'text-gray-500'}`}>{t[v] || v}</span>
                  <p className="text-[9px] font-bold text-gray-700 uppercase tracking-tight">Profil erişim protokolü: {v}</p>
                  {visibility === v && <div className="absolute top-1/2 -translate-y-1/2 right-6 h-2 w-2 bg-cyan-500 rounded-full shadow-[0_0_100px_#00d2ff]"></div>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-10 space-y-4 border-t border-white/5 bg-black/80 backdrop-blur-2xl relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full py-6 tryonx-gradient rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] text-white shadow-2xl transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'YÜKLENİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
          </button>
          <button onClick={onLogout} className="w-full py-5 bg-white/5 border border-white/5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70 hover:bg-red-500 hover:text-white transition-all">SİSTEMDEN AYRIL</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
