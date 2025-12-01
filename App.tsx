import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from './components/LandingPage';
import { MagazineSlide } from './components/MagazineSlide';
import { Controls } from './components/Controls';
import { MusicPlayer } from './components/MusicPlayer';
import { AlbumPhoto, ViewState, Language } from './types';
import { DEFAULT_MUSIC_URL } from './constants';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string>(DEFAULT_MUSIC_URL);
  const [language, setLanguage] = useState<Language>('ko');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Start the slideshow with uploaded or demo photos and optional music
  const handleStart = (uploadedPhotos: AlbumPhoto[], musicUrl: string | null) => {
    setPhotos(uploadedPhotos);
    
    // If user uploaded music, use it. Otherwise fallback to default.
    if (musicUrl) {
      setCurrentMusicUrl(musicUrl);
    } else {
      setCurrentMusicUrl(DEFAULT_MUSIC_URL);
    }

    setViewState(ViewState.VIEWER);
    setCurrentIndex(0);
    
    // Slight delay to start music for effect
    setTimeout(() => setIsPlaying(true), 800);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleClose = () => {
    setIsPlaying(false);
    setViewState(ViewState.LANDING);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    if (viewState !== ViewState.VIEWER) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case ' ': // Spacebar
          e.preventDefault();
          handlePlayPause();
          break;
        case 'Escape':
          // Optional: handle close on escape if not fullscreen, 
          // but fullscreen api usually traps escape.
          if (!document.fullscreenElement) {
             // handleClose(); 
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewState, handleNext, handlePrev, handlePlayPause]);

  // Sync fullscreen state if user uses Esc key
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying && viewState === ViewState.VIEWER) {
      interval = window.setInterval(() => {
        handleNext();
      }, 6000); // 6 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewState, handleNext]);

  // Animation Variants for the slide transition - Clean Crossfade + Scale for full screen
  const slideVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 0.8, ease: "easeInOut" },
        scale: { duration: 1.2, ease: "easeOut" },
        filter: { duration: 0.8 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      opacity: 0,
      scale: 1, // Keep scale stable on exit
      transition: {
        opacity: { duration: 0.8, ease: "easeInOut" }
      }
    })
  };

  return (
    <div className="w-full h-screen bg-stone-950 text-white overflow-hidden font-sans">
      
      {/* Music Player Component (Invisible) */}
      <MusicPlayer 
        src={currentMusicUrl} 
        isPlaying={isPlaying} 
        audioRef={audioRef} 
      />

      {/* View State Management */}
      {viewState === ViewState.LANDING ? (
        <LandingPage 
          onStart={handleStart} 
          language={language}
          setLanguage={setLanguage}
        />
      ) : (
        <div className="relative w-full h-full bg-black touch-none"> 
          
          <AnimatePresence initial={false} custom={1} mode='sync'>
            <motion.div
              key={currentIndex}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x;
                if (swipe < -50) {
                  handleNext();
                } else if (swipe > 50) {
                  handlePrev();
                }
              }}
            >
              <MagazineSlide 
                photo={photos[currentIndex]} 
                index={currentIndex} 
                total={photos.length}
                isActive={true}
                language={language}
              />
            </motion.div>
          </AnimatePresence>

          <Controls 
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrev={handlePrev}
            onFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
            audioRef={audioRef}
            onClose={handleClose}
            language={language}
          />
        </div>
      )}
    </div>
  );
};

export default App;