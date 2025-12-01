import React from 'react';
import { motion } from 'framer-motion';
import { AlbumPhoto, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MagazineSlideProps {
  photo: AlbumPhoto;
  index: number;
  total: number;
  isActive: boolean;
  language: Language;
}

export const MagazineSlide: React.FC<MagazineSlideProps> = ({ photo, index, total, isActive, language }) => {
  // Layout logic: alternate alignment based on index for visual variety
  const isEven = index % 2 === 0;
  const t = TRANSLATIONS[language];
  
  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.5, duration: 1, ease: "easeOut" }
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-950">
      
      {/* Full Screen Image Background */}
      <div className="absolute inset-0 w-full h-full">
         {/* Image with slow zoom effect */}
         <motion.img 
            src={photo.url} 
            alt={photo.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }} 
         />
         
         {/* Gradient Overlay: Crucial for text readability over photos */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90"></div>
         
         {/* Cinematic Grain Overlay */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 lg:p-24 pb-32 md:pb-32">
        <div className={`flex flex-col ${isEven ? 'items-start' : 'items-end'} max-w-5xl ${isEven ? 'mr-auto' : 'ml-auto text-right'}`}>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="space-y-4 text-white"
            >
               {/* Date / Category Tag */}
               <div className={`flex items-center gap-4 mb-6 ${isEven ? '' : 'flex-row-reverse'}`}>
                  <span className="h-px w-12 md:w-20 bg-amber-200/70"></span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-amber-100/90 drop-shadow-md">
                    {photo.date || t.archive}
                  </span>
               </div>
               
               {/* Main Title */}
               <h2 className="text-5xl md:text-7xl lg:text-9xl font-serif italic font-medium leading-none tracking-tighter text-white drop-shadow-2xl">
                 {photo.name.split('.')[0]} 
               </h2>
               
               {/* Description / Caption */}
               <p className={`font-light text-stone-200 leading-relaxed text-lg md:text-2xl max-w-xl mt-8 drop-shadow-lg word-keep-all ${isEven ? '' : 'ml-auto'}`}>
                 {t.moment} {language === 'en' ? `, volume ${index + 1}.` : ''}
               </p>
            </motion.div>

            {/* Pagination / Footer Info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className={`mt-12 flex items-center gap-4 text-xs uppercase tracking-widest text-stone-400 ${isEven ? '' : 'flex-row-reverse'}`}
            >
               <span>{t.page} {index + 1} {t.of} {total}</span>
               <span className="w-1 h-1 bg-stone-400 rounded-full"></span>
               <span className="font-serif italic">{t.collection}</span>
            </motion.div>

        </div>
      </div>
    </div>
  );
};