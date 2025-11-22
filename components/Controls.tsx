import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Maximize, Minimize, Volume2, VolumeX, X 
} from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  onClose: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onFullscreen,
  isFullscreen,
  audioRef,
  onClose
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  let timeoutRef = React.useRef<number | null>(null);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-hide controls logic
  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Exit Button (Always Visible on Hover) */}
       <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/20 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:rotate-90"
          title="Close Album"
        >
          <X size={20} />
        </button>

      {/* Bottom Control Bar */}
      <div 
        className={`absolute bottom-0 left-0 w-full p-6 md:p-10 flex justify-center transition-transform duration-700 ease-in-out z-40 ${
          showControls ? 'translate-y-0' : 'translate-y-32'
        }`}
      >
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-8 py-4 flex items-center gap-6 md:gap-8 text-white/90">
          
          {/* Navigation */}
          <div className="flex items-center gap-4 border-r border-white/20 pr-6">
            <button onClick={onPrev} className="hover:text-amber-400 transition-colors hover:scale-110">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={onPlayPause} 
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-amber-100 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={onNext} className="hover:text-amber-400 transition-colors hover:scale-110">
              <SkipForward size={20} />
            </button>
          </div>

          {/* Audio & Screen */}
          <div className="flex items-center gap-6">
            <button onClick={toggleMute} className="hover:text-amber-400 transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <button onClick={onFullscreen} className="hover:text-amber-400 transition-colors">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};