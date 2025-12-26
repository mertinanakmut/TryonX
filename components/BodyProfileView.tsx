
import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { BodyMeasurements } from '../types';

interface BodyProfileViewProps {
  lang: Language;
  onSave: (measurements: BodyMeasurements) => void;
  onSkip: () => void;
}

const BodyProfileView: React.FC<BodyProfileViewProps> = ({ lang, onSave, onSkip }) => {
  const t = translations[lang].bodyProfile;
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    height: 175,
    weight: 70,
    chest: 95,
    waist: 80,
    hips: 95,
    unit: 'metric'
  });
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    const { height, weight, chest, waist, hips } = measurements;
    if (
      height < 50 || height > 250 ||
      weight < 20 || weight > 300 ||
      chest < 30 || chest > 200 ||
      waist < 30 || waist > 200 ||
      hips < 30 || hips > 250
    ) {
      setError(t.validationError);
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(measurements);
    }
  };

  const InputField = ({ label, value, keyName, placeholder }: { label: string, value: number, keyName: keyof BodyMeasurements, placeholder: string }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setError(null);
          setMeasurements({ ...measurements, [keyName]: parseFloat(e.target.value) || 0 });
        }}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[400] bg-black flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 studio-grid opacity-20"></div>
      
      <div className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[3rem] p-10 sm:p-16 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden">
        {/* Scanning Line Background */}
        <div className="absolute inset-0 scanner-line opacity-10 pointer-events-none"></div>

        <div className="relative z-10 space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">{t.title}</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">{t.subtitle}</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <InputField label={t.height} value={measurements.height} keyName="height" placeholder="175" />
            <InputField label={t.weight} value={measurements.weight} keyName="weight" placeholder="70" />
            <InputField label={t.chest} value={measurements.chest} keyName="chest" placeholder="95" />
            <InputField label={t.waist} value={measurements.waist} keyName="waist" placeholder="80" />
            <div className="sm:col-span-2">
               <InputField label={t.hips} value={measurements.hips} keyName="hips" placeholder="95" />
            </div>
          </div>

          <div className="pt-6 space-y-6">
            <button
              onClick={handleSave}
              className="group relative w-full overflow-hidden rounded-2xl p-[2px] transition-all active:scale-[0.97]"
            >
              <div className="absolute inset-0 tryonx-gradient animate-pulse"></div>
              <div className="relative bg-black rounded-2xl py-5 transition-all group-hover:bg-transparent flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{t.save}</span>
              </div>
            </button>

            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={onSkip}
                className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition"
              >
                {t.skip}
              </button>
              <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider text-center px-8">
                {t.skipWarning}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center">
             <p className="text-[8px] font-bold text-gray-700 uppercase leading-relaxed max-w-sm mx-auto">
               {t.privacy}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyProfileView;
