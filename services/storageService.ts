
import { HistoryItem, LandmarkData } from '../types';

const STORAGE_KEY = 'lumina_history_v1';
const LANG_KEY = 'lumina_lang_pref';

export const saveToHistory = (data: LandmarkData, imageSrc: string): void => {
  try {
    const history = getHistory();
    
    // Avoid duplicates based on ID if present, or name
    const existingIndex = history.findIndex(h => h.name === data.name); // Simple de-dupe by name for now
    
    const newItem: HistoryItem = {
      id: data.id || crypto.randomUUID(),
      timestamp: Date.now(),
      name: data.name,
      description: data.description,
      imageSrc: imageSrc,
      sources: data.sources
    };

    if (existingIndex >= 0) {
      // Move to top if exists
      history.splice(existingIndex, 1);
    }
    
    // Add to beginning
    history.unshift(newItem);
    
    // Limit history to 20 items to prevent localStorage quota issues with base64 images
    const trimmedHistory = history.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (e) {
    console.error("Failed to save history:", e);
    // Handle quota exceeded or other errors silently for now
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Failed to load history:", e);
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const saveLanguage = (lang: string): void => {
  localStorage.setItem(LANG_KEY, lang);
};

export const getLanguage = (): string => {
  return localStorage.getItem(LANG_KEY) || 'en';
};
