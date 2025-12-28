
import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import CompareSlider from './CompareSlider';
import { TryOnState, Scenario } from '../types';
import { Language, translations } from '../translations';

interface StudioViewProps {
  state: TryOnState;
  lang: Language;
  onStateUpdate: (updates: Partial<TryOnState>) => void;
  onExecute: () => void;
  onSave: () => void;
  onShare: () => void;
  loadingStep: number;
  setShowScanner: (show: boolean) => void;
}

const StudioView: React.FC<StudioViewProps> = ({ 
  state, lang, onStateUpdate, onExecute, onSave, onShare, setShowScanner 
}) => {
  const t = translations[lang];
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const SCENARIOS: {id: Scenario, label: string}[] = [
    { id: 'studio', label: t.scenarios.studio },
    { id: 'urban', label: t.scenarios.urban },
    { id: 'nature', label: t.scenarios.nature },
    { id: 'party', label: t.scenarios.party }
  ];

  // Animated loading steps
  useEffect(() => {
    let interval: any;
    if (state.isLoading) {
      interval = setInterval(() => {
        setActiveStepIdx(prev => (prev + 1) % t.controls.processingStates.length);
      }, 2500);
    } else {
      setActiveStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [state.isLoading, t.controls.processingStates.length]);

  const NeuralXIcon = ({ className, glow = true }: { className?: string, glow?: boolean }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      {glow && (
        <g filter="url(#glow_studio_v2)">
          <path d="M19 5L5 19" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
          <path d="M5 5L19 19" stroke="#9d50bb" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        </g>
      )}
      <path d="M19 5L5 19" stroke="url(#x_grad_studio_v2)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M5 5L19 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
      <defs>
        <linearGradient id="x_grad_studio_v2" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d2ff" /><stop offset="1" stopColor="#9d50bb" />
        </linearGradient>
        <filter id="glow_studio_v2" x="0" y="0" width="24" height="24" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1.5" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => onStateUpdate({ view: 'home', error: null, isLoading: false, status: 'idle' })} 
            className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">{t.header.studio}</h2>
            <p className="text-cyan-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] mt-1">NEURAL_SYNTHESIS_HUB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Side: Controls */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <section className="bg-[#050505] rounded-[3rem] p-8 border border-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{t.controls.input}</h3>
              </div>
              <button onClick={() => setShowScanner(true)} className="px-4 py-1.5 bg-white text-black text-[9px] font-black rounded-full uppercase tracking-widest hover:bg-cyan-500 transition-colors">LIVE SCAN</button>
            </div>
            
            <div className="space-y-6">
              <ImageUploader label={t.controls.target} description={t.controls.targetDesc} image={state.personImage} onImageSelect={(b) => onStateUpdate({ personImage: b, error: null })} icon={<NeuralXIcon className="w-6 h-6" glow={false} />} />
              <ImageUploader label={t.controls.garment} description={t.controls.garmentDesc} image={state.garmentImage} onImageSelect={(b) => onStateUpdate({ garmentImage: b, error: null })} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={2}/></svg>} />
              
              <div className="grid grid-cols-3 gap-3">
                {(['tops', 'bottoms', 'one-piece'] as const).map(cat => (
                  <button key={cat} onClick={() => onStateUpdate({ category: cat })} className={`py-4 rounded-2xl text-[9px] font-black uppercase transition-all border ${state.category === cat ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-transparent text-gray-500 border-white/5 hover:border-white/20'}`}>{t.categories[cat]}</button>
                ))}
              </div>

              <button 
                disabled={!state.personImage || !state.garmentImage || state.isLoading} 
                onClick={onExecute} 
                className="w-full py-6 rounded-2xl tryonx-gradient text-[11px] font-black uppercase tracking-[0.4em] text-white disabled:opacity-20 active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(0,210,255,0.2)]"
              >
                {state.isLoading ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t.controls.synthesizing}</span>
                  </div>
                ) : t.controls.execute}
              </button>
            </div>
          </section>
        </div>

        {/* Right Side: Result */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-[#050505] rounded-[4rem] p-6 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 flex flex-col min-h-[500px] md:min-h-[750px] relative overflow-hidden group">
            <div className="absolute inset-0 studio-grid opacity-10 pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 relative z-10">
              <div className="flex overflow-x-auto no-scrollbar w-full sm:w-auto bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                {SCENARIOS.map(s => (
                  <button key={s.id} onClick={() => onStateUpdate({ scenario: s.id })} className={`px-6 py-2.5 rounded-xl text-[9px] font-black transition-all tracking-[0.2em] uppercase whitespace-nowrap ${state.scenario === s.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{s.label}</button>
                ))}
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                {state.resultImage && !state.isLoading && (
                  <>
                    <button onClick={onShare} className="flex-1 sm:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition">SHARE</button>
                    <button onClick={onSave} className="flex-1 sm:flex-none px-6 py-3 bg-cyan-500 rounded-xl text-[9px] font-black text-black uppercase tracking-widest hover:brightness-110 shadow-lg">SAVE_TO_CLOSET</button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 relative rounded-[3rem] bg-black overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
              {state.isLoading ? (
                <div className="flex flex-col items-center gap-12 text-center px-8 relative z-20">
                  <div className="relative w-24 h-24 md:w-48 md:h-48">
                     <div className="absolute inset-0 border-4 md:border-8 border-cyan-500/20 rounded-full"></div>
                     <div className="absolute inset-0 border-4 md:border-8 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                     <div className="absolute inset-8 md:inset-16 bg-cyan-500/5 rounded-full flex items-center justify-center">
                        <NeuralXIcon className="w-10 h-10 md:w-20 md:h-20 animate-pulse" glow={true} />
                     </div>
                     <div className="absolute inset-0 scanner-line opacity-60"></div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm md:text-2xl font-black text-white tracking-[0.2em] uppercase transition-all duration-700">{t.controls.processingStates[activeStepIdx]}</h4>
                    <p className="text-[9px] font-bold text-cyan-500 uppercase tracking-[0.5em] animate-pulse">SYNAPTIC_MAPPING_V1.5</p>
                  </div>
                </div>
              ) : (
                state.resultImage ? (
                  <div className="w-full h-full animate-in fade-in zoom-in duration-1000">
                    <CompareSlider before={state.personImage!} after={state.resultImage} labels={{ before: t.results.source, after: t.results.render }} />
                  </div>
                ) : (
                  <div className="p-12 text-center max-w-sm relative z-20">
                    <div className="mb-12 opacity-5 scale-150"><NeuralXIcon className="w-48 h-48 mx-auto" glow={false} /></div>
                    <h3 className="text-3xl font-black tracking-tighter text-white mb-4 uppercase">{t.results.init}</h3>
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.4em] leading-loose">{t.results.awaiting}</p>
                    
                    {state.garmentImage && !state.personImage && (
                      <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl animate-bounce">
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">SİSTEME FOTOĞRAF GEREKLİ</p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {state.error && (
              <div className="absolute bottom-8 left-8 right-8 z-50 animate-in slide-in-from-bottom-8">
                <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-2xl p-6 rounded-[2rem] flex items-center gap-6">
                  <div className="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2}/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">SYNTHESIS_ERROR_0x44</p>
                    <p className="text-xs font-bold text-gray-400 line-clamp-2">{state.error}</p>
                  </div>
                  <button onClick={() => onStateUpdate({ error: null })} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase transition-all">RETRY</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioView;
