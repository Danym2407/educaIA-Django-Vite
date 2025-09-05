import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, LogIn } from 'lucide-react';
import CourseCarousel from '@/components/courses/CourseCarousel';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const CourseCatalogView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [courseToRedirect, setCourseToRedirect] = useState(null);

  // Formatea el curso recibido de Django
  const formatCourse = useCallback((course) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  category: course.category,
  tags: Array.isArray(course.tags)
    ? course.tags
    : (course.tags ? course.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []),
  duration: course.duration ? `${course.duration} min` : 'N/A',
  rating: course.rating || 0,
  coverImage: course.cover_image_url,
  trailerUrl: course.trailer_url || null,
  status: 'catalog',
  progress: 0,
}), []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }

    const filterParam = location.pathname.split('/').pop();
    if (['my-active', 'recommended', 'all'].includes(filterParam) && filterParam !== 'courses') {
      setActiveTab(filterParam);
    } else {
      setActiveTab('all');
      if(location.pathname === '/courses' || location.pathname === '/courses/') {
         navigate('/courses/all', { replace: true });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/courses/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (!response.ok) throw new Error('No se pudieron cargar los cursos');
        const data = await response.json();
        const formattedCourses = data.map(course => ({
          ...course,
          tags: Array.isArray(course.tags)
            ? course.tags
            : (course.tags ? course.tags.split(',') : []),
          coverImage: course.cover_image_url,
          enrolled: course.enrolled,     // <-- del backend
          completed: course.completed,   // <-- del backend
        }));
        setAllCourses(formattedCourses);
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setAllCourses([]);
      }
      setIsLoading(false);
    };
    fetchAllCourses();
  }, [formatCourse, toast]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCourseAccess = (courseId) => {
    if (!isAuthenticated) {
      setCourseToRedirect(courseId);
      setShowLoginModal(true);
    } else {
      navigate(`/courses/view/${courseId}`);
    }
  };

  const handlePlayTrailer = (trailerUrl) => {
    if (!trailerUrl) {
      toast({ title: "Sin Tráiler", description: "Este curso no tiene tráiler disponible.", variant: "destructive" });
      return;
    }
    window.open(trailerUrl, '_blank');
  };

  const filterCourses = (coursesToFilter) => {
    if (!searchTerm) return coursesToFilter;
    return coursesToFilter.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  };

  const displayedCourses = {
    all: filterCourses(allCourses),
    // Puedes implementar 'my-active' y 'recommended' según tu lógica de negocio
    'my-active': [],
    recommended: [],
  };

  const currentCategoryTitle = {
    all: "Catálogo Completo de Cursos",
    'my-active': "Mis Cursos Activos",
    recommended: "Cursos Recomendados para Ti"
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/courses/${value}`, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center"><LogIn className="mr-2 h-5 w-5 text-accent" /> Inicio de Sesión Requerido</DialogTitle>
            <DialogDescription>
              Para continuar, por favor inicia sesión o crea una cuenta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-4">
            <Button 
              type="button" 
              onClick={() => {
                setShowLoginModal(false);
                navigate('/auth', { state: { from: courseToRedirect ? `/courses/view/${courseToRedirect}` : location.pathname } });
              }}
              className="bg-accent hover:bg-accent/90"
            >
              Iniciar Sesión / Registrarse
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowLoginModal(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto py-10 px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Explora Nuestros Cursos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra la ruta de aprendizaje perfecta para ti, desde niveles principiantes hasta avanzados en diversas disciplinas.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Buscar cursos por título, categoría, etiqueta..."
              className="pl-10 pr-4 py-3 text-base h-12 w-full border-border focus:border-accent transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button variant="outline" className="h-12 text-base border-border hover:border-accent hover:text-accent transition-colors">
            <Filter className="mr-2 h-5 w-5" /> Filtrar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-8 bg-muted/60 rounded-lg">
            <TabsTrigger value="all" className="py-3 text-base data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-md">📚 Catálogo Completo</TabsTrigger>
            <TabsTrigger value="my-active" className="py-3 text-base data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-md" disabled={!isAuthenticated}>✅ Mis Cursos Activos</TabsTrigger>
            <TabsTrigger value="recommended" className="py-3 text-base data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-md">🔍 Recomendados</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value={activeTab} className="mt-0 min-h-[300px]">
                {displayedCourses[activeTab] && displayedCourses[activeTab].length > 0 ? (
                  <CourseCarousel
                    courses={displayedCourses[activeTab]}
                    onStartContinue={handleCourseAccess}
                    onSaveLater={() => {}} // Puedes implementar esta función si tienes lógica de guardado
                    onPlayTrailer={handlePlayTrailer}
                    title={currentCategoryTitle[activeTab]}
                    isAuthenticated={isAuthenticated}
                  />
                ) : (
                  <div className="text-center py-16 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-semibold text-primary mb-2">
                      {activeTab === 'my-active' && !isAuthenticated 
                        ? 'Inicia sesión para ver tus cursos' 
                        : 'No se encontraron cursos'}
                    </p>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {activeTab === 'my-active' && !isAuthenticated
                        ? 'Una vez que inicies sesión, tus cursos activos aparecerán aquí. ¡Explora el catálogo y empieza a aprender!'
                        : `Intenta ajustar tu búsqueda o explora otras categorías. ¡Siempre hay algo nuevo que aprender!`}
                    </p>
                    {activeTab === 'my-active' && !isAuthenticated && (
                      <Button onClick={() => {
                        setCourseToRedirect(null);
                        setShowLoginModal(true);
                      }} className="bg-accent hover:bg-accent/80">
                        <LogIn className="mr-2 h-4 w-4"/>
                        Iniciar Sesión
                      </Button>
                    )}
                     {activeTab !== 'my-active' && (
                        <Button onClick={() => { setActiveTab('all'); navigate('/courses/all') }} variant="outline">
                            Explorar Catálogo Completo
                        </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </>
  );
};

export default CourseCatalogView;