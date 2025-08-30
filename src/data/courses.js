
export const placeholderCoursesData = [
  { 
    id: '1', 
    title: 'Advanced JavaScript Mastery', 
    titleES: 'Dominio Avanzado de JavaScript',
    category: 'Programación', 
    tags: ['Avanzado', 'JS', 'Desarrollo Web'], 
    duration: '8 semanas', 
    rating: 4.8, 
    description: 'Deep dive into modern JavaScript, including ESNext features, patterns, and performance optimization.', 
    descriptionES: 'Profundiza en JavaScript moderno, incluyendo características ESNext, patrones y optimización de rendimiento.',
    thumbnailText: 'JS', 
    status: 'active', 
    progress: 60, 
    trailerUrl: 'https://www.youtube.com/watch?v=91fRWtamZpY',
    coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    levels: [
      { 
        name: 'Beginner', 
        nameES: 'Principiante',
        modules: [
          { name: 'Module 1: JS Fundamentals', nameES: 'Módulo 1: Fundamentos de JS', lessons: [
            { id: '1-1-1', title: 'Variables & Data Types', titleES: 'Variables y Tipos de Datos', duration: '10:32', completed: true, videoId: '91fRWtamZpY' }, 
            { id: '1-1-2', title: 'Operators & Expressions', titleES: 'Operadores y Expresiones', duration: '12:15', completed: true, videoId: 'W6NZfCO5SIk' }
          ]},
          { name: 'Module 2: Control Flow', nameES: 'Módulo 2: Flujo de Control', lessons: [
            { id: '1-2-1', title: 'Conditional Statements', titleES: 'Declaraciones Condicionales', duration: '15:05', completed: true, videoId: 'hdI2bqOjy3c' }, 
            { id: '1-2-2', title: 'Loops', titleES: 'Bucles', duration: '18:50', completed: false, videoId: '91fRWtamZpY' }
          ]}
        ]
      },
      {
        name: 'Intermediate',
        nameES: 'Intermedio',
        modules: [
          { name: 'Module 3: Functions & Scope', nameES: 'Módulo 3: Funciones y Ámbito', lessons: [
            { id: '1-3-1', title: 'Advanced Functions', titleES: 'Funciones Avanzadas', duration: '22:00', completed: false, videoId: 'W6NZfCO5SIk' }, 
            { id: '1-3-2', title: 'Closures & Scope', titleES: 'Closures y Ámbito', duration: '25:30', completed: false, videoId: 'hdI2bqOjy3c' }
          ]}
        ]
      }
    ]
  },
  { 
    id: '2', 
    title: 'AI for Creative Arts', 
    titleES: 'IA para Artes Creativas',
    category: 'IA', 
    tags: ['Principiante', 'IA', 'Arte'], 
    duration: '4 semanas', 
    rating: 4.5, 
    description: 'Explore how AI is transforming creative fields like music, visual arts, and writing. No coding required!', 
    descriptionES: 'Explora cómo la IA está transformando campos creativos como la música, las artes visuales y la escritura. ¡No se requiere codificación!',
    thumbnailText: 'IA Arte', 
    status: 'catalog', 
    progress: 0, 
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    levels: [
        {
            name: 'Introduction',
            nameES: 'Introducción',
            modules: [
                { name: 'Module 1: What is Creative AI?', nameES: 'Módulo 1: ¿Qué es la IA Creativa?', lessons: [
                    { id: '2-1-1', title: 'Defining Creative AI', titleES: 'Definiendo la IA Creativa', duration: '08:10', completed: false, videoId: '91fRWtamZpY' },
                    { id: '2-1-2', title: 'Examples in Art and Music', titleES: 'Ejemplos en Arte y Música', duration: '11:45', completed: false, videoId: 'W6NZfCO5SIk' }
                ]}
            ]
        }
    ]
  },
  { 
    id: '3', 
    title: 'Python for Data Science Bootcamp', 
    titleES: 'Bootcamp de Python para Ciencia de Datos',
    category: 'Ciencia de Datos', 
    tags: ['Intermedio', 'Python', 'Datos'], 
    duration: '12 semanas', 
    rating: 4.9, 
    description: 'Comprehensive bootcamp covering Python, Pandas, NumPy, Matplotlib, and Scikit-learn for data analysis.', 
    descriptionES: 'Bootcamp completo que cubre Python, Pandas, NumPy, Matplotlib y Scikit-learn para análisis de datos.',
    thumbnailText: 'Py DS', 
    status: 'active', 
    progress: 25, 
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    levels: [
        {
            name: 'Fundamentals',
            nameES: 'Fundamentos',
            modules: [
                { name: 'Module 1: Python Basics', nameES: 'Módulo 1: Bases de Python', lessons: [
                    { id: '3-1-1', title: 'Introduction to Python for DS', titleES: 'Introducción a Python para CD', duration: '14:00', completed: false, videoId: '91fRWtamZpY' }
                ]}
            ]
        }
    ]
  },
  { 
    id: '4', 
    title: 'Introduction to Quantum Computing', 
    titleES: 'Introducción a la Computación Cuántica',
    category: 'Ciencia', 
    tags: ['Avanzado', 'Física', 'Cuántica'], 
    duration: '6 semanas', 
    rating: 4.7, 
    description: 'Understand the fundamentals of quantum mechanics and how they apply to computing.', 
    descriptionES: 'Comprende los fundamentos de la mecánica cuántica y cómo se aplican a la computación.',
    thumbnailText: 'Quantum', 
    status: 'recommended', 
    progress: 0, 
    coverImage: 'https://images.unsplash.com/photo-1582719471384-894fbb165179' 
  },
  { 
    id: '5', 
    title: 'Mindfulness and Well-being', 
    titleES: 'Mindfulness y Bienestar',
    category: 'Desarrollo Personal', 
    tags: ['Todos los Niveles', 'Bienestar'], 
    duration: '3 semanas', 
    rating: 4.6, 
    description: 'Learn techniques for mindfulness, stress reduction, and improving overall well-being.', 
    descriptionES: 'Aprende técnicas de mindfulness, reducción de estrés y mejora del bienestar general.',
    thumbnailText: 'Wellness', 
    status: 'catalog', 
    progress: 0, 
    coverImage: 'https://images.unsplash.com/photo-1475906089153-644d9452ce97' 
  },
  { 
    id: '6', 
    title: 'Full-Stack Web Development with React & Node', 
    titleES: 'Desarrollo Web Full-Stack con React y Node',
    category: 'Programación', 
    tags: ['Intermedio', 'Full-Stack', 'React'], 
    duration: '16 semanas', 
    rating: 4.9, 
    description: 'Build and deploy modern web applications using the MERN stack.', 
    descriptionES: 'Construye y despliega aplicaciones web modernas usando el stack MERN.',
    thumbnailText: 'MERN', 
    status: 'recommended', 
    progress: 0, 
    coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd' 
  },
  { 
    id: '7', 
    title: 'Digital Marketing Fundamentals', 
    titleES: 'Fundamentos de Marketing Digital',
    category: 'Marketing', 
    tags: ['Principiante', 'SEO', 'Redes Sociales'], 
    duration: '5 semanas', 
    rating: 4.4, 
    description: 'Get started with digital marketing, covering SEO, content marketing, and social media strategies.', 
    descriptionES: 'Comienza con el marketing digital, cubriendo SEO, marketing de contenidos y estrategias de redes sociales.',
    thumbnailText: 'DM', 
    status: 'active', 
    progress: 80, 
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0' 
  },
  { 
    id: '8', 
    title: 'Game Design Principles', 
    titleES: 'Principios de Diseño de Videojuegos',
    category: 'Desarrollo de Videojuegos', 
    tags: ['Principiante', 'Diseño'], 
    duration: '7 semanas', 
    rating: 4.6, 
    description: 'Learn the core principles of game design, mechanics, and storytelling.', 
    descriptionES: 'Aprende los principios básicos del diseño de videojuegos, mecánicas y narrativa.',
    thumbnailText: 'GameDev', 
    status: 'catalog', 
    progress: 0, 
    coverImage: 'https://images.unsplash.com/photo-1580327344181-c11ac2a9690e' 
  },
];
  