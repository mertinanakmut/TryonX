import React from 'react';
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
  state, lang, onStateUpdate, onExecute, onSave, onShare, loadingStep, setShowScanner 
}) => {
  const t = translations[lang];

  const SCENARIOS: {id: Scenario, label: string}[] = [
    { id: 'studio', label: t.scenarios.studio },
    { id: 'urban', label: t.scenarios.urban },
    { id: 'nature', label: t.scenarios.nature },
    { id: 'party', label: t.scenarios.party }
  ];

  const NeuralXIcon = ({ className, glow = true }: { className?: string, glow?: boolean }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      {glow && (
        <g filter="url(#glow_studio)">
          <path d="M19 5L5 19" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
          <path d="M5 5L19 19" stroke="#9d50bb" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        </g>
      )}
      <path d="M19 5L5 19" stroke="url(#x_grad_studio)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M5 5L19 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
      <defs>
        <linearGradient id="x_grad_studio" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d2ff" /><stop offset="1" stopColor="#9d50bb" />
        </linearGradient>
        <filter id="glow_studio" x="0" y="0" width="24" height="24" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1.5" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => onStateUpdate({ view: 'home', error: null, isLoading: false, status: 'idle' })} className="h-10 w-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">{t.header.studio}</h2>
            <p className="text-gray-500 text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] mt-0.5">MAPPING_PHASE_01</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
        {/* Left Side: Controls */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <section className="bg-[#050505] rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 border border-white/5 backdrop-blur-xl shadow-2xl space-y-6 md:space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{t.controls.input}</h3>
              <button onClick={() => setShowScanner(true)} className="px-3 py-1 bg-cyan-500 text-black text-[8px] font-black rounded-full uppercase tracking-widest">REAL SCAN</button>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <div className={`transition-all duration-500 ${state.garmentImage && !state.personImage ? 'ring-1 ring-cyan-500/50 rounded-3xl p-1' : ''}`}>
                <ImageUploader label={t.controls.target} description={t.controls.targetDesc} image={state.personImage} onImageSelect={(b) => onStateUpdate({ personImage: b, error: null })} icon={<NeuralXIcon className="w-6 h-6" glow={false} />} />
              </div>
              <ImageUploader label={t.controls.garment} description={t.controls.garmentDesc} image={state.garmentImage} onImageSelect={(b) => onStateUpdate({ garmentImage: b, error: null })} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
              
              <div className="grid grid-cols-3 gap-2">
                {(['tops', 'bottoms', 'one-piece'] as const).map(cat => (
                  <button key={cat} onClick={() => onStateUpdate({ category: cat })} className={`py-3 rounded-xl text-[8px] font-black uppercase transition-all border ${state.category === cat ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/5'}`}>{t.categories[cat]}</button>
                ))}
              </div>

              <button disabled={!state.personImage || !state.garmentImage || state.isLoading} onClick={onExecute} className="w-full py-4 md:py-5 rounded-2xl tryonx-gradient text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white disabled:opacity-10 active:scale-[0.98] transition shadow-2xl">
                {state.isLoading ? t.controls.synthesizing : t.controls.execute}
              </button>
            </div>
          </section>
        </div>

        {/* Right Side: Result */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-[#050505] rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-10 shadow-2xl border border-white/5 flex flex-col min-h-[400px] md:min-h-[700px] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 relative z-10">
              <div className="flex overflow-x-auto no-scrollbar w-full sm:w-auto bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
                {SCENARIOS.map(s => (
                  <button key={s.id} onClick={() => onStateUpdate({ scenario: s.id })} className={`px-4 md:px-6 py-2 rounded-full text-[8px] md:text-[9px] font-black transition-all tracking-[0.1em] md:tracking-[0.2em] uppercase whitespace-nowrap ${state.scenario === s.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{s.label}</button>
                ))}
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto justify-center">
                {state.resultImage && !state.isLoading && (
                  <>
                    <button onClick={onShare} className="flex-1 sm:flex-none px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest transition">SHARE</button>
                    <button onClick={onSave} className="flex-1 sm:flex-none px-5 py-2 bg-cyan-500 rounded-full text-[8px] font-black text-black uppercase tracking-widest">SAVE</button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 relative rounded-2xl md:rounded-3xl bg-black overflow-hidden flex items-center justify-center border border-white/5">
              {state.isLoading ? (
                <div className="flex flex-col items-center gap-6 md:gap-10 text-center px-4 relative z-20">
                  <div className="relative w-16 h-16 md:w-32 md:h-32">
                     <div className="absolute inset-0 border-[2px] md:border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                     <div className="absolute inset-4 md:inset-8 bg-cyan-500/5 rounded-full flex items-center justify-center"><NeuralXIcon className="w-6 h-6 md:w-10 md:h-10 animate-pulse" glow={true} /></div>
                  </div>
                  <h4 className="text-[10px] md:text-xl font-black text-white tracking-widest uppercase animate-pulse">{t.controls.processingStates[loadingStep]}</h4>
                </div>
              ) : (
                state.resultImage ? (
                  <div className="w-full h-full animate-in fade-in zoom-in duration-700">
                    <CompareSlider before={state.personImage!} after={state.resultImage} labels={{ before: t.results.source, after: t.results.render }} />
                  </div>
                ) : (
                  <div className="p-6 text-center max-w-sm relative z-20">
                    <div className="mb-6 md:mb-8 opacity-5"><NeuralXIcon className="w-32 h-32 md:w-48 md:h-48 mx-auto" glow={false} /></div>
                    <h3 className="text-xl md:text-3xl font-black tracking-tighter text-white mb-3 uppercase">{t.results.init}</h3>
                    <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.3em] leading-loose">{t.results.awaiting}</p>
                    
                    {state.garmentImage && !state.personImage && (
                      <div className="mt-6 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl animate-pulse">
                        <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">FOTOĞRAF YÜKLE</p>
                      </div>
                    )}
                  </div>
                )
              )}
              <div className="absolute inset-0 studio-grid opacity-10 pointer-events-none"></div>
            </div>
            {state.error && (
              <div className="absolute bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
                <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-xl p-3 rounded-xl flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">SENTEZ HATASI</p>
                    <p className="text-[8px] font-bold text-gray-400 truncate">{state.error}</p>
                  </div>
                  <button onClick={() => onStateUpdate({ error: null })} className="px-2 py-1 bg-white/5 rounded-lg text-[7px] font-black uppercase">TAMAM</button>
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