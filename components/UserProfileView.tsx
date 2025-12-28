
import React, { useState } from 'react';
import { User, LookbookEntry, RunwayPost } from '../types';

interface UserProfileViewProps {
  user: User;
  rank: number;
  isMe?: boolean;
  currentUserRole?: string;
  isFollowing: boolean;
  lookbook?: LookbookEntry[];
  savedPosts?: RunwayPost[];
  onFollow: () => void;
  onEdit?: () => void;
  onLogout?: () => void;
  onBack: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ 
  user, rank, isMe, currentUserRole, isFollowing, lookbook = [], savedPosts = [], onFollow, onEdit, onLogout, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'lookbook' | 'saved'>('lookbook');
  
  const canViewContent = 
    isMe || 
    currentUserRole === 'admin' || 
    user.visibility === 'public';

  const canViewSaved = isMe || currentUserRole === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-20 animate-in fade-in slide-in-from-bottom-10 duration-700 min-h-screen">
      <div className="flex justify-between items-center mb-16">
        <button onClick={onBack} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition group flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" /></svg>
          GERİ DÖN
        </button>
        {isMe && <button onClick={onLogout} className="text-[10px] font-black text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-[0.3em]">AYRIL</button>}
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24 mb-24 bg-[#050505] p-12 rounded-[4rem] border border-white/5 relative">
        <div className="relative shrink-0">
          <div className="h-48 w-48 sm:h-64 sm:w-64 rounded-[3rem] border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center">
            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <span className="text-7xl font-black">{user.name?.charAt(0)}</span>}
          </div>
          <div className="absolute -bottom-4 -right-4 bg-cyan-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
            RANK #{rank}
          </div>
        </div>

        <div className="flex-1 text-center lg:text-left space-y-8">
          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none">{user.name}</h2>
          <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 uppercase tracking-tight">
            {user.bio || 'BU MİMAR HENÜZ BİR MANİFESTO YAYINLAMAMIŞ.'}
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-12">
            <div><p className="text-3xl font-black">{user.followers?.length || 0}</p><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">TAKİPÇİ</p></div>
            <div><p className="text-3xl font-black">{lookbook.length}</p><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">SENTEZ</p></div>
          </div>
          <div className="pt-4">
             {isMe ? (
               <button onClick={onEdit} className="px-12 py-5 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-cyan-500 transition">AYARLAR</button>
             ) : (
               <button onClick={onFollow} className={`px-16 py-6 rounded-full text-[11px] font-black uppercase tracking-widest transition ${isFollowing ? 'bg-white/5 border border-white/10' : 'bg-white text-black'}`}>
                 {isFollowing ? 'TAKİBİ BIRAK' : 'TAKİP ET'}
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="flex gap-10 border-b border-white/5 pb-6">
           <button onClick={() => setActiveTab('lookbook')} className={`text-sm font-black uppercase tracking-[0.2em] transition ${activeTab === 'lookbook' ? 'text-white' : 'text-gray-600'}`}>ARŞİV</button>
           {canViewSaved && (
             <button onClick={() => setActiveTab('saved')} className={`text-sm font-black uppercase tracking-[0.2em] transition ${activeTab === 'saved' ? 'text-cyan-500' : 'text-gray-600'}`}>KAYDEDİLENLER</button>
           )}
        </div>

        {!canViewContent ? (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-[3rem] text-gray-600 font-black">BU ARŞİV GİZLİDİR</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeTab === 'lookbook' ? (
              lookbook.map(entry => (
                <div key={entry.id} className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#080808]">
                  <img src={entry.resultImage} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              savedPosts.map(post => (
                <div key={post.id} className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#080808] relative group">
                  <img src={post.resultImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-6">
                     <p className="text-[10px] font-black uppercase text-cyan-400">{post.userName}</p>
                     <p className="text-[8px] font-bold text-gray-500 uppercase">{post.vibe}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
