
import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  icon: React.ReactNode;
  image: string | null;
  onImageSelect: (base64: string) => void;
  description: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, icon, image, onImageSelect, description }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.01] p-4 transition-all hover:bg-white/[0.03] group overflow-hidden">
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
        accept="image/*"
      />
      
      {image ? (
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl border border-white/10 group-hover:border-cyan-500/30 transition-all duration-500">
          <img src={image} alt={label} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105" />
          
          {/* Subtle Scanner on Hover */}
          <div className="absolute inset-0 scanner-line opacity-0 group-hover:opacity-40 transition-opacity"></div>
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
            <button 
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-white px-6 py-2.5 text-[10px] font-black text-black shadow-2xl uppercase tracking-widest active:scale-90 transition-all"
            >
              Update Map
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center space-y-4 py-12 w-full transition-all duration-500"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full tryonx-gradient blur opacity-10 group-hover:opacity-30 transition duration-700"></div>
            <div className="relative rounded-full bg-black border border-white/10 p-6 text-cyan-400 group-hover:text-white group-hover:border-cyan-500/50 transition-all duration-500">
              {icon}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{label}</h3>
            <p className="mt-1 text-[9px] text-gray-600 max-w-[150px] font-medium leading-relaxed">{description}</p>
          </div>
          <div className="h-[1px] w-8 bg-white/5 group-hover:w-16 group-hover:bg-cyan-500/50 transition-all duration-700"></div>
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
