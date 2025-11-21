
import React from 'react';
import { HistoryItem } from '../types';
import { translations } from '../utils/translations';

interface HistoryViewProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onScan: () => void;
  onBack: () => void;
  lang: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ items, onSelect, onScan, onBack, lang }) => {
  const t = translations[lang as keyof typeof translations];

  return (
    <div className="relative h-full w-full flex flex-col bg-black overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Background Video Layer (Apple Style) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover grayscale opacity-30 scale-105"
        >
          {/* Consistent video source with Landing Page */}
          <source src="https://videos.pexels.com/video-files/2519660/2519660-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        </video>
        {/* Strong Dark Overlay for Dominant Black Screen */}
        <div className="absolute inset-0 bg-black/85"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-6 pb-6 px-4 flex flex-col bg-gradient-to-b from-black/90 to-transparent border-b border-white/5">
        
        {/* Navigation Row */}
        <div className="flex items-center mb-4">
            <button 
                onClick={onBack} 
                className="flex items-center text-blue-400 active:opacity-50 transition-opacity"
            >
                <svg className="w-6 h-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-lg font-medium">{t.dashboardTitle}</span>
            </button>
        </div>

        <div className="flex items-end justify-between px-2">
            <div>
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">{t.library}</h2>
            <h1 className="text-3xl font-bold text-white tracking-tight">{t.myToursTitle}</h1>
            </div>
            {/* Mini Profile Icon */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 ring-1 ring-white/20 shadow-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-4 pb-28">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500">
             <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-white/10">
               <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
             </div>
             <h3 className="text-white font-semibold text-lg mb-2">{t.noLandmarksTitle}</h3>
             <p className="text-center max-w-xs text-sm text-zinc-400">
               {t.noLandmarksDesc}
             </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="group w-full flex flex-col bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden active:scale-[0.98] transition-all hover:bg-zinc-900/60 shadow-lg"
              >
                <div className="flex items-center p-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 relative shadow-sm">
                      <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    
                    {/* Text */}
                    <div className="ml-4 flex-1 text-left">
                      <h3 className="text-white font-bold text-lg leading-tight mb-1.5 line-clamp-1">{item.name}</h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-2 font-normal">{item.description}</p>
                      <div className="flex items-center">
                        <div className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-semibold text-zinc-300 uppercase tracking-wide">
                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="mr-1 text-zinc-600 group-hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Fixed Scan Button (Optional now that we have dashboard, but kept for quick access) */}
      <div className="absolute bottom-8 left-0 w-full px-6 flex justify-center z-20 pointer-events-none">
        <button 
          onClick={onScan}
          className="pointer-events-auto shadow-2xl shadow-black/50 flex items-center gap-3 px-6 py-3.5 bg-zinc-800/80 backdrop-blur-xl text-white rounded-full active:scale-95 transition-all hover:bg-zinc-700 ring-1 ring-white/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-semibold text-base">{t.scanLandmarkBtn}</span>
        </button>
      </div>
      
      {/* Bottom gradient fade for list */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10"></div>

    </div>
  );
};
