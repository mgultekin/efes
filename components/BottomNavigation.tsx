
import React from 'react';
import { translations } from '../utils/translations';

interface BottomNavigationProps {
  activeTab: 'home' | 'daily';
  onTabChange: (tab: 'home' | 'daily') => void;
  lang: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange, lang }) => {
  const t = translations[lang as keyof typeof translations];

  return (
    <div className="absolute bottom-0 left-0 w-full z-50 px-6 pb-8 pt-2 pointer-events-none">
      <div className="pointer-events-auto bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-full h-16 flex items-center justify-around shadow-2xl shadow-black/50 max-w-sm mx-auto">
        
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors duration-300 ${activeTab === 'home' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <svg className="w-6 h-6 mb-0.5" fill={activeTab === 'home' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'home' ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium">{t.home}</span>
        </button>

        <button 
          onClick={() => onTabChange('daily')}
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors duration-300 ${activeTab === 'daily' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <svg className="w-6 h-6 mb-0.5" fill={activeTab === 'daily' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'daily' ? 0 : 2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-medium">{t.daily}</span>
        </button>

      </div>
    </div>
  );
};
