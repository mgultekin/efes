import { useState, useEffect, useRef, useCallback } from 'react';

export enum PlaybackState {
  STOPPED,
  PLAYING,
  PAUSED
}

// Helper to decode raw PCM from Gemini TTS (PCM 24kHz usually, but let's check header or assume raw)
// The instructions imply raw PCM.
// Common sample rate for Gemini TTS is 24000Hz.
export const decodeAudioData = async (
  base64String: string,
  ctx: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Int16 conversion
  const dataInt16 = new Int16Array(bytes.buffer);
  const numChannels = 1;
  const sampleRate = 24000; // Standard for Gemini Live/TTS preview models
  const frameCount = dataInt16.length / numChannels;
  
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert Int16 to Float32 [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  
  return buffer;
};

export const useAudioPlayer = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(PlaybackState.STOPPED);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const initContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {
        // ignore if already stopped
      }
      sourceRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPlaybackState(PlaybackState.STOPPED);
    setCurrentTime(0);
  }, []);

  const playAudio = useCallback(async (buffer: AudioBuffer) => {
    // Stop any current playback
    stopAudio();

    const ctx = initContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    source.onended = () => {
      stopAudio();
    };

    sourceRef.current = source;
    setAudioDuration(buffer.duration);
    
    startTimeRef.current = ctx.currentTime;
    source.start();
    setPlaybackState(PlaybackState.PLAYING);

    const tick = () => {
      if (ctx && sourceRef.current) {
        const curr = ctx.currentTime - startTimeRef.current;
        if (curr <= buffer.duration) {
          setCurrentTime(curr);
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCurrentTime(buffer.duration);
        }
      }
    };
    tick();
  }, [stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAudio]);

  return {
    playAudio,
    stopAudio,
    playbackState,
    currentTime,
    audioDuration,
    audioContext: audioContextRef.current
  };
};