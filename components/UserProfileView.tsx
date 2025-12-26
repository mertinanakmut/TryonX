
import React from 'react';
import { User } from '../types';

interface UserProfileViewProps {
  user: User;
  isFollowing: boolean;
  onFollow: () => void;
  onBack: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ user, isFollowing, onFollow, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-10 duration-700 min-h-screen">
      <button onClick={onBack} className="mb-16 flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition group">
        <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={3} /></svg>
        </div>
        GERİ DÖN
      </button>

      <div className="flex flex-col md:flex-row items-center gap-16 mb-24 bg-[#050505] p-12 sm:p-20 rounded-[5rem] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 h-64 w-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative shrink-0">
          <div className="absolute -inset-6 tryonx-gradient blur-2xl opacity-10 animate-pulse"></div>
          <div className="relative h-48 w-48 sm:h-64 sm:w-64 rounded-[4rem] border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <span className="text-7xl font-black">{user.name.charAt(0)}</span>}
          </div>
          <div className="absolute -bottom-4 -right-4 bg-cyan-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">VERIFIED</div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-10 relative z-10">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
               <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">STİL MİMARI</span>
               <span className="h-px w-8 bg-white/10"></span>
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ID: {user.email.split('@')[0]}</span>
            </div>
            <h2 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">{user.name}</h2>
            <p className="text-gray-500 font-medium text-xl leading-relaxed max-w-lg mx-auto md:mx-0 uppercase tracking-tight">{user.bio || 'BU MİMAR HENÜZ BİR MANİFESTO YAYINLAMAMIŞ.'}</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-12">
            <div className="text-center md:text-left">
              <p className="text-4xl font-black text-white">{user.followers.length}</p>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">TAKİPÇİ</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-4xl font-black text-white">{user.following.length}</p>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">TAKİP</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-4xl font-black text-cyan-400">#12</p>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">ARENA_RANK</p>
            </div>
          </div>

          <button 
            onClick={onFollow}
            className={`w-full sm:w-fit px-16 py-6 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${isFollowing ? 'bg-white/5 border border-white/10 text-white hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500' : 'bg-white text-black hover:bg-cyan-500'}`}
          >
            {isFollowing ? 'TAKİBİ BIRAK' : 'TAKİP ET'}
          </button>
        </div>
      </div>

      <div className="space-y-16 pb-32">
        <div className="flex items-center gap-10">
           <h3 className="text-3xl font-black uppercase tracking-tighter shrink-0">NEURAL CLOSET</h3>
           <div className="h-px flex-1 bg-white/10"></div>
           <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">ARCHIVE_01</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
           {[1, 2, 3].map((i) => (
             <div key={i} className="aspect-[3/4] rounded-[3rem] bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center p-10 text-center group hover:bg-white/[0.04] transition-all">
                <p className="text-[10px] font-black text-gray-700 uppercase leading-relaxed tracking-widest group-hover:text-gray-500 transition-colors">VERİ SENTEZİ BEKLENİYOR</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
