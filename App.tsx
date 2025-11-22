import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from './components/LandingPage';
import { MagazineSlide } from './components/MagazineSlide';
import { Controls } from './components/Controls';
import { MusicPlayer } from './components/MusicPlayer';
import { AlbumPhoto, ViewState } from './types';
import { DEFAULT_MUSIC_URL } from './constants';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string>(DEFAULT_MUSIC_URL);
  
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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

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

  // Sync fullscreen state if user uses Esc key
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return