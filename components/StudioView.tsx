
import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import CompareSlider from './CompareSlider';
import NeuralLogo from './NeuralLogo';
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

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => onStateUpdate({ view: 'home', error: null, isLoading: false, status: 'idle' })} 
            className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" /></svg>
          </button>
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">{t.header.studio}</h2>
            <p className="text-cyan-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] mt-1">NEURAL_SYNTHESIS_HUB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
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
              <ImageUploader 
                label={t.controls.target} 
                description={t.controls.targetDesc} 
                image={state.personImage} 
                onImageSelect={(b) => onStateUpdate({ personImage: b, error: null, resultImage: null })} 
                icon={<NeuralLogo className="w-8 h-8" />} 
              />
              <ImageUploader 
                label={t.controls.garment} 
                description={t.controls.garmentDesc} 
                image={state.garmentImage} 
                onImageSelect={(b) => onStateUpdate({ garmentImage: b, error: null, resultImage: null })} 
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={2}/></svg>} 
              />
              
              <div className="grid grid-cols-3 gap-3">
                {(['tops', 'bottoms', 'one-piece'] as const).map(cat => (
                  <button key={cat} onClick={() => onStateUpdate({ category: cat, resultImage: null })} className={`py-4 rounded-2xl text-[9px] font-black uppercase transition-all border ${state.category === cat ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-transparent text-gray-500 border-white/5 hover:border-white/20'}`}>{t.categories[cat]}</button>
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

        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-[#050505] rounded-[4rem] p-6 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 flex flex-col min-h-[500px] md:min-h-[750px] relative overflow-hidden group">
            <div className="absolute inset-0 studio-grid opacity-10 pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 relative z-10">
              <div className="flex overflow-x-auto no-scrollbar w-full sm:w-auto bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                {SCENARIOS.map(s => (
                  <button key={s.id} onClick={() => onStateUpdate({ scenario: s.id })} className={`px-6 py-2.5 rounded-xl text-[9px] font-black transition-all tracking-[0.2em] uppercase whitespace-nowrap ${state.scenario === s.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{s.label}</button>
                ))}
              </div>
            </div>

            <div className="flex-1 relative rounded-[3rem] bg-black overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
              {state.isLoading ? (
                <div className="flex flex-col items-center gap-12 text-center px-8 relative z-20">
                  <div className="relative w-24 h-24 md:w-48 md:h-48">
                     <NeuralLogo className="w-full h-full" isProcessing={true} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm md:text-2xl font-black text-white tracking-[0.2em] uppercase transition-all duration-700">{t.controls.processingStates[activeStepIdx]}</h4>
                    <p className="text-[9px] font-bold text-cyan-500 uppercase tracking-[0.5em] animate-pulse">SYNAPTIC_MAPPING_V2.5</p>
                  </div>
                </div>
              ) : (
                state.resultImage ? (
                  <div key={state.resultImage} className="w-full h-full animate-in fade-in zoom-in duration-1000">
                    <CompareSlider before={state.personImage!} after={state.resultImage} labels={{ before: t.results.source, after: t.results.render }} />
                  </div>
                ) : (
                  <div className="p-12 text-center max-w-sm relative z-20">
                    <div className="mb-12 opacity-5 scale-150 animate-float"><NeuralLogo className="w-48 h-48 mx-auto" /></div>
                    <h3 className="text-3xl font-black tracking-tighter text-white mb-4 uppercase">{t.results.init}</h3>
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.4em] leading-loose">{t.results.awaiting}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioView;
