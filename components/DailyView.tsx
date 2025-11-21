
import React from 'react';
import { translations } from '../utils/translations';

interface DailyViewProps {
  lang: string;
}

// Static mock content for the "Daily" feature
const DAILY_CONTENT_EN = {
  date: "TODAY",
  title: "Hagia Sophia",
  subtitle: "Byzantine Architecture • Istanbul, Turkey",
  architect: "Isidore of Miletus",
  builtIn: "537 AD",
  description: "Famous for its massive dome, it was the world's largest cathedral for nearly a thousand years. Originally built as an Eastern Orthodox cathedral, it was later converted into a mosque, then a museum, and back into a mosque. It is considered the epitome of Byzantine architecture and is said to have changed the history of architecture.",
  image: "https://images.pexels.com/photos/15999520/pexels-photo-15999520/free-photo-of-low-angle-shot-of-hagia-sophia-istanbul-turkey.jpeg?auto=compress&cs=tinysrgb&w=800",
  architectImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Isidore_of_Miletus_%28bust%29.jpg/440px-Isidore_of_Miletus_%28bust%29.jpg",
  likes: 12261
};

const DAILY_CONTENT_TR = {
  date: "BUGÜN",
  title: "Ayasofya",
  subtitle: "Bizans Mimarisi • İstanbul, Türkiye",
  architect: "Miletli İsidoros",
  builtIn: "MS 537",
  description: "Devasa kubbesiyle ünlü olan yapı, yaklaşık bin yıl boyunca dünyanın en büyük katedraliydi. Başlangıçta Doğu Ortodoks katedrali olarak inşa edilmiş, daha sonra camiye, müzeye ve tekrar camiye dönüştürülmüştür. Bizans mimarisinin özü olarak kabul edilir ve mimarlık tarihini değiştirdiği söylenir.",
  image: "https://images.pexels.com/photos/15999520/pexels-photo-15999520/free-photo-of-low-angle-shot-of-hagia-sophia-istanbul-turkey.jpeg?auto=compress&cs=tinysrgb&w=800",
  architectImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Isidore_of_Miletus_%28bust%29.jpg/440px-Isidore_of_Miletus_%28bust%29.jpg",
  likes: 12261
};

export const DailyView: React.FC<DailyViewProps> = ({ lang }) => {
  const t = translations[lang as keyof typeof translations];
  const content = lang === 'tr' ? DAILY_CONTENT_TR : DAILY_CONTENT_EN;
  const today = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

  return (
    <div className="relative h-full w-full flex flex-col bg-black overflow-hidden animate-in fade-in duration-500">
      
      {/* Full Screen Image */}
      <div className="absolute inset-0 h-[60vh] w-full z-0">
        <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black"></div>
      </div>

      {/* Top Metadata (Date, Likes, Share) */}
      <div className="relative z-10 pt-14 px-6 flex items-center justify-between">
        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <span className="text-[10px] font-bold text-white tracking-widest">{today}</span>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
             <svg className="w-3.5 h-3.5 text-red-500 mr-1.5 fill-current" viewBox="0 0 24 24">
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
             </svg>
             <span className="text-[10px] font-bold text-white">{content.likes}</span>
           </div>
           
           <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
             </svg>
           </button>
        </div>
      </div>

      {/* Sheet Content */}
      <div className="relative z-10 flex-1 mt-[35vh] bg-black rounded-t-[2.5rem] px-8 pt-10 pb-28 overflow-y-auto no-scrollbar">
        
        {/* Title Section */}
        <div className="mb-8">
           <h1 className="text-5xl text-white mb-3 font-serif leading-[1.1] drop-shadow-lg">{content.title}</h1>
           <p className="text-zinc-400 text-sm tracking-wide font-medium">{content.subtitle}</p>
        </div>

        {/* Architect/Artist Pill */}
        <div className="inline-flex items-center p-1.5 pr-5 bg-zinc-900 border border-zinc-800 rounded-full mb-8">
           <img 
             src={content.architectImage} 
             alt={content.architect} 
             className="w-10 h-10 rounded-full object-cover border border-zinc-700 grayscale"
           />
           <div className="ml-3 flex flex-col justify-center">
             <span className="text-white text-sm font-bold leading-none mb-0.5">{content.architect}</span>
             <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wide">{t.builtIn} {content.builtIn}</span>
           </div>
        </div>

        {/* Description */}
        <div className="prose prose-invert">
           <p className="text-zinc-300 text-lg leading-relaxed font-light font-serif">
             <span className="text-4xl float-left mr-2 mt-[-10px] text-white font-serif">"</span>
             {content.description}
           </p>
        </div>
        
        {/* Fading bottom */}
        <div className="h-12"></div>
      </div>
    </div>
  );
};
