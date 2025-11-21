
import React, { useState, useCallback, useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { LoadingScan } from './components/LoadingScan';
import { ResultCard } from './components/ResultCard';
import { HistoryView } from './components/HistoryView';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SuggestionsView } from './components/SuggestionsView';
import { DailyView } from './components/DailyView';
import { BottomNavigation } from './components/BottomNavigation';
import { identifyLandmark, getLandmarkDetails, generateNarration, getNearbySuggestions } from './services/geminiService';
import { saveToHistory, getHistory, getLanguage, saveLanguage } from './services/storageService';
import { LandmarkData, HistoryItem, SuggestionResult } from './types';
import { PlaybackState, useAudioPlayer } from './services/audioService';
import { translations } from './utils/translations';

enum AppState {
  LANDING = 'LANDING',
  IDLE = 'IDLE', // Dashboard (Home Tab)
  DAILY = 'DAILY', // Daily Discovery Tab
  HISTORY = 'HISTORY',
  SUGGESTIONS = 'SUGGESTIONS', 
  SCANNING = 'SCANNING',
  ANALYZING_IMAGE = 'ANALYZING_IMAGE',
  FETCHING_INFO = 'FETCHING_INFO',
  GENERATING_AUDIO = 'GENERATING_AUDIO',
  FETCHING_SUGGESTIONS = 'FETCHING_SUGGESTIONS',
  SHOW_RESULT = 'SHOW_RESULT',
  ERROR = 'ERROR'
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [landmarkData, setLandmarkData] = useState<LandmarkData | null>(null);
  const [suggestionData, setSuggestionData] = useState<SuggestionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isGeneratingAudioDelayed, setIsGeneratingAudioDelayed] = useState(false);
  const [lang, setLang] = useState<string>('en');
  
  const { playAudio, stopAudio, playbackState, audioDuration, currentTime } = useAudioPlayer();

  // Load history and language
  useEffect(() => {
    setHistoryItems(getHistory());
    setLang(getLanguage());
  }, [appState]);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'tr' : 'en';
    setLang(newLang);
    saveLanguage(newLang);
  };

  const handleTabChange = (tab: 'home' | 'daily') => {
    if (tab === 'home') setAppState(AppState.IDLE);
    if (tab === 'daily') setAppState(AppState.DAILY);
  };

  const handleImageCapture = useCallback(async (file: File, location?: { lat: number; lng: number }) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      // Step 1: Identify
      setAppState(AppState.ANALYZING_IMAGE);
      const identity = await identifyLandmark(file, location, lang);
      
      if (!identity) {
        throw new Error("Could not identify a landmark in this image.");
      }

      // Step 2: Search Details
      setAppState(AppState.FETCHING_INFO);
      const details = await getLandmarkDetails(identity, location, lang);

      // Step 3: Generate Audio
      setAppState(AppState.GENERATING_AUDIO);
      const audioBuffer = await generateNarration(details.description);

      const data: LandmarkData = {
        id: crypto.randomUUID(),
        name: identity,
        description: details.description,
        sources: details.sources,
        mapInfo: details.mapInfo,
        nearbyPlaces: details.nearbyPlaces,
        audioBuffer: audioBuffer
      };

      setLandmarkData(data);
      setAppState(AppState.SHOW_RESULT);
      
      // Save to history
      const base64 = await new Promise<string>((resolve) => {
         const r = new FileReader();
         r.onload = () => resolve(r.result as string);
         r.readAsDataURL(file);
      });
      
      saveToHistory(data, base64);

    } catch (err: any) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  }, [lang]);

  const handleGenerateAudioForHistory = useCallback(async () => {
    if (!landmarkData || landmarkData.audioBuffer) return;
    
    try {
      setIsGeneratingAudioDelayed(true);
      const audioBuffer = await generateNarration(landmarkData.description);
      
      setLandmarkData(prev => prev ? { ...prev, audioBuffer } : null);
      setIsGeneratingAudioDelayed(false);
      playAudio(audioBuffer);
    } catch (e) {
      console.error("Failed to generate audio", e);
      setIsGeneratingAudioDelayed(false);
    }
  }, [landmarkData, playAudio]);

  const handleExploreSuggestions = useCallback(async () => {
    setAppState(AppState.FETCHING_SUGGESTIONS);
    
    if (!('geolocation' in navigator)) {
      setErrorMsg("Geolocation is not supported by this browser.");
      setAppState(AppState.ERROR);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const result = await getNearbySuggestions(latitude, longitude, lang);
        setSuggestionData(result);
        setAppState(AppState.SUGGESTIONS);
      } catch (err: any) {
         console.error(err);
         const msg = err instanceof Error ? err.message : String(err);
         setErrorMsg(msg || "Failed to fetch suggestions. Please try again.");
         setAppState(AppState.ERROR);
      }
    }, (err) => {
       console.error(err);
       setErrorMsg("Location access required to find nearby places.");
       setAppState(AppState.ERROR);
    }, { timeout: 10000 });

  }, [lang]);

  const handleHistorySelect = (item: HistoryItem) => {
    stopAudio();
    setImagePreview(item.imageSrc);
    setLandmarkData({
      id: item.id,
      name: item.name,
      description: item.description,
      sources: item.sources,
      mapInfo: item.mapInfo,
      nearbyPlaces: item.nearbyPlaces,
      audioBuffer: undefined 
    });
    setAppState(AppState.SHOW_RESULT);
  };

  const handleReset = useCallback(() => {
    stopAudio();
    setAppState(AppState.IDLE);
    setImageFile(null);
    setImagePreview(null);
    setLandmarkData(null);
    setErrorMsg('');
    setIsGeneratingAudioDelayed(false);
  }, [stopAudio]);

  const t = translations[lang as keyof typeof translations] || translations.en;

  const showBottomNav = appState === AppState.IDLE || appState === AppState.DAILY;

  return (
    <div className="relative h-screen w-full flex flex-col bg-black text-white overflow-hidden">
      
      {/* Global Header (Hidden for main views) */}
      {(appState !== AppState.LANDING && !showBottomNav && appState !== AppState.HISTORY && appState !== AppState.SCANNING && appState !== AppState.SHOW_RESULT && appState !== AppState.SUGGESTIONS) && (
        <header className="absolute top-0 left-0 w-full h-[60px] z-50 flex justify-between items-center px-6 pt-2 ios-blur bg-black/40 border-b border-white/5">
          <div className="font-semibold text-lg tracking-tight">Lumina</div>
          <button 
            onClick={handleReset} 
            className="text-blue-500 text-base font-normal active:opacity-50 transition-opacity"
          >
            {t.cancel}
          </button>
        </header>
      )}

      <main className="flex-1 w-full h-full relative">
        
        {appState === AppState.LANDING && (
          <LandingPage 
            onStart={() => setAppState(AppState.IDLE)} 
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        )}

        {appState === AppState.IDLE && (
          <Dashboard 
            onScan={() => setAppState(AppState.SCANNING)}
            onHistory={() => setAppState(AppState.HISTORY)}
            onExplore={handleExploreSuggestions}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        )}

        {appState === AppState.DAILY && (
          <DailyView lang={lang} />
        )}

        {appState === AppState.HISTORY && (
          <HistoryView 
            items={historyItems}
            onSelect={handleHistorySelect}
            onScan={() => setAppState(AppState.SCANNING)}
            onBack={() => setAppState(AppState.IDLE)}
            lang={lang}
          />
        )}

        {appState === AppState.SUGGESTIONS && suggestionData && (
          <SuggestionsView 
            data={suggestionData}
            onBack={() => setAppState(AppState.IDLE)}
            lang={lang}
          />
        )}

        {appState === AppState.SCANNING && (
          <Scanner 
            onCapture={handleImageCapture} 
            onClose={() => setAppState(AppState.IDLE)}
            lang={lang}
          />
        )}

        {(appState === AppState.ANALYZING_IMAGE || 
          appState === AppState.FETCHING_INFO || 
          appState === AppState.GENERATING_AUDIO || 
          appState === AppState.FETCHING_SUGGESTIONS) && (
          <LoadingScan 
            imageSrc={imagePreview} 
            state={appState}
            lang={lang}
          />
        )}

        {appState === AppState.SHOW_RESULT && landmarkData && imagePreview && (
          <ResultCard 
            imageSrc={imagePreview}
            data={landmarkData}
            playbackState={playbackState}
            currentTime={currentTime}
            duration={audioDuration}
            isGeneratingAudio={isGeneratingAudioDelayed}
            onPlay={() => landmarkData.audioBuffer && playAudio(landmarkData.audioBuffer)}
            onStop={stopAudio}
            onGenerateAudio={handleGenerateAudioForHistory}
            onBack={handleReset}
            lang={lang}
          />
        )}

        {appState === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t.operationFailed}</h3>
              <p className="text-zinc-400 text-sm mb-10 max-w-xs leading-relaxed break-words">{errorMsg}</p>
              <button 
                onClick={handleReset}
                className="w-full max-w-xs py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors active:scale-95 transform duration-200"
              >
                {t.goBack}
              </button>
            </div>
        )}

      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomNavigation 
          activeTab={appState === AppState.IDLE ? 'home' : 'daily'} 
          onTabChange={handleTabChange} 
          lang={lang}
        />
      )}
    </div>
  );
};

export default App;
