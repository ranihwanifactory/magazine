import React, { useEffect } from 'react';

interface MusicPlayerProps {
  src: string;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ src, isPlaying, audioRef }) => {
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Handle promise rejection for autoplay policies
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Auto-play prevented:", error);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioRef]);

  return (
    <audio 
      ref={audioRef} 
      src={src} 
      loop 
      className="hidden" 
      preload="auto"
    />
  );
};