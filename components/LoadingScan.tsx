
import React, { useEffect, useState } from 'react';
import { translations, TRIVIA_TR } from '../utils/translations';

interface LoadingScanProps {
  imageSrc: string | null;
  state: string;
  lang: string;
}

const GLOBAL_TRIVIA_EN = [
  {
    name: "Eiffel Tower",
    description: "Constructed in 1889 for the World's Fair, it was initially criticized by some of France's leading artists.",
    image: "https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    name: "Taj Mahal",
    description: "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan.",
    image: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    name: "Machu Picchu",
    description: "A 15th-century Inca citadel set high in the Andes Mountains in Peru, often referred to as the 'Lost City of the Incas'.",
    image: "https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    name: "The Colosseum",
    description: "The largest ancient amphitheatre ever built, located in the centre of Rome, capable of holding up to 80,000 spectators.",
    image: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    name: "Petra",
    description: "Famous for its rock-cut architecture and water conduit system, this historical city in Jordan is also called the 'Rose City'.",
    image: "https://images.pexels.com/photos/1631665/pexels-photo-1631665.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

export const LoadingScan: React.FC<LoadingScanProps> = ({ imageSrc, state, lang }) => {
  const [triviaItems, setTriviaItems] = useState<typeof GLOBAL_TRIVIA_EN>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const t = translations[lang as keyof typeof translations];
  const triviaList = lang === 'tr' ? TRIVIA_TR : GLOBAL_TRIVIA_EN;

  useEffect(() => {
    // Pick 2 unique random trivia items from selected lang list
    const shuffled = [...triviaList].sort(() => 0.5 - Math.random());
    setTriviaItems(shuffled.slice(0, 2));
  }, [lang]);

  useEffect(() => {
    // Cycle background images if we don't have a specific capture image
    if (!imageSrc) {
      const interval = setInterval(() => {
        setBgIndex((prev) => (prev + 1) % triviaList.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [imageSrc, triviaList.length]);
  
  const getMessage = () => {
    switch(state) {
      case 'ANALYZING_IMAGE': return t.identifying;
      case 'FETCHING_INFO': return t.gatheringInfo;
      case 'GENERATING_AUDIO': return t.creatingGuide;
      case 'FETCHING_SUGGESTIONS': return t.findingGems;
      default: return t.processing;
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Background Image Handling */}
      {imageSrc ? (
        // Specific User Image (Blur Context)
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-110 transition-transform duration-[20s]"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      ) : (
        // Slideshow Background (General Loading/Suggestions)
        <div className="absolute inset-0 w-full h-full overflow-hidden">
           {triviaList.map((item, index) => (
             <div 
               key={index}
               className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
                 index === bgIndex ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
               }`}
               style={{ backgroundImage: `url(${item.image})` }}
             />
           ))}
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-zinc-900/50 to-black"></div>
        </div>
      )}
      
      {/* Additional Darken Overlay for text contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 overflow-y-auto scrollbar-hide">
        <div className="flex-shrink-0 h-8"></div> {/* Top spacer */}

        {/* Main Spinner Card */}
        <div className="bg-zinc-900/80 ios-blur p-6 rounded-[2rem] border border-white/10 flex flex-col items-center shadow-2xl mb-8 w-full max-w-[280px] flex-shrink-0 backdrop-blur-md">
           {/* iOS Spinner */}
           <div className="relative w-10 h-10 mb-4">
             {Array.from({ length: 8 }).map((_, i) => (
               <div 
                 key={i}
                 className="absolute w-1.5 h-3 bg-white rounded-full left-1/2 top-0 -ml-[3px] origin-[50%_20px] animate-spinner-fade"
                 style={{ 
                   transform: `rotate(${i * 45}deg)`,
                   animationDelay: `${i * 0.1}s`
                 }}
               />
             ))}
           </div>
           
           <h3 className="text-white font-semibold text-lg tracking-wide">{getMessage()}</h3>
        </div>

        {/* Global Trivia Cards Stack */}
        <div className="w-full max-w-[340px] flex flex-col gap-4">
          {triviaItems.map((item, idx) => (
            <div 
              key={idx}
              className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 shadow-lg"
              style={{ animationDelay: `${idx * 150 + 100}ms`, animationFillMode: 'both' }}
            >
               <div className="w-16 h-16 rounded-xl bg-zinc-800 flex-shrink-0 overflow-hidden ring-1 ring-white/10 mt-1">
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
               </div>
               <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{t.didYouKnow}</p>
                  </div>
                  <h4 className="text-white text-sm font-bold truncate leading-tight mb-1">{item.name}</h4>
                  {/* Full text displayed, no line clamp */}
                  <p className="text-zinc-300 text-xs leading-relaxed font-medium opacity-90">
                    {item.description}
                  </p>
               </div>
            </div>
          ))}
        </div>
        
        <div className="flex-shrink-0 h-8"></div> {/* Bottom spacer */}
      </div>
      
      <style>{`
        @keyframes spinner-fade {
          0% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        .animate-spinner-fade {
          animation: spinner-fade 0.8s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
