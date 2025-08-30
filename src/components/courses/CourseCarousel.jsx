
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import CourseCardComponent from '@/components/courses/CourseCardComponent';

const CourseCarousel = ({ title, courses, onStartContinue, onSaveLater, onPlayTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const coursesPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; 
      if (window.innerWidth < 768) return 2; 
      if (window.innerWidth < 1024) return 3; 
      return 4; 
    }
    return 4; 
  };
  
  const [visibleCoursesCount, setVisibleCoursesCount] = useState(coursesPerPage());

  useEffect(() => {
    const handleResize = () => setVisibleCoursesCount(coursesPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = courses ? Math.ceil(courses.length / visibleCoursesCount) : 0;

  const handleNext = () => {
    if (courses) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }
  };

  const handlePrev = () => {
    if (courses) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
    }
  };
  
  const startIndex = currentIndex * visibleCoursesCount;
  const endIndex = startIndex + visibleCoursesCount;
  const currentCourses = courses ? courses.slice(startIndex, endIndex) : [];

  if (!courses || courses.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">{title}</h2>
        <p className="text-muted-foreground">No courses available in this section yet.</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
        {courses.length > visibleCoursesCount && (
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrev} disabled={totalPages <= 1}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} disabled={totalPages <= 1}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
      <div className={cn(
        "grid gap-4 sm:gap-6",
        `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
      )}>
        <AnimatePresence mode="popLayout">
          {currentCourses.map((course, index) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CourseCardComponent
                course={course}
                onStartContinue={onStartContinue}
                onSaveLater={onSaveLater}
                onPlayTrailer={onPlayTrailer}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseCarousel;
  