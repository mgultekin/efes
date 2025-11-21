
import React from 'react';
import { LandmarkData, PlaybackState } from '../types';
import { PlaybackState as AudioState } from '../services/audioService';
import { translations } from '../utils/translations';

interface ResultCardProps {
  imageSrc: string;
  data: LandmarkData;
  playbackState: AudioState;
  currentTime: number;
  duration: number;
  isGeneratingAudio?: boolean;
  onPlay: () => void;
  onStop: () => void;
  onGenerateAudio?: () => void;
  onBack: () => void;
  lang: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  imageSrc, 
  data, 
  playbackState, 
  currentTime, 
  duration,
  isGeneratingAudio = false,
  onPlay,
  onStop,
  onGenerateAudio,
  onBack,
  lang
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasAudio = !!data.audioBuffer;
  const t = translations[lang as keyof typeof translations];

  return (
    <div className="w-full h-full flex flex-col bg-black animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Image Area */}
      <div className="relative h-[45vh] w-full flex-shrink-0">
        <img src={imageSrc} alt={data.name} className="w-full h-full object-cover" />
        {/* Gradient fade into content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black"></div>
        
        {/* Custom Back Button for Result View */}
        <button 
          onClick={onBack}
          className="absolute top-12 left-6 w-10 h-10 bg-black/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>

      {/* Content Sheet */}
      <div className="flex-1 -mt-6 relative z-10 bg-black rounded-t-3xl px-6 pb-10 overflow-y-auto no-scrollbar">
        
        {/* Drag Handle Indicator */}
        <div className="w-full flex justify-center pt-3 pb-6">
          <div className="w-10 h-1 bg-zinc-800 rounded-full"></div>
        </div>

        <div className="space-y-6">
          {/* Title Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 leading-tight">{data.name}</h1>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">{t.landmarkTag}</span>
              
              {/* Map Indicator Link if available */}
              {data.mapInfo?.uri && (
                <a 
                   href={data.mapInfo.uri} 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-900/30 border border-blue-800 text-[10px] font-semibold text-blue-400 uppercase tracking-wider active:opacity-50"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <span>{t.viewOnMaps}</span>
                </a>
              )}
            </div>
          </div>

          {/* Audio Player - Apple Music Style */}
          {hasAudio ? (
            <div className="bg-zinc-900 rounded-xl p-4 flex items-center space-x-4 active:bg-zinc-800 transition-colors">
              <button 
                onClick={playbackState === AudioState.PLAYING ? onStop : onPlay}
                className="w-12 h-12 flex-shrink-0 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              >
                {playbackState === AudioState.PLAYING ? (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                   <svg className="w-5 h-5 translate-x-0.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1.5">
                  <h3 className="text-sm font-semibold text-white truncate pr-2">{t.audioGuide}</h3>
                  <span className="text-xs text-zinc-500 font-variant-numeric tabular-nums">
                    {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
               <div className="flex flex-col">
                 <span className="text-sm font-semibold text-white">{t.audioGuide}</span>
                 <span className="text-xs text-zinc-500">{t.narrationNotGenerated}</span>
               </div>
               <button 
                 onClick={onGenerateAudio}
                 disabled={isGeneratingAudio}
                 className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white text-xs font-semibold rounded-full transition-colors"
               >
                 {isGeneratingAudio ? t.generating : t.createAudio}
               </button>
             </div>
          )}

          {/* Description */}
          <div className="prose prose-invert prose-p:text-zinc-300 prose-p:text-base prose-p:leading-relaxed max-w-none">
            <p>{data.description}</p>
          </div>

          {/* Nearby Places (Maps Data) */}
          {data.nearbyPlaces && data.nearbyPlaces.length > 0 && (
            <div className="pt-2">
               <div className="flex items-center justify-between mb-3">
                 <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t.exploreNearbySection}</h4>
                 <span className="text-[10px] text-zinc-600">{t.poweredByMaps}</span>
               </div>
               <div className="flex overflow-x-auto no-scrollbar space-x-3 pb-2 -mx-6 px-6">
                  {data.nearbyPlaces.map((place, idx) => (
                    <a 
                      key={idx}
                      href={place.maps?.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-shrink-0 w-40 h-24 bg-zinc-900 border border-white/5 rounded-xl p-3 flex flex-col justify-between active:scale-95 transition-transform hover:bg-zinc-800"
                    >
                      <span className="text-sm font-medium text-white line-clamp-2">{place.maps?.title || "Unknown Place"}</span>
                      <div className="flex items-center text-blue-400 text-xs font-medium">
                        <span>{t.viewMap}</span>
                        <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </div>
                    </a>
                  ))}
               </div>
            </div>
          )}

          {/* Web Sources */}
          {data.sources && data.sources.length > 0 && (
            <div className="pt-4 border-t border-zinc-900">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">{t.sources}</h4>
              <div className="flex flex-col space-y-2">
                {data.sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.web?.uri}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 active:bg-zinc-800 transition-colors group"
                  >
                    <span className="text-sm text-zinc-300 font-medium truncate pr-4">{source.web?.title}</span>
                    <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Padding for bottom scroll */}
          <div className="h-6"></div>
        </div>
      </div>
    </div>
  );
};
