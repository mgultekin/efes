
import React, { useState } from 'react';
import { SuggestionResult } from '../types';
import { translations } from '../utils/translations';

interface SuggestionsViewProps {
  data: SuggestionResult;
  onBack: () => void;
  lang: string;
}

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({ data, onBack, lang }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const t = translations[lang as keyof typeof translations];

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getMapLink = (name: string) => {
    if (!name || !data.places) return undefined;
    const normalizedName = name.toLowerCase();
    
    // Fuzzy match the recommendation name with the map chunks
    const chunk = data.places.find(p => {
      const placeTitle = p.maps?.title?.toLowerCase();
      if (!placeTitle) return false;
      return placeTitle.includes(normalizedName) || normalizedName.includes(placeTitle);
    });
    
    return chunk?.maps?.uri;
  };

  const recommendations = data.recommendations || [];

  return (
    <div className="relative h-full w-full flex flex-col bg-black overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
      
      {/* Ambient Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover grayscale opacity-20 scale-110 blur-sm"
        >
          <source src="https://videos.pexels.com/video-files/2519660/2519660-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
      </div>

      {/* Premium Header */}
      <div className="relative z-20 pt-12 px-6 pb-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0">
         <div className="flex flex-col">
            <h2 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">{t.curatedCollection}</h2>
            <h1 className="text-2xl font-bold text-white tracking-tight truncate max-w-[240px]">{data.title || "Suggestions"}</h1>
         </div>
         <button 
             onClick={onBack} 
             className="w-8 h-8 bg-zinc-800/80 rounded-full flex items-center justify-center hover:bg-zinc-700 active:scale-95 transition-all ring-1 ring-white/10"
         >
             <svg className="w-4 h-4 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
             </svg>
         </button>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 py-6">
        
        {/* Intro Section */}
        <div className="mb-8 px-2 animate-in slide-in-from-bottom-4 fade-in duration-700">
           <p className="text-lg leading-relaxed text-zinc-200 font-light tracking-wide first-letter:text-3xl first-letter:font-serif first-letter:text-white first-letter:mr-0.5">
             {data.introduction}
           </p>
           
           <div className="mt-6 flex items-center space-x-2 opacity-60">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent"></div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">{t.topPicks}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent"></div>
           </div>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3 pb-20">
           {recommendations.map((item, idx) => {
             const isOpen = expandedIndex === idx;
             const mapUri = getMapLink(item.name);
             
             return (
               <div 
                 key={idx}
                 className={`group bg-zinc-900/60 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-zinc-800/80 shadow-xl border-white/20' : 'hover:bg-zinc-800/50'}`}
                 style={{ animationDelay: `${idx * 100}ms` }}
               >
                 {/* Header (Clickable) */}
                 <button 
                   onClick={() => toggleAccordion(idx)}
                   className="w-full p-4 flex items-center justify-between text-left"
                 >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-zinc-400'}`}>
                         <span className="text-xs font-bold">{idx + 1}</span>
                      </div>
                      <div className="min-w-0">
                         <h3 className={`text-base font-bold truncate transition-colors ${isOpen ? 'text-white' : 'text-zinc-200'}`}>{item.name}</h3>
                         <p className="text-xs text-zinc-400 uppercase tracking-wide">{item.type}</p>
                      </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-white/10' : ''}`}>
                       <svg className="w-3 h-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                    </div>
                 </button>

                 {/* Expanded Content */}
                 <div 
                   className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                 >
                   <div className="overflow-hidden">
                     <div className="px-4 pb-5 pt-0">
                        <div className="h-px w-full bg-white/5 mb-4"></div>
                        <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        
                        {mapUri ? (
                          <a 
                            href={mapUri}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            {t.viewOnMaps}
                          </a>
                        ) : (
                          <button disabled className="flex items-center justify-center w-full py-3 bg-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider rounded-xl cursor-not-allowed">
                             {t.mapInfoUnavailable}
                          </button>
                        )}
                     </div>
                   </div>
                 </div>
               </div>
             );
           })}
        </div>
        
        {recommendations.length === 0 && (
           <div className="text-center py-10 opacity-50">
              <p className="text-sm text-zinc-400">{t.noSuggestions}</p>
           </div>
        )}
      </div>
    </div>
  );
};
