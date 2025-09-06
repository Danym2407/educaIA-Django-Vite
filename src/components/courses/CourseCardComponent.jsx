import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const CourseCardComponent = ({ course, onStartContinue }) => {
  const isEnrolled = course.isEnrolled ?? course.is_enrolled ?? false;
  const isCompleted = course.completed === true;
  const cardOpacity = isCompleted ? "opacity-60" : "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div
          className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer group h-full flex flex-col ${cardOpacity}`}
          whileHover={{ scale: 1.05, zIndex: 10 }}
          transition={{ duration: 0.2 }}
          onClick={() => onStartContinue(course)}
        >
          <Card className="w-full h-full border-transparent group-hover:border-accent transition-all duration-300 flex flex-col">
            <div className="aspect-[16/9] bg-muted flex items-center justify-center relative overflow-hidden">
              <img  
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                alt={course.title} 
                src={course.coverImage || "https://images.unsplash.com/photo-1697256200022-f61abccad430"} 
              />
              {course.progress > 0 && course.progress < 100 && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-200/70">
                  <div className="h-1.5 bg-accent" style={{ width: `${course.progress}%` }}></div>
                </div>
              )}
              {isCompleted && (
                <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center pointer-events-none">
                  <span className="text-green-800 font-bold text-lg">Curso finalizado</span>
                </div>
              )}
            </div>
            <CardHeader className="p-3 sm:p-4 flex-grow">
              <CardTitle className="text-sm sm:text-md font-semibold leading-tight group-hover:text-accent line-clamp-2">
                {course.title}
              </CardTitle>
              <div className="flex flex-wrap gap-1 mt-1 items-center">
                {/* Etiqueta FINALIZADO */}
                {isCompleted && (
                  <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full mr-1">Finalizado</span>
                )}
                {/* Etiqueta INSCRITO */}
                {!isCompleted && isEnrolled && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mr-1">Inscrito</span>
                )}
                {/* Etiqueta DISPONIBLE */}
                {!isCompleted && !isEnrolled && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-1">Disponible</span>
                )}
                {/* Progreso */}
                {typeof course.progress === 'number' && course.progress > 0 && (
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{course.progress.toFixed(0)}% Completado</span>
                )}
                {/* Tags */}
                {course.tags && course.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </PopoverTrigger>
      {/* ...PopoverContent igual que antes... */}
    </Popover>
  );
};

export default CourseCardComponent;