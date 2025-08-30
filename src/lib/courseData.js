export const placeholderCoursesDataES = [
  {
    id: '1',
    title: 'Introducción a la Inteligencia Artificial (Local)',
    description: 'Aprende los fundamentos de la IA y sus aplicaciones en el mundo real.',
    category: 'Inteligencia Artificial',
    tags: ['IA', 'Machine Learning', 'Principiantes'],
    duration: '6 semanas',
    rating: 4.5,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    status: 'catalog', 
    progress: 0,
    trailerUrl: 'https://www.youtube.com/watch?v=91fRWtamZpY',
    levels: [
      {
        id: 'level-1-local',
        name: 'Nivel Básico',
        description: 'Conceptos iniciales de IA.',
        order: 1,
        modules: [
          {
            id: 'module-1-1-local',
            name: 'Módulo 1: ¿Qué es la IA?',
            description: 'Fundamentos de la IA.',
            order: 1,
            lessons: [
              { id: 'lesson-1-1-1-local', title: 'Definición y Alcance', duration: '10:00', videoId: '91fRWtamZpY', order: 1 },
              { id: 'lesson-1-1-2-local', title: 'Historia de la IA', duration: '12:30', videoId: '91fRWtamZpY', order: 2 },
            ],
          },
        ],
      },
    ],
  },
];

// Nueva función usando fetch para Django API
export const getCourseStructureFromAPI = async (courseId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/courses/${courseId}/structure/`);
    if (!response.ok) throw new Error('No se pudo obtener la estructura del curso');
    const courseData = await response.json();

    const formatDuration = (totalSeconds) => {
      if (totalSeconds === null || totalSeconds === undefined) return 'N/A';
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getYouTubeVideoId = (url) => {
      if (!url) return 'dQw4w9WgXcQ'; 
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ'; 
    };

    const formattedCourse = {
      id: courseData.id,
      title: courseData.title,
      description: courseData.description,
      coverImage: courseData.cover_image_url,
      levels: (courseData.levels || []).sort((a, b) => a.order - b.order).map(level => ({
        id: level.id,
        name: level.title,
        description: level.description,
        order: level.order,
        modules: (level.modules || []).sort((a, b) => a.order - b.order).map(module => ({
          id: module.id,
          name: module.title,
          description: module.description,
          order: module.order,
          lessons: (module.lessons || []).sort((a, b) => a.order - b.order).map(lesson => ({
            id: lesson.id, 
            title: lesson.title,
            description: lesson.description,
            duration: formatDuration(lesson.duration), 
            videoId: getYouTubeVideoId(lesson.video_url), 
            order: lesson.order,
            video_url: lesson.video_url 
          }))
        }))
      }))
    };
    return formattedCourse;
  } catch (error) {
    console.error('Error fetching course structure from API:', error);
    return null;
  }
};

export const getCourseByIdES = (courseId) => {
  const course = placeholderCoursesDataES.find(c => c.id === courseId);
  if (course) return course;

  console.warn(`Course with ID ${courseId} not found in local placeholder data. Consider fetching from API.`);
  return {
    id: courseId,
    title: 'Curso no Encontrado (Local)',
    description: 'Este curso no se encontró en los datos locales.',
    category: 'Desconocido',
    tags: [],
    duration: 'N/A',
    rating: 0,
    coverImage: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    status: 'catalog',
    progress: 0,
    levels: [
      {
        id: 'level-error-local',
        name: 'Nivel Único',
        order: 1,
        modules: [
          {
            id: 'module-error-local',
            name: 'Módulo Único',
            order: 1,
            lessons: [
              { id: `${courseId}-error-1`, title: 'Lección de Ejemplo', duration: '05:00', videoId: 'dQw4w9WgXcQ', order: 1 },
            ],
          },
        ],
      },
    ],
  };
};

// ...existing code...

export const getCourseById = getCourseByIdES; // <-- Añade esta línea al final