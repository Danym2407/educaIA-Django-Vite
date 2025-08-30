
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Code, Star, Users, Search, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ForumThreadCard from '@/components/community/ForumThreadCard';
import CourseRecommendationCard from '@/components/community/CourseRecommendationCard';
import StudyGroupCard from '@/components/community/StudyGroupCard';

const mockForumThreadsData = [
  { id: 'f1', user: 'Ana C.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', title: '¿Mejores recursos para aprender React Hooks?', snippet: 'Estoy buscando tutoriales o cursos bien explicados sobre React Hooks, ¿alguna sugerencia?', replies: 12, lastActivity: 'Hace 2 horas', tags: ['React', 'JavaScript'] },
  { id: 'f2', user: 'Carlos G.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', title: 'Duda sobre normalización de bases de datos', snippet: 'Tengo un esquema de base de datos y no estoy seguro si está en 3FN. ¿Alguien podría ayudarme a revisarlo?', replies: 5, lastActivity: 'Hace 5 horas', tags: ['SQL', 'Bases de Datos'] },
  { id: 'f3', user: 'Laura M.', avatar: 'https://images.unsplash.com/photo-1580894908361-967195033215', title: 'Comparto mi proyecto de IA para análisis de sentimiento', snippet: 'Acabo de terminar un pequeño proyecto en Python para analizar sentimientos en tweets. ¡Feedback bienvenido!', replies: 8, lastActivity: 'Hace 1 día', tags: ['Python', 'IA', 'Proyectos'] },
];

const mockCourseRecommendationsData = [
  { id: 'cr1', title: 'Curso Completo de Python de Cero a Experto', user: 'Juan P.', rating: 4.8, review: 'Excelente curso para empezar con Python, muy completo y bien explicado.', category: 'Programación', likes: 25, saves: 10 },
  { id: 'cr2', title: 'Diseño de Interfaces UX/UI con Figma', user: 'Sofia L.', rating: 4.5, review: 'Aprendí muchísimo sobre Figma y principios de UX. Lo recomiendo.', category: 'Diseño', likes: 18, saves: 7 },
];

const mockStudyGroupsData = [
  { id: 'sg1', name: 'Grupo de Estudio de JavaScript Avanzado', description: 'Nos reunimos semanalmente para discutir temas avanzados de JS y resolver problemas.', members: 15, nextSession: 'Mañana a las 18:00' },
  { id: 'sg2', name: 'Club de Lectura de Papers de IA', description: 'Leemos y discutimos los últimos avances en investigación de IA.', members: 8, nextSession: 'Viernes a las 17:00' },
];

const TabContentLayout = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const CommunityPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('forum');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreatePost = () => {
    toast({ title: "Crear Publicación", description: "Esta función abriría un editor para una nueva publicación." });
  };

  const filteredForumThreads = mockForumThreadsData.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCourseRecommendations = mockCourseRecommendationsData.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.review.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredStudyGroups = mockStudyGroupsData.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-primary">Comunidad educa<span className="text-accent">IA</span></h1>
          <p className="text-lg text-muted-foreground mt-2">Conecta, colabora y aprende con otros estudiantes.</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCreatePost}>
          <PlusCircle className="mr-2 h-5 w-5" /> Crear Publicación
        </Button>
      </motion.div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input 
            type="search" 
            placeholder="Buscar en la comunidad..." 
            className="pl-10 h-11 text-base w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
          <TabsTrigger value="forum" className="flex items-center"><MessageSquare className="mr-2 h-4 w-4" /> Foro General</TabsTrigger>
          <TabsTrigger value="code-help" className="flex items-center"><Code className="mr-2 h-4 w-4" /> Ayuda con Código</TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center"><Star className="mr-2 h-4 w-4" /> Recomendaciones</TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center"><Users className="mr-2 h-4 w-4" /> Grupos de Estudio</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabContentLayout key={activeTab}>
            <TabsContent value="forum">
              {filteredForumThreads.length > 0 ? (
                <div className="space-y-4">
                  {filteredForumThreads.map(thread => <ForumThreadCard key={thread.id} thread={thread} />)}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No se encontraron hilos en el foro general.</p>
              )}
            </TabsContent>

            <TabsContent value="code-help">
              <p className="text-muted-foreground text-center py-8">Sección de ayuda con código. Similar al foro general pero enfocado en problemas técnicos. (Contenido de ejemplo pronto)</p>
               {filteredForumThreads.filter(t => t.tags.includes('SQL') || t.tags.includes('Python') || t.tags.includes('JavaScript') ).length > 0 ? (
                <div className="space-y-4 mt-4">
                  {filteredForumThreads.filter(t => t.tags.includes('SQL') || t.tags.includes('Python') || t.tags.includes('JavaScript') ).map(thread => <ForumThreadCard key={thread.id} thread={thread} />)}
                </div>
              ) : (
                 !searchTerm && <p className="text-muted-foreground text-center py-8">No hay hilos de ayuda con código por el momento.</p>
              )}
            </TabsContent>

            <TabsContent value="recommendations">
              {filteredCourseRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourseRecommendations.map(rec => <CourseRecommendationCard key={rec.id} recommendation={rec} />)}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No se encontraron recomendaciones de cursos.</p>
              )}
            </TabsContent>

            <TabsContent value="groups">
              {filteredStudyGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredStudyGroups.map(group => <StudyGroupCard key={group.id} group={group} />)}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No se encontraron grupos de estudio.</p>
              )}
            </TabsContent>
          </TabContentLayout>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
  