
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { StyleChallenge, RunwayPost, StyleArchitect, BrandProduct, Comment } from '../types';

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
}

const ArenaView: React.FC<ArenaViewProps> = ({ 
  lang, challenges, posts, architects, products, onBack, onVote, onParticipate, onComment, onSave 
}) => {
  const t = translations[lang].arena;
  const [selectedChallenge, setSelectedChallenge] = useState<StyleChallenge | null>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const getLinkedProduct = (productId: string) => products.find(p => p.id === productId);

  const activeComments = posts.find(p => p.id === activeCommentId)?.comments || [];

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase">{t.title}</h1>
            <p className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-[0.6em] uppercase">{t.subtitle}</p>
          </div>
          <button onClick={onBack} className="px-10 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition active:scale-95">BACK</button>
        </div>

        <section className="space-y-8">
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">{t.architects}</h2>
           <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {architects.map((arc) => (
                <div key={arc.id} className="shrink-0 flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl group hover:border-cyan-500/40 transition">
                   <div className="relative">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10">
                         <img src={arc.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="absolute -top-2 -left-2 h-6 w-6 bg-cyan-500 rounded-lg flex items-center justify-center text-black text-[10px] font-black">#{arc.rank}</div>
                   </div>
                   <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest">{arc.name}</h4>
                      <p className="text-[9px] font-bold text-gray-500 uppercase">{arc.clones} {t.clones}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-4 space-y-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">{t.activeChallenges}</h2>
              <div className="space-y-6">
                 {challenges.map((ch) => (
                   <div key={ch.id} className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/5" onClick={() => setSelectedChallenge(ch)}>
                      <img src={ch.bannerImage} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8 flex flex-col justify-end">
                         <div className="mb-4"><span className="bg-purple-500 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{ch.tag}</span></div>
                         <h3 className="text-xl font-black uppercase tracking-tight mb-2">{ch.title}</h3>
                         <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
                            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{t.prize}: <span className="text-white">{ch.prize}</span></div>
                            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{t.deadline}: <span className="text-white">{ch.deadline}</span></div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-8 space-y-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">{t.runway}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {posts.map((post) => (
                   <div key={post.id} className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden group">
                      <div className="aspect-[4/5] relative">
                         <img src={post.resultImage} className="w-full h-full object-cover" />
                         <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 pr-4 rounded-full border border-white/10">
                            <div className="h-6 w-6 rounded-full overflow-hidden border border-white/20"><img src={post.userAvatar} className="w-full h-full object-cover" /></div>
                            <span className="text-[9px] font-black uppercase tracking-widest">{post.userName}</span>
                         </div>
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 gap-4">
                            <button onClick={() => onVote(post.id)} className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-500 transition active:scale-95">VOTE ( {post.votes} )</button>
                            <div className="flex gap-4 w-full">
                               <button onClick={() => setActiveCommentId(post.id)} className="flex-1 py-4 bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase">COMMENTS ({post.comments.length})</button>
                               <button onClick={() => onSave(post)} className="flex-1 py-4 bg-purple-500 text-black rounded-2xl text-[10px] font-black uppercase">SAVE CLOSET</button>
                            </div>
                         </div>
                      </div>
                      <div className="p-8">
                         <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{post.vibe}</p>
                         <p className="text-[8px] font-bold text-gray-500 uppercase">CATEGORY: {post.category}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {activeCommentId && (
        <div className="fixed inset-0 z-[700] bg-black/80 backdrop-blur-sm flex justify-end">
           <div className="w-full max-w-md bg-[#050505] border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <h2 className="text-xl font-black uppercase tracking-widest">COMMENTS</h2>
                 <button onClick={() => setActiveCommentId(null)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">×</button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                 {activeComments.length > 0 ? activeComments.map(c => (
                    <div key={c.id} className="space-y-2">
                       <div className="flex items-center gap-3">
                          <img src={c.userAvatar || 'https://via.placeholder.com/40'} className="h-6 w-6 rounded-full" />
                          <span className="text-[10px] font-black uppercase text-cyan-400">{c.userName}</span>
                          <span className="text-[8px] font-bold text-gray-600 ml-auto">{new Date(c.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <p className="text-[11px] text-gray-400 leading-relaxed pl-9">{c.text}</p>
                    </div>
                 )) : (
                    <div className="text-center py-20 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Henüz yorum yok. İlk sen yaz!</div>
                 )}
              </div>
              <div className="p-8 border-t border-white/5 space-y-4">
                 <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Bir yorum bırak..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium outline-none h-24 focus:border-cyan-500 transition-all resize-none"></textarea>
                 <button onClick={() => { if (newComment.trim()) { onComment(activeCommentId, newComment); setNewComment(""); } }} className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest">YORUM YAP</button>
              </div>
           </div>
        </div>
      )}

      {selectedChallenge && (
        <div className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[#050505] border border-white/10 p-10 sm:p-14 rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-12 relative no-scrollbar">
              <div className="flex justify-between items-start sticky top-0 bg-[#050505] z-20 pb-4">
                <div><h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{t.briefing}</h2><p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.5em] mt-3">{selectedChallenge.tag}</p></div>
                <button onClick={() => setSelectedChallenge(null)} className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition"><svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">{t.requirements}</h3>
                    <p className="text-gray-300 font-medium leading-relaxed">{selectedChallenge.description}</p>
                    <ul className="space-y-3">{selectedChallenge.rules.map((rule, idx) => (<li key={idx} className="flex gap-4 items-start text-xs font-bold text-gray-400"><span className="text-purple-500">▶</span>{rule}</li>))}</ul>
                  </div>
                  <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4">
                     <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{t.prize}</span><span className="text-xs font-black text-white">{selectedChallenge.prize}</span></div>
                     <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{t.deadline}</span><span className="text-xs font-black text-white">{selectedChallenge.deadline}</span></div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">{t.linkedProduct}</h3>
                  {(() => {
                    const prod = getLinkedProduct(selectedChallenge.linkedProductId);
                    return prod ? (
                      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden p-6 group">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative"><img src={prod.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /><div className="absolute inset-0 scanner-line opacity-0 group-hover:opacity-40 transition-opacity"></div></div>
                        <h4 className="text-sm font-black uppercase tracking-tight">{prod.name}</h4><p className="text-[9px] font-bold text-gray-600 uppercase mt-1">{prod.brandName}</p>
                      </div>
                    ) : <div className="p-12 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10"><p className="text-[10px] font-bold text-gray-600 uppercase">NO_PRODUCT_LINKED</p></div>;
                  })()}
                </div>
              </div>
              <div className="pt-8 flex flex-col items-center gap-6 sticky bottom-0 bg-[#050505] pb-4">
                 <button onClick={() => onParticipate(selectedChallenge.id)} className="w-full max-w-md py-6 tryonx-gradient rounded-full text-xs font-black uppercase tracking-[0.4em] text-white shadow-[0_0_50px_rgba(157,80,187,0.3)] hover:scale-[1.02] active:scale-95 transition-all">{t.startChallenge}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ArenaView;
