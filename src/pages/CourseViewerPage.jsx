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

// Nueva función para obtener el curso desde Django
const getCourseFromDjango = async (courseId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/courses/${courseId}/`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};

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

  // Si tu backend no tiene lecciones, esto quedará vacío
  const allLessonsFlatRef = useRef([]);

  const parseDuration = useCallback((durationStr) => {
    if (!durationStr || durationStr === 'N/A') return 0;
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  }, []);

  // Cambiado: ahora usa getCourseFromDjango
  const fetchAndSetCourseStructure = useCallback(async () => {
    setIsLoading(true);
    const courseData = await getCourseFromDjango(courseId);
    if (courseData) {
      setCourse(courseData);
      // Si tu backend no tiene lecciones, esto quedará vacío
      allLessonsFlatRef.current = [];
      setCurrentLesson(null);
    } else {
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

  // El resto de la lógica de progreso de lecciones se omite porque depende de la estructura de tu backend.
  // Puedes agregarla cuando tu backend tenga endpoints para progreso y lecciones.

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

  // Puedes mostrar los datos del curso aquí
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-var(--header-height,4rem))] bg-background text-foreground">
      <CourseSidebar 
        course={course}
        currentLesson={currentLesson}
        onLessonClick={() => {}} // Sin lecciones, esto queda vacío
        overallProgress={0}
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
          onPrevLesson={() => {}}
          onNextLesson={() => {}}
          isPrevLessonDisabled={true}
          isNextLessonDisabled={true}
        />
        <LessonProgressIndicator
          watchedTime={watchedTime}
          currentLessonDuration={currentLesson?.duration || 0}
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