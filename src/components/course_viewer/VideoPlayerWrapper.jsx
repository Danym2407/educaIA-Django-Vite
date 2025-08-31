import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import YouTube from 'react-youtube';

const VideoPlayerWrapper = ({
  lesson,
  isPlaying,
  onPlayerReady,
  onStateChange,
}) => {
  // Puedes usar useRef si necesitas exponer el player fuera, pero con onPlayerReady basta usualmente

  if (!lesson || !lesson.videoId) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-video bg-black rounded-lg shadow-2xl overflow-hidden mb-4 flex items-center justify-center text-white"
      >
        <p>Video no disponible o seleccionando lección...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key={lesson.id} 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="aspect-video bg-black rounded-lg shadow-2xl overflow-hidden mb-4 relative"
    >
      <YouTube
        videoId={lesson.videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            showinfo: 0,
            cc_lang_pref: 'es',
            hl: 'es',
            enablejsapi: 1,
            origin: window.location.origin,
          }
        }}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </motion.div>
  );
};

export default VideoPlayerWrapper;