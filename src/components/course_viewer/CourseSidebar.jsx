import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, CheckCircle, Lock, Tv as TvMinimalPlay, BookOpen } from 'lucide-react';

const CourseSidebar = ({
  course,
  currentLesson,
  onLessonClick,
  overallProgress,
  isLessonLocked,
  isLessonCompleted,
  getModuleProgress,
  navigate,
  formatTime,
}) => {
  if (!course || !course.levels) {
    return (
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="w-full md:w-[30%] lg:w-[25%] h-full p-4 border-r border-border overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-background bg-card"
      >
        <p>Cargando estructura del curso...</p>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 50 }}
      className="w-full md:w-[35%] lg:w-[30%] xl:w-[25%] h-full p-4 border-r border-border overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-background bg-card text-card-foreground"
    >
      <Button variant="outline" onClick={() => navigate('/courses')} className="mb-4 w-full">
        <ChevronLeft className="mr-2 h-4 w-4" /> Volver a Cursos
      </Button>
      <div className="mb-6 p-3 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold text-primary mb-1">{course.title}</h2>
        <div className="mb-1">
          <Progress value={overallProgress} className="h-2 [&>div]:bg-accent" indicatorClassName="bg-accent" />
          <p className="text-xs text-muted-foreground mt-1">{overallProgress.toFixed(0)}% Completado del Curso</p>
        </div>
      </div>

      {course.levels.map((level) => (
        <div key={level.id} className="mb-6">
          <h3 className="text-lg font-medium text-accent mb-2 px-1">{level.name}</h3>
          {level.modules.map((module) => {
            const moduleProgress = getModuleProgress(module.id);
            return (
              <div key={module.id} className="mb-3 pl-2 border-l-2 border-muted-foreground/20 hover:border-accent transition-colors duration-200">
                <div className="px-1 py-1.5">
                  <h4 className="text-md font-normal text-primary mb-1 flex items-center">
                    <BookOpen size={16} className="mr-2 text-primary/70" />
                    {module.name}
                  </h4>
                  <Progress value={moduleProgress} className="h-1 my-1 [&>div]:bg-accent/80" indicatorClassName="bg-accent/80" />
                  <p className="text-xs text-muted-foreground">{moduleProgress.toFixed(0)}% del Módulo</p>
                </div>
                <ul className="space-y-1 mt-1">
                  {module.lessons.map((lesson) => {
                    const locked = isLessonLocked(lesson.id);
                    const completed = isLessonCompleted(lesson.id);
                    const isActive = currentLesson && lesson.id === currentLesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => onLessonClick(lesson)}
                          disabled={locked}
                          className={`w-full text-left p-2.5 rounded-md text-sm flex items-center justify-between transition-all duration-200 ease-in-out transform 
                            ${isActive ? 'bg-accent text-accent-foreground shadow-md scale-[1.02]' : 'hover:bg-muted/70 hover:text-foreground'}
                            ${locked ? 'opacity-60 cursor-not-allowed bg-muted/30' : ''}
                          `}
                        >
                          <span className="flex items-center flex-grow min-w-0">
                            {completed ? <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> :
                             locked ? <Lock className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" /> :
                             <TvMinimalPlay className="h-4 w-4 mr-2 text-primary/70 flex-shrink-0" />}
                            <span className="truncate" title={lesson.title}>{lesson.title}</span>
                          </span>
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{formatTime(lesson.duration)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </motion.aside>
  );
};

export default CourseSidebar;
