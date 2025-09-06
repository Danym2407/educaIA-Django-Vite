import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import YouTube from 'react-youtube';

const VideoPlayerWrapper = ({
  lesson,
  isPlaying,
  onPlayerReady,
  onStateChange,
}) => {
  const playerRef = useRef(null);

  // Guarda la referencia al player de YouTube
  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    if (onPlayerReady) onPlayerReady(event);
  };

  // Enviar progreso cada 10 segundos
  useEffect(() => {
    if (!lesson || !lesson.id) return;
    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentTime = Math.floor(playerRef.current.getCurrentTime());
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:8000/api/lesson-progress/${lesson.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ progress_seconds: currentTime })
        });
      }
    }, 1000); // cada 10 segundos

    return () => clearInterval(interval);
  }, [lesson]);

  // También puedes guardar al pausar o salir del video
  const handleStateChange = (event) => {
    if (onStateChange) onStateChange(event);
    // 2 = paused, 0 = ended
    if (event.data === 2 || event.data === 0) {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentTime = Math.floor(playerRef.current.getCurrentTime());
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:8000/api/lesson-progress/${lesson.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ progress_seconds: currentTime })
        });
      }
    }
  };

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
        onReady={handlePlayerReady}
        onStateChange={handleStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </motion.div>
  );
};

export default VideoPlayerWrapper;