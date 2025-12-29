
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { StyleChallenge, RunwayPost, StyleArchitect, BrandProduct, User } from '../types';

interface ArenaViewProps {
  lang: Language;
  challenges: StyleChallenge[];
  posts: RunwayPost[];
  architects: StyleArchitect[];
  products: BrandProduct[];
  onBack: () => void;
  onVote: (postId: string) => void;
  onParticipate: (challengeId: string) => void;
  onComment: (postId: string, text: string) => void;
  onSave: (post: RunwayPost) => void;
  currentUser: User | null;
}

const ArenaView: React.FC<ArenaViewProps> = ({ 
  lang, challenges, posts, architects, products, onBack, onVote, onParticipate, onComment, onSave, currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'neural' | 'manual'>('neural');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const filteredPosts = (posts || []).filter(p => activeTab === 'manual' ? p.is_manual : !p.is_manual);

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none">NEURAL ARENA</h1>
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.6em] uppercase">STİL SAVAŞLARI & TOPLULUK AKIŞI</p>
          </div>
          <button onClick={onBack} className="px-10 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition active:scale-95 shadow-xl">GERİ DÖN</button>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
             <button 
               onClick={() => setActiveTab('neural')} 
               className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'neural' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-white'}`}
             >
               NÖRAL SENTEZ
             </button>
             <button 
               onClick={() => setActiveTab('manual')} 
               className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-white'}`}
             >
               MANUEL STİL
             </button>
          </div>
          <div className="hidden sm:block h-[1px] flex-1 bg-white/5"></div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post) => {
            const isLiked = currentUser && post.liked_by && Array.isArray(post.liked_by) && post.liked_by.includes(currentUser.id);
            const isSaved = currentUser && currentUser.saved_posts && Array.isArray(currentUser.saved_posts) && currentUser.saved_posts.includes(post.id);

            return (
              <div key={post.id} className="group relative flex flex-col bg-[#050505] border border-white/5 rounded-[3.5rem] overflow-hidden hover:border-white/20 transition-all shadow-2xl">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={post.resultImage} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                  
                  <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${post.is_manual ? 'bg-purple-500/80 border-purple-400 text-white' : 'bg-cyan-500/80 border-cyan-400 text-black'}`}>
                    {post.is_manual ? 'AUTHENTIC LOOK' : 'NEURAL RENDER'}
                  </div>

                  <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-4 w-4 rounded-full overflow-hidden bg-white/10">
                      {post.userAvatar ? <img src={post.userAvatar} className="w-full h-full object-cover" /> : <div className="h-full w-full bg-cyan-500"></div>}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest">{post.userName}</span>
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-8 gap-4 backdrop-blur-[2px]">
                    <button 
                      onClick={() => onVote(post.id)} 
                      className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition active:scale-95 ${isLiked ? 'bg-cyan-500 text-black' : 'bg-white text-black'}`}
                    >
                      {isLiked ? 'BEĞENİLDİ' : 'BEĞEN'} ( {post.likes || 0} )
                    </button>
                    <div className="flex gap-4 w-full">
                      <button onClick={() => setActiveCommentId(post.id)} className="flex-1 py-4 bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/20 transition">
                        YORUM ({post.comments?.length || 0})
                      </button>
                      <button 
                        onClick={() => onSave(post)} 
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition ${isSaved ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30' : 'bg-cyan-500 text-black hover:brightness-110'}`}
                      >
                        {isSaved ? 'KAYDEDİLDİ' : 'KAYDET'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${post.is_manual ? 'text-purple-400' : 'text-cyan-400'}`}>
                        {post.vibe || 'STYLE_LINK'}
                      </p>
                      <p className="text-[8px] font-bold text-gray-700 uppercase">{post.category || 'GENERAL'}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[12px] font-black tracking-tighter">{(post.likes || 0) + (post.comments?.length || 0)}</p>
                       <p className="text-[7px] font-black text-gray-800 uppercase tracking-widest">ETKİLEŞİM</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-40 text-center border border-dashed border-white/10 rounded-[4rem]">
             <div className="mb-6 opacity-20 flex justify-center">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1} /></svg>
             </div>
             <p className="text-[12px] font-black text-gray-700 uppercase tracking-[0.6em] mb-2">BU AKIŞ HENÜZ BOŞ</p>
             <p className="text-[9px] font-bold text-gray-800 uppercase tracking-widest">İlk gönderiyi sen paylaş ve arenayı canlandır.</p>
          </div>
        )}
      </div>

      {/* Comment Panel */}
      {activeCommentId && (
        <div className="fixed inset-0 z-[700] bg-black/80 backdrop-blur-sm flex justify-end" onClick={(e) => e.target === e.currentTarget && setActiveCommentId(null)}>
           <div className="w-full max-w-md bg-[#050505] border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-500 shadow-[-50px_0_100px_rgba(0,0,0,0.8)]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl">
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-widest">YORUMLAR</h2>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">ARENA ETKİLEŞİMİ</p>
                 </div>
                 <button onClick={() => setActiveCommentId(null)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500 transition-colors">×</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                 {posts.find(p => p.id === activeCommentId)?.comments?.length ? posts.find(p => p.id === activeCommentId)?.comments?.map((c: any) => (
                    <div key={c.id} className="space-y-2 group animate-in fade-in slide-in-from-bottom-2">
                       <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-full overflow-hidden bg-black border border-white/10">
                            {c.userAvatar ? <img src={c.userAvatar} className="w-full h-full object-cover" /> : <div className="bg-gray-800 w-full h-full"></div>}
                          </div>
                          <span className="text-[10px] font-black uppercase text-cyan-400">{c.userName}</span>
                          <span className="text-[8px] font-bold text-gray-700 ml-auto">{new Date(c.timestamp).toLocaleDateString()}</span>
                       </div>
                       <p className="text-[11px] text-gray-400 leading-relaxed pl-9">{c.text}</p>
                    </div>
                 )) : (
                    <div className="text-center py-24 text-[10px] font-bold text-gray-700 uppercase tracking-widest">HENÜZ YORUM YOK</div>
                 )}
              </div>

              <div className="p-8 border-t border-white/5 space-y-4 bg-black/40 backdrop-blur-xl">
                 <textarea 
                   value={newComment} 
                   onChange={e => setNewComment(e.target.value)} 
                   placeholder="Stilin hakkında ne düşünüyorsun?" 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-medium outline-none h-28 focus:border-cyan-500 transition-all resize-none text-white placeholder:text-gray-700"
                 ></textarea>
                 <button 
                   onClick={() => { if (newComment.trim()) { onComment(activeCommentId, newComment); setNewComment(""); } }} 
                   className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-colors shadow-2xl active:scale-95"
                 >
                   GÖNDER
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ArenaView;
