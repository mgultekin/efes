
import React, { useRef, useEffect, useState } from 'react';
import { translations } from '../utils/translations';

interface ScannerProps {
  onCapture: (file: File, location?: { lat: number; lng: number }) => void;
  onClose: () => void;
  lang: string;
}

export const Scanner: React.FC<ScannerProps> = ({ onCapture, onClose, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  
  const t = translations[lang as keyof typeof translations];

  // Initialize Camera and Location
  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Request camera (prefer back camera for environment scanning)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setPermissionError(false);
      } catch (err) {
        console.error("Camera access error:", err);
        setPermissionError(true);
      }
    };

    const getLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.warn("Location access denied or failed:", error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    };

    startCamera();
    getLocation();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "photo_capture.jpg", { type: "image/jpeg" });
            onCapture(file, location);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCapture(e.target.files[0], location);
    }
  };

  return (
    <div className="relative h-full w-full bg-black overflow-hidden animate-in fade-in duration-300">
      
      {/* Hidden Elements */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />

      {/* Camera Viewfinder (Full Screen) */}
      {!permissionError ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-6 text-center bg-zinc-900">
          <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <p>{t.cameraAccessNeeded}</p>
          <button onClick={openGallery} className="mt-4 text-blue-400 font-medium">{t.useGallery}</button>
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 flex flex-col justify-between z-10 pointer-events-none">
        
        {/* Top Gradient & Header */}
        <div className="pt-12 pb-12 px-6 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-auto">
          <div className="text-zinc-300 font-semibold text-sm mb-1 tracking-wide drop-shadow-md">Lumina</div>
          <h1 className="text-4xl font-bold text-white leading-none tracking-tight drop-shadow-lg">
            {lang === 'tr' ? 'Yapıları' : 'Discover'} <br /> {lang === 'tr' ? 'Keşfet' : 'Landmarks'}
          </h1>
          {location && (
            <div className="mt-2 flex items-center space-x-1 text-xs text-green-400 font-medium bg-black/30 w-fit px-2 py-0.5 rounded-md backdrop-blur-md">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{t.gpsActive}</span>
            </div>
          )}
        </div>

        {/* Bottom Controls & Gradient */}
        <div className="w-full pb-10 pt-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-auto flex flex-col items-center">
          
          {/* Photo Mode Badge */}
          <div className="mb-8">
            <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
              <span className="text-[11px] font-bold text-white tracking-widest uppercase drop-shadow-sm">{t.photoMode}</span>
            </div>
          </div>

          {/* Control Buttons Row */}
          <div className="w-full flex items-center justify-between px-10">
            {/* Gallery Button */}
            <button 
              onClick={openGallery}
              className="w-12 h-12 bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center active:scale-95 transition-transform border border-white/10 hover:bg-black/50"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Shutter Button */}
            <button 
              onClick={takePhoto}
              disabled={permissionError}
              className="w-20 h-20 rounded-full border-[5px] border-white flex items-center justify-center active:scale-95 transition-transform duration-150 shadow-xl"
            >
              <div className="w-16 h-16 bg-white rounded-full border-[2px] border-zinc-300"></div>
            </button>

            {/* Close Button (Returns to Dashboard) */}
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center active:scale-95 transition-transform border border-white/10 hover:bg-black/50"
            >
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
