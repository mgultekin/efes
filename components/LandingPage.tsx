
import React from 'react';
import { translations } from '../utils/translations';

interface LandingPageProps {
  onStart: () => void;
  lang: string;
  onToggleLang: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, lang, onToggleLang }) => {
  const t = translations[lang as keyof typeof translations];

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden font-sans animate-in fade-in duration-700">
      
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale opacity-60 scale-105"
        >
          {/* Reliable Pexels Video: Eiffel Tower at Night */}
          <source src="https://videos.pexels.com/video-files/2519660/2519660-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        </video>
        {/* Overlay Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black"></div>
      </div>

      {/* Language Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-20">
         <button 
           onClick={onToggleLang}
           className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider hover:bg-white/20 transition-colors"
         >
           {lang === 'en' ? 'TR' : 'EN'}
         </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 pt-20">
        
        {/* App Icon / Logo */}
        <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-12 ring-1 ring-white/20">
            <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>

        {/* Text */}
        <h1 className="text-5xl font-bold text-center tracking-tighter mb-4 text-white drop-shadow-lg">
          {t.appName}
        </h1>
        <p className="text-lg text-zinc-200 text-center leading-relaxed max-w-xs font-medium drop-shadow-md">
          {t.appTagline}
        </p>
      </div>

      {/* Bottom Action */}
      <div className="relative z-10 px-8 pb-16 w-full">
        <button 
          onClick={onStart}
          className="w-full py-4 bg-white/90 backdrop-blur-sm text-black font-bold text-lg rounded-full shadow-xl shadow-black/20 hover:bg-white active:scale-[0.98] transition-all duration-200"
        >
          {t.startExploring}
        </button>
        <p className="text-center text-[10px] text-zinc-400 mt-6 uppercase tracking-widest opacity-80">
          {t.poweredBy}
        </p>
      </div>
      
    </div>
  );
};
