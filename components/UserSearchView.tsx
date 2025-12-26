
import React from 'react';
import { User } from '../types';

interface UserSearchViewProps {
  query: string;
  users: User[];
  onViewProfile: (user: User) => void;
}

const UserSearchView: React.FC<UserSearchViewProps> = ({ query, users, onViewProfile }) => {
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-500 min-h-[70vh]">
      <div className="mb-16 border-b border-white/5 pb-10">
        <div className="flex items-center gap-3 mb-4">
           <span className="h-2 w-12 bg-cyan-500"></span>
           <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em]">SEARCH_RESULTS</h2>
        </div>
        <p className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">"{query}" İÇİN SONUÇLAR</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filteredUsers.length > 0 ? filteredUsers.map(user => (
          <div 
            key={user.id} 
            onClick={() => onViewProfile(user)}
            className="group flex items-center gap-8 p-8 bg-[#050505] border border-white/5 rounded-[3rem] hover:border-cyan-500/50 cursor-pointer transition-all shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/5 blur-[60px] rounded-full group-hover:bg-cyan-500/10 transition-colors"></div>
            <div className="h-20 w-20 rounded-[2rem] overflow-hidden border border-white/10 bg-black flex items-center justify-center shrink-0 z-10 shadow-xl">
              {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /> : <span className="text-2xl font-black">{user.name.charAt(0)}</span>}
            </div>
            <div className="flex-1 overflow-hidden z-10">
              <h3 className="text-xl font-black uppercase tracking-tight truncate mb-2">{user.name}</h3>
              <div className="flex gap-4">
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{user.followers.length} TAKİPÇİ</p>
                 <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">RANK #12</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all z-10 shrink-0">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3} /></svg>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[4rem] bg-white/[0.01]">
             <p className="text-[12px] font-black text-gray-700 uppercase tracking-[0.6em] mb-4">MİMAR BULUNAMADI</p>
             <p className="text-[10px] font-bold text-gray-800 uppercase">Farklı bir frekans dene.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearchView;
