
import React, { useState } from 'react';

interface CompareSliderProps {
  before: string;
  after: string;
  labels?: {
    before: string;
    after: string;
  };
}

const CompareSlider: React.FC<CompareSliderProps> = ({ before, after, labels }) => {
  const [position, setPosition] = useState(50);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = ((x - container.left) / container.width) * 100;
    setPosition(Math.max(0, Math.min(100, pos)));
  };

  return (
    <div 
      className="relative w-full h-full cursor-col-resize select-none overflow-hidden"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
      onTouchMove={handleMove}
      onMouseDown={handleMove}
    >
      <img src={after} className="absolute inset-0 w-full h-full object-contain bg-black" alt="After" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden" 
        style={{ width: `${position}%`, borderRight: '2px solid rgba(255,255,255,0.8)' }}
      >
        <img src={before} className="absolute inset-0 w-[1000vw] h-full object-contain max-w-none bg-black" style={{ width: `${100 / (position/100)}%` }} alt="Before" />
      </div>
      
      <div className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_15px_white]" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center">
          <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
          </svg>
        </div>
      </div>
      
      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[9px] text-white font-black uppercase tracking-[0.2em] z-20">
        {labels?.before || "Source"}
      </div>
      <div className="absolute top-6 right-6 bg-cyan-500/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[9px] text-white font-black uppercase tracking-[0.2em] z-20 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
        {labels?.after || "TryonX Render"}
      </div>
    </div>
  );
};

export default CompareSlider;
