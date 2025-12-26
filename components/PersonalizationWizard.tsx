
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { UserPreferences, FitPreference } from '../types';

interface PersonalizationWizardProps {
  lang: Language;
  onComplete: (prefs: UserPreferences) => void;
  onEditMeasurements: () => void;
  onViewLegal: () => void;
}

const PersonalizationWizard: React.FC<PersonalizationWizardProps> = ({ lang, onComplete, onEditMeasurements, onViewLegal }) => {
  const t = translations[lang].personalization;
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [prefs, setPrefs] = useState<UserPreferences>({
    style_preferences: [],
    fit_preference: 'regular',
    comfort_mode_enabled: false,
    data_consent: false,
    legal_version: "2025.12.24",
    onboarding_complete: false
  });

  const styles = [
    { id: 'casual', label: t.styles.casual },
    { id: 'sport', label: t.styles.sport },
    { id: 'classic', label: t.styles.classic },
    { id: 'street', label: t.styles.street },
    { id: 'minimal', label: t.styles.minimal }
  ];

  const toggleStyle = (styleId: string) => {
    setPrefs(p => ({
      ...p,
      style_preferences: p.style_preferences.includes(styleId)
        ? p.style_preferences.filter(id => id !== styleId)
        : [...p.style_preferences, styleId]
    }));
  };

  const handleFinish = () => {
    if (prefs.data_consent) {
      onComplete({ ...prefs, onboarding_complete: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 studio-grid opacity-20"></div>
      
      <div className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[3rem] p-10 sm:p-16 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden min-h-[600px] flex flex-col justify-center">
        <div className="absolute inset-0 scanner-line opacity-10 pointer-events-none"></div>

        <div className="relative z-10">
          {step === 1 && (
            <div className="space-y-12 text-center animate-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto text-cyan-400 border border-cyan-500/20">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase text-white">{t.successTitle}</h2>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md mx-auto">{t.successDesc}</p>
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={() => setStep(2)} className="tryonx-gradient py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all active:scale-95 shadow-2xl">{t.continueBtn}</button>
                <button onClick={onEditMeasurements} className="text-[10px] font-bold text-gray-600 uppercase tracking-widest hover:text-white transition">{t.editMeasurements}</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-4">
              <div className="text-center">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">{t.styleTitle}</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">{t.styleDesc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {styles.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleStyle(s.id)}
                    className={`p-6 rounded-2xl border transition-all text-left group ${prefs.style_preferences.includes(s.id) ? 'bg-white border-white' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${prefs.style_preferences.includes(s.id) ? 'text-black' : 'text-white/60 group-hover:text-white'}`}>{s.label}</span>
                      {prefs.style_preferences.includes(s.id) && <div className="h-2 w-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#00d2ff]"></div>}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center pt-6">
                <button onClick={() => setStep(1)} className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">BACK</button>
                <button onClick={() => setStep(3)} className="bg-white text-black px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition">{t.continueBtn}</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-4">
              <div className="text-center">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">{t.fitTitle}</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">{t.fitDesc}</p>
              </div>
              <div className="space-y-4">
                {(['slim', 'regular', 'relaxed'] as FitPreference[]).map(fit => (
                  <button
                    key={fit}
                    onClick={() => setPrefs(p => ({ ...p, fit_preference: fit }))}
                    className={`w-full p-6 rounded-2xl border text-left transition-all ${prefs.fit_preference === fit ? 'bg-white border-white' : 'bg-white/5 border-white/10'}`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-widest ${prefs.fit_preference === fit ? 'text-black' : 'text-white/60'}`}>{t.fits[fit]}</span>
                  </button>
                ))}
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{t.comfortLabel}</h4>
                  <p className="text-[8px] font-bold text-gray-600 uppercase">{t.comfortDesc}</p>
                </div>
                <button 
                  onClick={() => setPrefs(p => ({ ...p, comfort_mode_enabled: !p.comfort_mode_enabled }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${prefs.comfort_mode_enabled ? 'bg-cyan-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.comfort_mode_enabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="flex justify-between items-center pt-6">
                <button onClick={() => setStep(2)} className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">BACK</button>
                <button onClick={() => setStep(4)} className="bg-white text-black px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition">{t.continueBtn}</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 animate-in slide-in-from-right-4">
              <div className="text-center">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">{t.consentTitle}</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">{t.consentDesc}</p>
              </div>
              
              <div className="space-y-6">
                <div 
                  onClick={() => setPrefs(p => ({ ...p, data_consent: !p.data_consent }))}
                  className="flex items-start gap-4 cursor-pointer p-6 bg-white/5 border border-white/10 rounded-2xl group transition-all hover:bg-white/[0.08]"
                >
                  <div className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${prefs.data_consent ? 'bg-cyan-500 border-cyan-500' : 'border-white/20 group-hover:border-white/40'}`}>
                    {prefs.data_consent && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest mb-2">{t.consentCheck}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewLegal(); }} 
                      className="text-[9px] font-bold text-cyan-400 hover:underline uppercase tracking-widest"
                    >
                      {t.policyLink}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  disabled={!prefs.data_consent}
                  className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all ${prefs.data_consent ? 'tryonx-gradient text-white shadow-2xl active:scale-95' : 'bg-white/5 text-gray-700 cursor-not-allowed'}`}
                >
                  {t.finishBtn}
                </button>

                <button 
                  onClick={() => onComplete({ ...prefs, onboarding_complete: true })}
                  className="w-full text-[10px] font-bold text-gray-700 uppercase tracking-widest hover:text-white transition"
                >
                  {t.skip}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizationWizard;
