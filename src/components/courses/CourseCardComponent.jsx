import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Star, Clock, PlayCircle, Bookmark } from 'lucide-react';

const statusLabel = (status) => {
  switch (status) {
    case 'active':
      return <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mr-1">Suscrito</span>;
    case 'catalog':
      return <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full mr-1">Disponible</span>;
    case 'recommended':
      return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-1">Recomendado</span>;
    default:
      return null;
  }
};

const CourseCardComponent = ({ course, onStartContinue, onSaveLater, onPlayTrailer }) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div
          className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group h-full flex flex-col"
          whileHover={{ scale: 1.05, zIndex: 10 }}
          transition={{ duration: 0.2 }}
          onClick={() => onStartContinue(course.id)}
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
            </div>
            <CardHeader className="p-3 sm:p-4 flex-grow">
              <CardTitle className="text-sm sm:text-md font-semibold leading-tight group-hover:text-accent line-clamp-2">
                {course.title}
              </CardTitle>
              {/* STATUS + PROGRESS */}
              <div className="flex flex-wrap gap-1 mt-1 items-center">
                {statusLabel(course.status)}
                {typeof course.progress === 'number' && course.progress > 0 && (
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{course.progress.toFixed(0)}% Completado</span>
                )}
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
      <PopoverContent 
        className="w-80 p-0 shadow-xl border-accent" 
        side="bottom" 
        align="start" 
        onOpenAutoFocus={(e) => e.preventDefault()} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-[16/9] bg-muted flex items-center justify-center relative overflow-hidden">
          <img  
            className="w-full h-full object-cover" 
            alt={`${course.title} vista detallada`} 
            src={course.coverImage || "https://images.unsplash.com/photo-1697256200022-f61abccad430"} 
          />
          {course.trailerUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={(e) => { e.stopPropagation(); onPlayTrailer(course.trailerUrl); }}
              aria-label="Reproducir tráiler"
            >
              <PlayCircle className="h-6 w-6" />
            </Button>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-bold text-primary">{course.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground space-x-3">
            {course.duration && <span className="flex items-center"><Clock className="mr-1 h-4 w-4" /> {course.duration}</span>}
            {course.rating && <span className="flex items-center"><Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" /> {course.rating}</span>}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{course.description}</p>
          <div className="flex items-center justify-between pt-2">
            <Button 
              onClick={(e) => { e.stopPropagation(); onStartContinue(course.id); }} 
              className="bg-accent hover:bg-accent/90 text-accent-foreground w-full mr-2"
            >
              {course.progress > 0 ? 'Continuar Aprendiendo' : 'Comenzar Curso'}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onSaveLater(course.id); }} 
              aria-label="Guardar para después"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CourseCardComponent;