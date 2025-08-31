import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import CourseSidebar from '@/components/course_viewer/CourseSidebar';
import VideoPlayerWrapper from '@/components/course_viewer/VideoPlayerWrapper';
import LessonControls from '@/components/course_viewer/LessonControls';
import LessonProgressIndicator from '@/components/course_viewer/LessonProgressIndicator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCourseStructureFromAPI } from '@/lib/courseData';

const BACKEND_PROGRESS_URL = 'http://localhost:8000/api/lesson-progress';

const MIN_COMPLETE_PERCENTAGE = 0.9;

const CourseViewerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerInstance, setPlayerInstance] = useState(null);

  const [watchedTime, setWatchedTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const [lessonProgressMap, setLessonProgressMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const saveTimeout = useRef(null);

  // Helpers para estructura plana
  const getAllLessonsFlat = (courseData) => {
    if (!courseData?.levels) return [];
    let lessons = [];
    courseData.levels.forEach(level =>
      level.modules.forEach(module =>
        module.lessons.forEach(lesson =>
          lessons.push({ ...lesson, moduleId: module.id, levelId: level.id })
        )
      )
    );
    return lessons;
  };

  const getNextLesson = (lessons, currentId) => {
    const idx = lessons.findIndex(l => l.id === currentId);
    return idx !== -1 && idx < lessons.length - 1 ? lessons[idx + 1] : null;
  };

  const getPrevLesson = (lessons, currentId) => {
    const idx = lessons.findIndex(l => l.id === currentId);
    return idx > 0 ? lessons[idx - 1] : null;
  };

  // Cargar curso y seleccionar primera lección
  const fetchAndSetCourseStructure = useCallback(async () => {
    setIsLoading(true);
    const courseData = await getCourseStructureFromAPI(courseId);
    if (courseData && courseData.levels?.length) {
      setCourse(courseData);
      const flatLessons = getAllLessonsFlat(courseData);
      setCurrentLesson(flatLessons.length > 0 ? flatLessons[0] : null);
    } else {
      setCourse(null);
      setCurrentLesson(null);
      toast({ title: "Curso no encontrado", description: "No se pudo cargar la información del curso.", variant: "destructive" });
      navigate('/courses');
    }
    setIsLoading(false);
  }, [courseId, navigate, toast]);

  // Autenticación y carga inicial
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }
    setShowLoginModal(false);
    fetchAndSetCourseStructure();
  }, [courseId, isAuthenticated, authLoading, navigate, fetchAndSetCourseStructure]);

  // Al cambiar de lección, cargar progreso de Django únicamente
  useEffect(() => {
    if (!currentLesson || !isAuthenticated) return;
    fetch(`${BACKEND_PROGRESS_URL}/${currentLesson.id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setWatchedTime(data?.watched_time || 0);
        setLessonCompleted(data?.completed || false);
        setLessonProgressMap(prev => ({
          ...prev,
          [currentLesson.id]: {
            watchedTime: data?.watched_time || 0,
            completed: data?.completed || false,
          }
        }));
      });
    setIsPlaying(false);
    setVideoDuration(0);
    // No llames a playerInstance.stopVideo aquí
  }, [currentLesson, courseId, user, isAuthenticated]);

  // Debounce el guardado de progreso (cada 5 segundos o al marcar completado)
  useEffect(() => {
    if (!currentLesson || !isAuthenticated) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      fetch(`${BACKEND_PROGRESS_URL}/${currentLesson.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          watched_time: Math.round(watchedTime),
          completed: lessonCompleted,
        }),
      });
      setLessonProgressMap(prev => ({
        ...prev,
        [currentLesson.id]: { watchedTime, completed: lessonCompleted }
      }));
    }, lessonCompleted ? 200 : 5000);

    return () => clearTimeout(saveTimeout.current);
  }, [watchedTime, lessonCompleted, currentLesson, isAuthenticated]);

  // Interval para actualizar watchedTime localmente y marcar completado SOLO si vio el 90%+
  useEffect(() => {
    let interval;
    if (playerInstance && isPlaying) {
      interval = setInterval(() => {
        const current = playerInstance.getCurrentTime();
        setWatchedTime(current);
        const duration = playerInstance.getDuration();
        setVideoDuration(duration);
        // Solo marcar completado si vio al menos el 90% del video
        if (
          duration > 0 &&
          current / duration >= MIN_COMPLETE_PERCENTAGE &&
          !lessonCompleted
        ) {
          setLessonCompleted(true);
          setIsPlaying(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playerInstance, isPlaying, lessonCompleted]);

  // Avance automático SÓLO cuando lessonCompleted pase de false a true
  useEffect(() => {
    if (lessonCompleted) {
      const flatLessons = getAllLessonsFlat(course);
      const idx = flatLessons.findIndex(l => l.id === currentLesson.id);
      if (idx !== -1 && idx < flatLessons.length - 1) {
        setTimeout(() => setCurrentLesson(flatLessons[idx + 1]), 1300);
        toast({ title: "¡Lección completada!", description: "Avanzando a la siguiente lección..." });
      } else if (idx !== -1 && idx === flatLessons.length - 1) {
        toast({ title: "¡Curso finalizado!", description: "¡Felicidades, has terminado el curso!" });
      }
    }
  }, [lessonCompleted, course, currentLesson, toast]);

  // Helper para saber si un módulo está terminado
  const getLessonProgress = (lessonId) => lessonProgressMap[lessonId] || { watchedTime: 0, completed: false };
  const isModuleCompleted = (module) => {
    return module.lessons.every(lesson => getLessonProgress(lesson.id).completed);
  };

// Progreso de módulo: % lecciones completadas en ese módulo
// Helper para saber el progreso de cada módulo (ya lo tienes)
const getModuleProgress = (moduleId) => {
  if (!course) return 0;
  const module = course.levels.flatMap(l => l.modules).find(m => m.id === moduleId);
  if (!module) return 0;
  const total = module.lessons.length;
  const completed = module.lessons.filter(lesson => getLessonProgress(lesson.id).completed).length;
  return total ? (completed / total) * 100 : 0;
};

// Progreso del curso: promedio del % de avance de cada módulo
const overallProgress = (() => {
  if (!course) return 0;
  const allModules = course.levels.flatMap(l => l.modules);
  if (allModules.length === 0) return 0;
  const sumModuleProgress = allModules.reduce((sum, module) => {
    const total = module.lessons.length;
    const completed = module.lessons.filter(lesson => getLessonProgress(lesson.id).completed).length;
    return sum + (total ? (completed / total) : 0);
  }, 0);
  return (sumModuleProgress / allModules.length) * 100;
})();

  // Navegación entre lecciones
  const allLessonsFlat = course ? getAllLessonsFlat(course) : [];
  const handlePrevLesson = () => {
    const prevLesson = getPrevLesson(allLessonsFlat, currentLesson?.id);
    if (prevLesson) setCurrentLesson(prevLesson);
  };
  const handleNextLesson = () => {
    const nextLesson = getNextLesson(allLessonsFlat, currentLesson?.id);
    if (nextLesson) setCurrentLesson(nextLesson);
  };

  // Player handlers (para react-youtube o integración similar)
  const handlePlayerReady = (event) => {
    setPlayerInstance(event.target);
    setVideoDuration(event.target.getDuration());
    if (watchedTime > 0) {
      setTimeout(() => event.target.seekTo(watchedTime, true), 500);
    }
  };

  const handlePlayPause = () => {
    if (!playerInstance) return;
    if (isPlaying) {
      playerInstance.pauseVideo();
    } else {
      playerInstance.playVideo();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleStateChange = (event) => {
    if (event.data === 0 && videoDuration && watchedTime / videoDuration >= MIN_COMPLETE_PERCENTAGE && !lessonCompleted) {
      setLessonCompleted(true);
      setIsPlaying(false);
    }
  };

  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen bg-background"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent"></div></div>;
  }

  if (showLoginModal) {
    return (
      <Dialog open={showLoginModal} onOpenChange={(isOpen) => { if(!isOpen) navigate('/courses'); else setShowLoginModal(isOpen); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inicio de Sesión Requerido</DialogTitle>
            <DialogDescription>
              Para acceder al contenido del curso, por favor inicia sesión o crea una cuenta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button type="button" onClick={() => navigate('/auth', { state: { from: location } })}>
              Iniciar Sesión / Registrarse
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/courses')}>
              Volver a Cursos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isAuthenticated || !course) {
    return <div className="flex justify-center items-center h-screen bg-background"><p className="text-foreground">Cargando datos del curso o información de usuario no disponible...</p></div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-var(--header-height,4rem))] bg-background text-foreground">
      <CourseSidebar 
        course={course}
        currentLesson={currentLesson}
        onLessonClick={setCurrentLesson}
        overallProgress={overallProgress}
        isLessonLocked={() => false}
        isLessonCompleted={lessonId => getLessonProgress(lessonId).completed}
        getModuleProgress={getModuleProgress}
        navigate={navigate}
      />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full md:w-[65%] lg:w-[70%] xl:w-[75%] h-full flex flex-col p-3 sm:p-4 md:p-6 bg-muted/20 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-background"
      >
        <VideoPlayerWrapper
          lesson={currentLesson}
          isPlaying={isPlaying}
          onPlayerReady={handlePlayerReady}
          onStateChange={handleStateChange}
        />
        <LessonControls
          currentLesson={currentLesson}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onPrevLesson={handlePrevLesson}
          onNextLesson={handleNextLesson}
          isPrevLessonDisabled={!getPrevLesson(allLessonsFlat, currentLesson?.id)}
          isNextLessonDisabled={!lessonCompleted}
        />
        <LessonProgressIndicator
          watchedTime={watchedTime}
          currentLessonDuration={Math.floor(videoDuration)}
          currentLessonProgressPercentage={videoDuration ? (watchedTime / videoDuration) * 100 : 0}
          isCurrentLessonCompleted={lessonCompleted}
          onMarkCompleted={() => setLessonCompleted(true)}
          formatTime={(s) => `${Math.floor(s / 60)}:${(Math.floor(s) % 60).toString().padStart(2, '0')}`}
        />
        <div className="mt-auto pt-4 text-xs text-muted-foreground text-center">
          <p>El contenido del video es para fines de demostración. El contenido real del curso variará.</p>
          <p>&copy; {new Date().getFullYear()} educaIA. Todos los derechos reservados.</p>
        </div>
      </motion.main>
    </div>
  );
};

export default CourseViewerPage;