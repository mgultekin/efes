
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { decodeAudioData } from "./audioService";
import { GroundingChunk, SuggestionResult } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // remove data:image/jpeg;base64, prefix
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Step 1: Identify Landmark (Vision)
// Requirement: gemini-3-pro-preview
export const identifyLandmark = async (imageFile: File, location?: { lat: number, lng: number }, lang: string = 'en'): Promise<string | null> => {
  const ai = getAiClient();
  const base64Data = await fileToGenerativePart(imageFile);

  // Using gemini-3-pro-preview as requested for "Analyze images"
  const modelId = 'gemini-3-pro-preview';

  let locationContext = "";
  if (location) {
    locationContext = `The user is currently located at coordinates: Latitude ${location.lat}, Longitude ${location.lng}. Use this location data to accurately confirm the identity of the landmark visible in the image, especially if it looks similar to other landmarks.`;
  }

  const langInstruction = lang === 'tr' 
    ? "Return the name in Turkish if it has a common Turkish name, otherwise use the original name." 
    : "Return the name in English.";

  const prompt = `
    Identify the landmark, building, or location in this image. 
    ${locationContext}
    ${langInstruction}
    Return ONLY the name of the place. 
    If it is not a recognized landmark, provide a short descriptive title of what is visible.
    Do not add periods or extra words like "This is...".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: imageFile.type, data: base64Data } },
          { text: prompt }
        ]
      }
    });

    const text = response.text?.trim();
    return text || null;
  } catch (error) {
    console.error("Identity Error:", error);
    throw new Error("Failed to identify image.");
  }
};

// Step 2: Get Details (Search + Maps Grounding)
// Requirement: gemini-2.5-flash with googleSearch AND googleMaps
export const getLandmarkDetails = async (
  landmarkName: string, 
  location?: { lat: number, lng: number },
  lang: string = 'en'
): Promise<{ 
  description: string, 
  sources: GroundingChunk[],
  mapInfo?: { rating?: string, address?: string, uri?: string },
  nearbyPlaces?: GroundingChunk[]
}> => {
  const ai = getAiClient();
  
  const modelId = 'gemini-2.5-flash';
  
  const langContext = lang === 'tr' 
    ? "Provide the response in Turkish." 
    : "Provide the response in English.";

  // Construct Prompt to leverage both Search and Maps
  const prompt = `
    Provide a fascinating, historical, and engaging summary of "${landmarkName}".
    Focus on interesting facts suitable for a tourist audio guide (approx 100 words).
    ${langContext}
    
    ALSO, use Google Maps to:
    1. Find the official rating and address of "${landmarkName}".
    2. Find 3 interesting places nearby (cafes, museums, or parks) that a tourist might like to visit next.
    
    Do not use markdown formatting like bold or headers in the description.
  `;

  // Config: Enable both Search and Maps
  const config: any = {
    tools: [
      { googleSearch: {} },
      { googleMaps: {} }
    ]
  };

  // If we have user location, pass it to Maps tool for better "nearby" context
  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng
        }
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: config
    });

    const text = response.text || "No information found.";
    
    // Extract grounding chunks
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const webSources: GroundingChunk[] = groundingChunks.filter((c: any) => c.web);
    const mapChunks: GroundingChunk[] = groundingChunks.filter((c: any) => c.maps);

    // Process Map Chunks
    // The primary landmark will likely match the name we searched for
    const primaryMap = mapChunks.find((c: any) => 
      c.maps?.title?.toLowerCase().includes(landmarkName.toLowerCase()) || 
      landmarkName.toLowerCase().includes(c.maps?.title?.toLowerCase())
    );

    // Others are likely "nearby" recommendations
    const nearbyPlaces = mapChunks.filter(c => c !== primaryMap).slice(0, 5);

    return {
      description: text,
      sources: webSources,
      mapInfo: primaryMap ? {
        uri: primaryMap.maps?.uri,
        address: undefined, 
        rating: undefined   
      } : undefined,
      nearbyPlaces: nearbyPlaces
    };
  } catch (error) {
    console.error("Details Error:", error);
    throw new Error("Failed to fetch details.");
  }
};

// Step 3: Generate Audio (TTS)
// Requirement: gemini-2.5-flash-preview-tts
export const generateNarration = async (text: string): Promise<AudioBuffer> => {
  const ai = getAiClient();
  const modelId = 'gemini-2.5-flash-preview-tts';

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data returned.");
    }

    // Use a temporary AudioContext to decode
    const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(base64Audio, tempCtx);
    tempCtx.close();

    return audioBuffer;
  } catch (error) {
    console.error("TTS Error:", error);
    throw new Error("Failed to generate speech.");
  }
};

// Suggestions Feature
export const getNearbySuggestions = async (lat: number, lng: number, lang: string = 'en'): Promise<SuggestionResult> => {
  const ai = getAiClient();
  const modelId = 'gemini-2.5-flash';

  const langInstruction = lang === 'tr' 
    ? "Output the title, introduction, and descriptions in Turkish." 
    : "Output in English.";

  const prompt = `
    Act as a premium travel editor and concierge. I am located at ${lat}, ${lng}.
    Find 4-5 distinct, high-quality places nearby (landmarks, cafes, parks, or hidden gems).
    ${langInstruction}
    
    You MUST return a valid JSON object with the following structure:
    {
      "title": "A catchy title for this collection",
      "introduction": "A short, atmospheric intro to the neighborhood (max 2 sentences)",
      "recommendations": [
        {
          "name": "The exact name of the place",
          "type": "A short category (e.g. Coffee Shop, Park, Historical Site)",
          "description": "An elegant, evocative sentence describing why it's special"
        }
      ]
    }
    
    Ensure the response is raw JSON without Markdown formatting.
    Use Google Maps to verify these real places.
  `;

  const config: any = {
    tools: [
      { googleMaps: {} }
    ],
    toolConfig: {
      retrievalConfig: {
        latLng: {
          latitude: lat,
          longitude: lng
        }
      }
    },
    // NOTE: responseMimeType and responseSchema are NOT supported when using Google Maps tool.
    // We must parse the text response manually.
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: config
    });

    let jsonText = response.text || "{}";
    
    // Clean up potential markdown code blocks (e.g. ```json ... ```)
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();

    let parsedData;
    try {
       parsedData = JSON.parse(jsonText);
    } catch (e) {
       console.warn("Failed to parse JSON suggestions, defaulting.", e);
       parsedData = { title: "Nearby Places", introduction: "Here are some places you might like.", recommendations: [] };
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Filter for map chunks
    const mapChunks: GroundingChunk[] = groundingChunks.filter((c: any) => c.maps);

    return {
      title: parsedData.title || "Nearby Suggestions",
      introduction: parsedData.introduction || "Here are some places you might like.",
      recommendations: Array.isArray(parsedData.recommendations) ? parsedData.recommendations : [],
      places: mapChunks
    };

  } catch (error) {
    console.error("Suggestions Error:", error);
    throw new Error("Failed to get suggestions.");
  }
};
