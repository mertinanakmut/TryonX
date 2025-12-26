
import React, { useState, useRef } from 'react';
import { Language, translations } from '../translations';
import { User, ProfileVisibility, RunwayPost } from '../types';

interface ProfileSidebarProps {
  lang: Language;
  user: User;
  onClose: () => void;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
  myPosts?: RunwayPost[];
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ lang, user, onClose, onLogout, onUpdateUser, myPosts = [] }) => {
  const t = translations[lang].profile;
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [visibility, setVisibility] = useState<ProfileVisibility>(user.visibility || 'private');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser({ name, bio, visibility, avatar });
    onClose();
  };

  const VisibilityOption = ({ type, label }: { type: ProfileVisibility, label: string }) => (
    <button 
      onClick={() => setVisibility(type)}
      className={`w-full p-4 rounded-2xl border text-left transition-all ${visibility === type ? 'bg-white/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[10px] font-black uppercase tracking-widest ${visibility === type ? 'text-cyan-400' : 'text-white/60'}`}>{label}</span>
        {visibility === type && <div className="h-2 w-2 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]"></div>}
      </div>
      <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
        {t.visibilityDesc[type]}
      </p>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[600] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      {/* Sidebar Content */}
      <div className="relative w-full max-w-md h-full bg-[#050505] border-l border-white/10 p-8 sm:p-12 shadow-[-20px_0_100px_rgba(0,0,0,1)] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
        <div className="absolute inset-0 scanner-line opacity-5 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white leading-none">{t.identity}</h2>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-2">USER_NODE_{user.email.split('@')[0].toUpperCase()}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="space-y-10 flex-1">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                <div className="absolute -inset-2 rounded-full tryonx-gradient blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative h-28 w-28 rounded-full border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-white/20">{user.name.charAt(0)}</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                </div>
                <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <div className="mt-6 text-center">
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="bg-transparent text-xl font-black uppercase tracking-tight text-white text-center border-b border-transparent focus:border-cyan-500/30 outline-none w-full"
                  placeholder="USERNAME"
                />
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">{user.email}</p>
              </div>
            </div>

            {/* My Challenge Entries */}
            {myPosts.length > 0 && (
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">{t.myChallenges}</label>
                 <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {myPosts.filter(p => p.challengeId).map(post => (
                      <div key={post.id} className="shrink-0 w-32 space-y-2">
                         <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                            <img src={post.resultImage} className="w-full h-full object-cover" />
                         </div>
                         <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest truncate">ENTRY_LINKED</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Bio Section */}
            <div className="space-y-4">
               <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">{t.bio}</label>
               <textarea 
                 value={bio}
                 onChange={e => setBio(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm font-bold text-gray-300 focus:border-cyan-500/40 outline-none transition h-32 resize-none no-scrollbar"
                 placeholder={t.bioPlaceholder}
               />
            </div>

            {/* Visibility Section */}
            <div className="space-y-4">
               <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">{t.visibility}</label>
               <div className="space-y-3">
                  <VisibilityOption type="public" label={t.public} />
                  <VisibilityOption type="brands" label={t.brands} />
                  <VisibilityOption type="private" label={t.private} />
               </div>
            </div>
          </div>

          <div className="mt-auto pt-10 space-y-4">
             <button 
               onClick={handleSave}
               className="w-full py-5 tryonx-gradient rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
             >
               {t.save}
             </button>
             <button 
               onClick={onLogout}
               className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:bg-red-500/10 transition-all"
             >
               {t.logout}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
