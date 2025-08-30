
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/blog/ArticleCard';
import { Search, Filter } from 'lucide-react';

const placeholderArticles = [
  { id: '1', title: 'El Futuro del Aprendizaje con IA', description: 'Cómo la inteligencia artificial está revolucionando la educación y personalizando la experiencia de aprendizaje.', author: 'Dra. Elena Vélez', date: '2025-05-10', image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94', tags: ['IA', 'Educación', 'Futuro'], slug: 'futuro-aprendizaje-ia' },
  { id: '2', title: '5 Consejos para Mantener la Motivación Estudiando Online', description: 'Estrategias efectivas para mantener el enfoque y la motivación mientras aprendes desde casa.', author: 'Juan Carlos Pérez', date: '2025-05-05', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32', tags: ['Consejos', 'Estudiantes', 'Online'], slug: 'consejos-motivacion-online' },
  { id: '3', title: 'educaIA Lanza Nuevas Herramientas de Creación de Cursos', description: 'Descubre las últimas funcionalidades que te permitirán diseñar cursos interactivos con ayuda de la IA.', author: 'Equipo educaIA', date: '2025-04-28', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f', tags: ['Noticias', 'Plataforma', 'IA'], slug: 'nuevas-herramientas-educaia' },
  { id: '4', title: 'Historia de un Estudiante: Cómo la IA me Ayudó a Aprender Programación', description: 'Un testimonio inspirador sobre cómo las herramientas de IA pueden acelerar el aprendizaje de habilidades complejas.', author: 'Sofía Ramírez', date: '2025-04-15', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', tags: ['Historia Estudiante', 'IA', 'Programación'], slug: 'historia-estudiante-ia-programacion' },
];

const categories = ['Todas', 'IA', 'Educación', 'Consejos', 'Noticias', 'Estudiantes', 'Programación'];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredArticles = placeholderArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || article.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-primary">Blog educa<span className="text-accent">IA</span></h1>
        <p className="text-xl text-muted-foreground mt-3">
          Noticias, consejos e historias del mundo de educaIA y la IA en la educación.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <Input 
            type="search" 
            placeholder="Buscar artículos..." 
            className="pl-10 h-11 text-base w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-muted">
          <Filter className="h-5 w-5 text-muted-foreground md:hidden" />
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${selectedCategory === category ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delayChildren: 0.1, staggerChildren: 0.1 }}
        >
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p 
          className="text-center text-muted-foreground text-lg py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No se encontraron artículos que coincidan con tu búsqueda o filtro.
        </motion.p>
      )}
    </div>
  );
};

export default BlogPage;
  