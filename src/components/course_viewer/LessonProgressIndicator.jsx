
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const LessonProgressIndicator = ({
  watchedTime,
  currentLessonDuration,
  currentLessonProgressPercentage,
  isCurrentLessonCompleted,
  onMarkCompleted,
  formatTime,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-1">
        <span>Tiempo de visualización: {formatTime(watchedTime)} / {currentLessonDuration}</span>
        <span>{currentLessonProgressPercentage.toFixed(0)}% Visto</span>
      </div>
      <Progress value={currentLessonProgressPercentage} className="h-2 [&>div]:bg-accent" indicatorClassName="bg-accent" />
      
      {!isCurrentLessonCompleted && currentLessonProgressPercentage >= 90 && (
        <Button onClick={onMarkCompleted} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white mt-3 py-2 text-sm">
          Marcar como Completado
        </Button>
      )}
    </div>
  );
};

export default LessonProgressIndicator;
  