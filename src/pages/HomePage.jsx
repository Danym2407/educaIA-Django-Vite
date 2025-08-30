import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen, Cpu, Users, Search, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import CourseCarousel from '@/components/courses/CourseCarousel';

const FeatureCard = ({ icon, title, description, link, linkText }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="h-full hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex-row items-center pb-4">
        {React.cloneElement(icon, { className: "h-10 w-10 text-accent mr-4" })}
        <CardTitle className="text-2xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      {link && linkText && (
        <CardContent>
          <Button asChild variant="link" className="p-0 text-accent">
            <Link to={link}>{linkText} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardContent>
      )}
    </Card>
  </motion.div>
);

const TestimonialCard = ({ quote, author, role, avatar }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
    className="bg-secondary p-6 rounded-lg shadow-lg"
  >
    <blockquote className="text-lg italic text-primary mb-4">"{quote}"</blockquote>
    <div className="flex items-center">
      <img  src={avatar} alt={author} className="w-12 h-12 rounded-full mr-4 object-cover" />
      <div>
        <p className="font-semibold text-primary">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

useEffect(() => {
  const fetchTrendingCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const response = await fetch('http://localhost:8000/api/courses/');
      if (!response.ok) throw new Error('No se pudieron cargar los cursos populares');
      const data = await response.json();
      const formattedCourses = data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        tags: course.tags ? course.tags.split(',') : [],
        duration: course.duration,
        rating: course.rating,
        coverImage: course.cover_image_url, // <-- mapeo correcto
        progress: 0,
        status: 'catalog',
      }));
      setTrendingCourses(formattedCourses);
    } catch (error) {
      toast({
        title: 'Error al Cargar Cursos',
        description: 'No se pudieron cargar los cursos populares. Intenta de nuevo más tarde.',
        variant: 'destructive',
      });
      setTrendingCourses([]);
    }
    setIsLoadingCourses(false);
  };

  fetchTrendingCourses();
}, [toast]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      toast({
        title: "Búsqueda Vacía",
        description: "Por favor, ingresa un término de búsqueda.",
        variant: "destructive"
      });
    }
  };
  
  const handleCourseAccess = (courseId) => {
    navigate(`/courses/view/${courseId}`);
  };

  const handleSaveLater = (courseId) => {
    toast({ title: "Guardar para Después", description: `Curso ID: ${courseId} guardado (simulado).` });
  };

  const handlePlayTrailer = (trailerUrl) => {
    if (!trailerUrl) {
      toast({ title: "Sin Tráiler", description: "Este curso no tiene tráiler.", variant: "destructive" });
      return;
    }
    window.open(trailerUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground"
    >
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-gray-800 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Decorative background pattern or image can go here */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="hero-pattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(45)"><rect x="0" y="0" width="100%" height="100%" fill="none"/><path d="M10-2.5L20 .5 30-2.5M10 7.5L20 10.5 30 7.5M10 17.5L20 20.5 30 17.5M10 27.5L20 30.5 30 27.5M10 37.5L20 40.5 30 37.5" strokeWidth="1" stroke="rgba(255,255,255,0.2)" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#hero-pattern)"/></svg>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
          >
            Transforma tu Aprendizaje con <span className="text-accent">educaIA</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
          >
            Descubre cursos personalizados, herramientas IA innovadoras y una comunidad vibrante para potenciar tu conocimiento.
          </motion.p>
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-10"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué quieres aprender hoy?"
              className="flex-grow px-5 py-3.5 rounded-md text-gray-900 focus:ring-2 focus:ring-accent focus:outline-none text-lg"
            />
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-3.5">
              <Search className="mr-2 h-5 w-5" /> Buscar
            </Button>
          </motion.form>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-3.5" asChild>
              <Link to="/demos">
                <PlayCircle className="mr-2 h-5 w-5" /> Ver Demos
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">¿Por qué elegir educa<span className="text-accent">IA</span>?</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              Ofrecemos una plataforma integral diseñada para el aprendizaje del futuro.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen />}
              title="Cursos Personalizados"
              description="Crea y explora rutas de aprendizaje adaptadas a tus necesidades e intereses con la ayuda de nuestra IA."
              link="/courses"
              linkText="Explorar Cursos"
            />
            <FeatureCard
              icon={<Cpu />}
              title="Herramientas IA Avanzadas"
              description="Utiliza herramientas inteligentes para resumir textos, generar cuestionarios, obtener ayuda con código y más."
              link="/ai-tools"
              linkText="Probar Herramientas IA"
            />
            <FeatureCard
              icon={<Users />}
              title="Comunidad Colaborativa"
              description="Conéctate con otros estudiantes, comparte conocimientos, resuelve dudas y únete a grupos de estudio."
              link="/community"
              linkText="Unirse a la Comunidad"
            />
          </div>
        </div>
      </section>

      {/* Trending Courses Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Cursos Populares</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              Descubre lo que otros estudiantes están aprendiendo en educaIA.
            </p>
          </div>
          {isLoadingCourses ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : trendingCourses.length > 0 ? (
            <CourseCarousel
              courses={trendingCourses}
              onStartContinue={handleCourseAccess}
              onSaveLater={handleSaveLater}
              onPlayTrailer={handlePlayTrailer}
              title="" 
            />
          ) : (
            <p className="text-center text-muted-foreground">No hay cursos populares disponibles en este momento.</p>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Lo que dicen nuestros estudiantes</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="educaIA ha revolucionado mi forma de aprender. Las herramientas de IA son increíblemente útiles y los cursos están muy bien estructurados."
              author="Ana Pérez"
              role="Estudiante de Desarrollo Web"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            />
            <TestimonialCard
              quote="La capacidad de crear mis propios cursos personalizados es fantástica. Puedo enfocarme exactamente en lo que necesito aprender."
              author="Carlos Rodríguez"
              role="Profesional de Marketing"
              avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
            />
            <TestimonialCard
              quote="La comunidad es muy activa y solidaria. Siempre encuentro ayuda cuando la necesito y he hecho grandes conexiones."
              author="Laura Gómez"
              role="Entusiasta de la IA"
              avatar="https://images.unsplash.com/photo-1580894908361-967195033215"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-accent to-red-600 text-accent-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            ¿Listo para Empezar tu Viaje de Aprendizaje?
          </motion.h2>
          <motion.p 
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay:0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Únete a miles de estudiantes que están transformando su futuro con educaIA.
          </motion.p>
          <motion.div
            initial={{ opacity:0, scale:0.8 }}
            whileInView={{ opacity:1, scale:1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay:0.4 }}
          >
            <Button size="lg" variant="secondary" className="text-lg px-10 py-4 bg-background text-primary hover:bg-gray-100" asChild>
              <Link to="/courses">Explorar Cursos Ahora</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer placeholder */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center">
        <p>&copy; {new Date().getFullYear()} educaIA. Todos los derechos reservados.</p>
        <div className="mt-2">
          <Link to="/privacy" className="hover:text-accent px-2">Política de Privacidad</Link>
          <Link to="/terms" className="hover:text-accent px-2">Términos de Servicio</Link>
        </div>
      </footer>
    </motion.div>
  );
};

export default HomePage;