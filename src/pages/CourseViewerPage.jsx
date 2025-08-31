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
import { getCourseByIdES } from '@/lib/courseData'; // IMPORTANTE

const CourseViewerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [watchedTime, setWatchedTime] = useState(0);
  const [lessonProgress, setLessonProgress] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Obtiene todas las lecciones en una lista plana (útil para next/prev)
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

  // Busca la siguiente lección (o null)
  const getNextLesson = (lessons, currentId) => {
    const idx = lessons.findIndex(l => l.id === currentId);
    return idx !== -1 && idx < lessons.length - 1 ? lessons[idx + 1] : null;
  };

  // Busca la lección anterior (o null)
  const getPrevLesson = (lessons, currentId) => {
    const idx = lessons.findIndex(l => l.id === currentId);
    return idx > 0 ? lessons[idx - 1] : null;
  };

  const fetchAndSetCourseStructure = useCallback(() => {
    setIsLoading(true);
    const courseData = getCourseByIdES(courseId);
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

  // Progreso de lección (simulado)
  const parseDuration = (durationStr) => {
    if (!durationStr || durationStr === 'N/A') return 0;
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  // Handlers de navegación de lecciones
  const allLessonsFlat = course ? getAllLessonsFlat(course) : [];
  const handlePrevLesson = () => {
    const prevLesson = getPrevLesson(allLessonsFlat, currentLesson?.id);
    if (prevLesson) setCurrentLesson(prevLesson);
  };
  const handleNextLesson = () => {
    const nextLesson = getNextLesson(allLessonsFlat, currentLesson?.id);
    if (nextLesson) setCurrentLesson(nextLesson);
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
        overallProgress={0} // Puedes calcular progreso real si implementas lógica
        isLessonLocked={() => false}
        isLessonCompleted={() => false}
        getModuleProgress={() => 0}
        navigate={navigate}
      />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full md:w-[65%] lg:w-[70%] xl:w-[75%] h-full flex flex-col p-3 sm:p-4 md:p-6 bg-muted/20 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-background"
      >
        <VideoPlayerWrapper lesson={currentLesson} isPlaying={isPlaying} playerRef={playerRef} />
        <LessonControls
          currentLesson={currentLesson}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onPrevLesson={handlePrevLesson}
          onNextLesson={handleNextLesson}
          isPrevLessonDisabled={!getPrevLesson(allLessonsFlat, currentLesson?.id)}
          isNextLessonDisabled={!getNextLesson(allLessonsFlat, currentLesson?.id)}
        />
        <LessonProgressIndicator
          watchedTime={watchedTime}
          currentLessonDuration={currentLesson ? parseDuration(currentLesson.duration) : 0}
          currentLessonProgressPercentage={0}
          isCurrentLessonCompleted={false}
          onMarkCompleted={() => {}}
          formatTime={(s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`}
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