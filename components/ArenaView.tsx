
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
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const activePost = posts.find(p => p.id === activeCommentId);
  const activeComments = activePost?.comments || [];

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase">NEURAL ARENA</h1>
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.6em] uppercase">STİL SAVAŞLARI & ETKİLEŞİM MERKEZİ</p>
          </div>
          <button onClick={onBack} className="px-10 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition">GERİ</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => {
            const isLiked = currentUser && post.liked_by?.includes(currentUser.id);
            const isSaved = currentUser && post.saved_by?.includes(currentUser.id);

            return (
              <div key={post.id} className="bg-[#050505] border border-white/5 rounded-[3rem] overflow-hidden group transition-all hover:border-white/20 shadow-2xl">
                <div className="aspect-[4/5] relative">
                  <img src={post.resultImage} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                  
                  <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 pr-4 rounded-full border border-white/10">
                    <div className="h-6 w-6 rounded-full overflow-hidden border border-white/20">
                      {post.userAvatar ? <img src={post.userAvatar} className="w-full h-full object-cover" /> : <div className="bg-cyan-500 h-full w-full"></div>}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">{post.userName}</span>
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 gap-4">
                    <button 
                      onClick={() => onVote(post.id)} 
                      className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition active:scale-95 ${isLiked ? 'bg-cyan-500 text-black' : 'bg-white text-black'}`}
                    >
                      {isLiked ? 'BEĞENİLDİ' : 'BEĞEN'} ( {post.likes} )
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
                <div className="p-8 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1">{post.vibe}</p>
                    <p className="text-[8px] font-bold text-gray-700 uppercase">{post.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">#{post.id.slice(0,4)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeCommentId && (
        <div className="fixed inset-0 z-[700] bg-black/80 backdrop-blur-sm flex justify-end" onClick={(e) => e.target === e.currentTarget && setActiveCommentId(null)}>
           <div className="w-full max-w-md bg-[#050505] border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-widest">YORUMLAR</h2>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">GÖNDERİ BAŞINA MAKSİMUM 5 YORUM</p>
                 </div>
                 <button onClick={() => setActiveCommentId(null)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500 transition-colors">×</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                 {activeComments.length > 0 ? activeComments.map((c: any) => (
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
                    <div className="text-center py-24 text-[10px] font-bold text-gray-700 uppercase tracking-widest flex flex-col items-center gap-4">
                       <svg className="w-12 h-12 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth={2}/></svg>
                       HENÜZ YORUM YOK
                    </div>
                 )}
              </div>

              <div className="p-8 border-t border-white/5 space-y-4 bg-black/40 backdrop-blur-xl">
                 <textarea 
                   value={newComment} 
                   onChange={e => setNewComment(e.target.value)} 
                   placeholder="Bir yorum bırak..." 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-medium outline-none h-28 focus:border-cyan-500 transition-all resize-none text-white"
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
