
import React from 'react';
import { translations } from '../utils/translations';

interface DashboardProps {
  onScan: () => void;
  onHistory: () => void;
  onExplore: () => void;
  lang: string;
  onToggleLang: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onScan, onHistory, onExplore, lang, onToggleLang }) => {
  const t = translations[lang as keyof typeof translations];

  return (
    <div className="relative h-full w-full flex flex-col bg-black overflow-hidden animate-in fade-in duration-500">
      
      {/* Background Video Layer (Consistent with other views) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover grayscale opacity-30 scale-105"
        >
          <source src="https://videos.pexels.com/video-files/2519660/2519660-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/85"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-14 px-6 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">{t.dashboardTitle}</h1>
          <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mt-1">{t.welcome}</p>
        </div>
        {/* Language Toggle */}
        <button 
           onClick={onToggleLang}
           className="mt-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider hover:bg-white/20 transition-colors text-white"
         >
           {lang === 'en' ? 'TR' : 'EN'}
         </button>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 flex-1 px-6 overflow-y-auto pb-28 scrollbar-hide">
        <div className="flex flex-col gap-5">
            
            {/* Scan Card */}
            <button 
              onClick={onScan} 
              className="group relative h-64 w-full bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl active:scale-[0.98] transition-all text-left p-8"
            >
                {/* Inner Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/5 to-transparent group-hover:opacity-100 opacity-60 transition-opacity duration-500"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                     <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                     </div>
                     <div>
                         <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{t.scanCardTitle}</h3>
                         <div className="flex items-center text-zinc-400 text-sm font-medium">
                           <span>{t.scanCardDesc}</span>
                           <svg className="w-4 h-4 ml-1 opacity-60 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                         </div>
                     </div>
                </div>
            </button>

            {/* My Tours Card */}
            <button 
              onClick={onHistory} 
              className="group relative h-40 w-full bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-xl active:scale-[0.98] transition-all text-left p-8"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/5 to-transparent group-hover:opacity-100 opacity-60 transition-opacity duration-500"></div>
                
                <div className="relative z-10 h-full flex items-center justify-between">
                     <div className="flex flex-col justify-center">
                         <h3 className="text-2xl font-bold text-white mb-1">{t.historyCardTitle}</h3>
                         <p className="text-zinc-400 text-sm">{t.historyCardDesc}</p>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/5">
                        <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                     </div>
                </div>
            </button>

             {/* Suggestions Card */}
             <button 
                onClick={onExplore}
                className="group relative h-32 w-full bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-xl active:scale-[0.98] transition-all text-left p-8"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-orange-600/5 to-transparent group-hover:opacity-100 opacity-60 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex flex-col">
                     <h3 className="text-xl font-bold text-white mb-1">{t.exploreCardTitle}</h3>
                     <p className="text-zinc-400 text-sm">{t.exploreCardDesc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/5">
                      <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                  </div>
                </div>
             </button>
        </div>
      </div>
    </div>
  );
};
