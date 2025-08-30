
import React from 'react';
import { motion } from 'framer-motion';

const VideoPlayerWrapper = ({ lesson, isPlaying, playerRef }) => {
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
      <iframe
        ref={playerRef}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${lesson.videoId}?autoplay=${isPlaying ? 1:0}&rel=0&modestbranding=1&showinfo=0&cc_lang_pref=es&hl=es&enablejsapi=1&origin=${window.location.origin}`}
        title={lesson.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="border-0"
      ></iframe>
    </motion.div>
  );
};

export default VideoPlayerWrapper;
  