import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Music, Globe } from 'lucide-react';
import { AlbumPhoto, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LandingPageProps {
  onStart: (photos: AlbumPhoto[], musicUrl: string | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, language, setLanguage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const [selectedMusic, setSelectedMusic] = useState<File | null>(null);
  const t = TRANSLATIONS[language];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: AlbumPhoto[] = Array.from(files).map((file: File) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      name: file.name,
      date: new Date(file.lastModified).toLocaleDateString(),
    }));

    // Generate music URL if a file was selected
    const musicUrl = selectedMusic ? URL.createObjectURL(selectedMusic) : null;

    onStart(newPhotos, musicUrl);
  };

  const handleMusicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMusic(file);
    }
  };

  const handleDemoStart = () => {
    const demoPhotos: AlbumPhoto[] = [
      { id: '1', url: 'https://picsum.photos/1920/1080?random=10', name: 'Summer Vacation', date: 'June 2023' },
      { id: '2', url: 'https://picsum.photos/1920/1080?random=11', name: 'Family Dinner', date: 'August 2023' },
      { id: '3', url: 'https://picsum.photos/1920/1080?random=12', name: 'The Portrait', date: 'September 2023' },
      { id: '4', url: 'https://picsum.photos/1920/1080?random=13', name: 'Landscape', date: 'October 2023' },
    ];
    onStart(demoPhotos, null);
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ko' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f0] text-stone-800 p-6 relative overflow-hidden">
      
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 hover:border-stone-900 transition-colors uppercase text-xs font-bold tracking-widest bg-white/50 backdrop-blur-sm"
        >
          <Globe size={14} />
          <span className={language === 'en' ? 'text-black' : 'text-stone-400'}>EN</span>
          <span className="text-stone-300">|</span>
          <span className={language === 'ko' ? 'text-black' : 'text-stone-400'}>KO</span>
        </button>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none z-0">
         <div className="absolute top-10 left-10 text-[10rem] serif italic">L</div>
         <div className="absolute bottom-10 right-10 text-[10rem] serif italic">M</div>
      </div>

      <div className="z-10 max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <p className="text-sm tracking-[0.3em] uppercase text-stone-500 font-bold">{t.subtitle}</p>
          <h1 className="text-6xl md:text-8xl serif italic font-semibold text-stone-900 leading-tight">
            Lumière
          </h1>
          <div className="h-px w-24 bg-stone-400 mx-auto mt-6"></div>
          <p className="text-xl font-light text-stone-600 italic max-w-md mx-auto word-keep-all">
            {t.description}
          </p>
        </div>

        <div className="space-y-8 w-full max-w-lg mx-auto">
          
          {/* Music Selection */}
          <div className="flex flex-col items-center justify-center">
             <button 
               onClick={() => musicInputRef.current?.click()}
               className="flex items-center gap-2 text-stone-500 hover:text-amber-700 transition-colors text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-amber-700 pb-1"
             >
               <Music size={14} />
               {selectedMusic ? `${t.selectedMusic}: ${selectedMusic.name}` : t.selectMusic}
             </button>
             <input 
               type="file" 
               ref={musicInputRef}
               className="hidden"
               accept="audio/*"
               onChange={handleMusicChange}
             />
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-40 bg-white border border-stone-200 shadow-sm hover:shadow-xl hover:border-stone-400 transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-stone-900 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-5"></div>
              <Upload className="w-8 h-8 text-stone-700 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-lg z-10">{t.upload}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 z-10">{t.start}</span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </button>

            <button
              onClick={handleDemoStart}
              className="group relative h-40 bg-stone-900 text-stone-50 border border-stone-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300 opacity-10"></div>
               <ImageIcon className="w-8 h-8 text-stone-200 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-lg z-10">{t.demo}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 mt-12">
          <p className="text-xs text-stone-400 uppercase tracking-widest">
            {t.established} &bull; {t.volume}
          </p>
          <a 
            href="https://ranihwanibaby.tistory.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 font-medium"
          >
            {(t as any).blog}
          </a>
        </div>
      </div>
    </div>
  );
};
