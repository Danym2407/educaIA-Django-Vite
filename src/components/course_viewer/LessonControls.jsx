
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlayCircle, PauseCircle } from 'lucide-react';

const LessonControls = ({
  currentLesson,
  isPlaying,
  onPlayPause,
  onPrevLesson,
  onNextLesson,
  isPrevLessonDisabled,
  isNextLessonDisabled,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <h1 className="text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-0 text-center sm:text-left truncate max-w-md" title={currentLesson?.title}>
        {currentLesson?.title || 'Cargando lección...'}
      </h1>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button variant="outline" size="icon" onClick={onPrevLesson} disabled={isPrevLessonDisabled} aria-label="Lección anterior">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="default"
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-3 sm:px-4 py-2 text-sm sm:text-base w-[100px] sm:w-[120px]"
          onClick={onPlayPause}
          disabled={!currentLesson}
        >
          {isPlaying ? <PauseCircle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> : <PlayCircle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />}
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </Button>
        <Button variant="outline" size="icon" onClick={onNextLesson} disabled={isNextLessonDisabled} aria-label="Siguiente lección">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default LessonControls;
  