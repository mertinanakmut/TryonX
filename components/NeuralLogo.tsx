
import React from 'react';

interface NeuralLogoProps {
  className?: string;
  isProcessing?: boolean;
}

const NeuralLogo: React.FC<NeuralLogoProps> = ({ className = "w-12 h-12", isProcessing = false }) => {
  return (
    <div className={`relative ${className} group`}>
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-cyan-500/20 blur-xl rounded-full transition-opacity duration-1000 ${isProcessing ? 'opacity-60 scale-150 animate-pulse' : 'opacity-10 group-hover:opacity-30'}`}></div>
      
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className={`w-full h-full relative z-10 transition-all duration-1000 ${isProcessing ? 'animate-spin-fast' : 'animate-spin-slow group-hover:rotate-180'}`}
      >
        {/* Synthetic X Path */}
        <path 
          d="M19 5L5 19" 
          stroke="url(#neural_grad_1)" 
          strokeWidth="3" 
          strokeLinecap="round" 
          className={isProcessing ? 'animate-pulse' : ''}
        />
        {/* Core Frame Path */}
        <path 
          d="M5 5L19 19" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeOpacity="0.9"
          className={isProcessing ? 'animate-pulse' : ''}
        />
        
        {/* Synaptic Dots */}
        <circle cx="5" cy="5" r="1.5" fill="#00d2ff" className="animate-pulse" />
        <circle cx="19" cy="19" r="1.5" fill="#9d50bb" className="animate-pulse" />
        <circle cx="12" cy="12" r="1" fill="white" className="animate-ping" />

        <defs>
          <linearGradient id="neural_grad_1" x1="19" y1="5" x2="5" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00d2ff" />
            <stop offset="1" stopColor="#9d50bb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default NeuralLogo;
