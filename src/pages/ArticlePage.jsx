
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, User, Tag, MessageCircle, ThumbsUp, Share2, ChevronLeft } from 'lucide-react';
import ArticleCard from '@/components/blog/ArticleCard';

const placeholderArticles = [
  { id: '1', title: 'El Futuro del Aprendizaje con IA', content: '<p>La inteligencia artificial (IA) está preparada para transformar radicalmente el panorama educativo. Desde tutores personalizados hasta herramientas de creación de contenido inteligente, las posibilidades son enormes.</p><h2>Personalización a Escala</h2><p>Una de las mayores promesas de la IA en la educación es la capacidad de ofrecer experiencias de aprendizaje personalizadas a cada estudiante. Los sistemas de IA pueden adaptarse al ritmo, estilo de aprendizaje y áreas de interés de un individuo, proporcionando apoyo y desafíos a medida.</p><blockquote>"La IA nos permitirá movernos de un modelo de talla única a un enfoque educativo verdaderamente centrado en el estudiante." - Experto en IA Educativa</blockquote><h2>Nuevas Herramientas para Educadores</h2><p>Los educadores también se beneficiarán enormemente. La IA puede automatizar tareas administrativas, ayudar a identificar estudiantes que necesitan apoyo adicional y proporcionar información valiosa sobre la efectividad de diferentes enfoques pedagógicos.</p><ul><li>Calificación automatizada de ciertas tareas</li><li>Generación de material didáctico adaptado</li><li>Análisis predictivo del rendimiento estudiantil</li></ul><p>El camino hacia la plena integración de la IA en la educación presenta desafíos, incluyendo la equidad en el acceso, la privacidad de los datos y la necesidad de formar a los educadores en el uso de estas nuevas herramientas. Sin embargo, el potencial para mejorar los resultados del aprendizaje y hacer la educación más accesible y atractiva es innegable.</p>', author: 'Dra. Elena Vélez', date: '2025-05-10', image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94', tags: ['IA', 'Educación', 'Futuro'], slug: 'futuro-aprendizaje-ia', authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2' },
  { id: '2', title: '5 Consejos para Mantener la Motivación Estudiando Online', content: '<p>Estudiar online ofrece una flexibilidad increíble, pero también puede ser un desafío mantener la motivación. Aquí tienes cinco consejos probados para mantenerte en el camino:</p><h2>1. Establece un Espacio de Estudio Dedicado</h2><p>Tener un lugar específico para estudiar ayuda a tu cerebro a asociar ese espacio con el aprendizaje y la concentración.</p><h2>2. Crea un Horario y Cúmplelo</h2><p>Trata tus estudios online como si fueran clases presenciales. Bloquea tiempo en tu calendario y respétalo.</p><blockquote>"La disciplina es el puente entre las metas y los logros." - Jim Rohn</blockquote><h2>3. Fija Metas Pequeñas y Alcanzables</h2><p>Divide el material en trozos manejables y celebra tus progresos. Esto te dará una sensación de logro y te mantendrá motivado.</p><h2>4. Elimina Distracciones</h2><p>Apaga las notificaciones, cierra pestañas innecesarias y hazle saber a tu entorno que necesitas tiempo para concentrarte.</p><h2>5. Conecta con Otros Estudiantes</h2><p>Únete a foros, grupos de estudio o comunidades online. Compartir experiencias y dudas con otros puede ser muy motivador.</p><p>Recuerda, la clave está en la constancia y en encontrar lo que mejor funciona para ti. ¡Mucho ánimo!</p>', author: 'Juan Carlos Pérez', date: '2025-05-05', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32', tags: ['Consejos', 'Estudiantes', 'Online'], slug: 'consejos-motivacion-online', authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
  { id: '3', title: 'educaIA Lanza Nuevas Herramientas de Creación de Cursos', content: '<p>Estamos emocionados de anunciar el lanzamiento de un conjunto de nuevas herramientas impulsadas por IA en educaIA, diseñadas para revolucionar la forma en que creas y personalizas tus cursos.</p><h2>Asistente de Contenido Inteligente</h2><p>Nuestro nuevo asistente puede ayudarte a estructurar tu curso, sugerir temas relevantes, e incluso generar borradores de contenido y cuestionarios basados en tus ideas iniciales.</p><h2>Integración Multimedia Mejorada</h2><p>Ahora es más fácil que nunca incorporar videos, PDFs interactivos y otros recursos multimedia en tus lecciones. La IA te ayudará a encontrar material relevante y a optimizarlo para el aprendizaje.</p><blockquote>"Estas herramientas no buscan reemplazar la creatividad humana, sino potenciarla." - CEO de educaIA</blockquote><h2>Análisis de Aprendizaje en Tiempo Real</h2><p>Obtén información detallada sobre cómo los estudiantes interactúan con tu contenido, permitiéndote refinar y mejorar tus cursos continuamente.</p><p>Te invitamos a explorar estas nuevas funcionalidades y a compartir tus comentarios con nosotros. ¡Juntos estamos construyendo el futuro del aprendizaje!</p>', author: 'Equipo educaIA', date: '2025-04-28', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f', tags: ['Noticias', 'Plataforma', 'IA'], slug: 'nuevas-herramientas-educaia', authorImage: 'https://images.unsplash.com/photo-1556157382-97eda2d62296' },
  { id: '4', title: 'Historia de un Estudiante: Cómo la IA me Ayudó a Aprender Programación', content: '<p>Mi nombre es Sofía y quiero compartir cómo las herramientas de IA en educaIA transformaron mi viaje de aprendizaje en programación.</p><h2>El Desafío Inicial</h2><p>Siempre quise aprender Python, pero me sentía abrumada por la cantidad de información y no sabía por dónde empezar. Los conceptos iniciales me parecían abstractos y me costaba conectar la teoría con la práctica.</p><h2>Descubriendo el Asistente IA</h2><p>Cuando empecé a usar el asistente de código de educaIA, todo cambió. Podía hacer preguntas específicas y obtener explicaciones claras y ejemplos prácticos al instante. El generador de ejercicios personalizados me ayudó a practicar los conceptos que más me costaban.</p><blockquote>"La IA fue como tener un tutor paciente disponible 24/7." - Sofía Ramírez</blockquote><h2>Resultados Tangibles</h2><p>En pocos meses, pasé de no entender los bucles `for` a construir pequeñas aplicaciones web. La IA no solo me dio respuestas, sino que me enseñó a pensar como programadora, sugiriendo diferentes enfoques y ayudándome a depurar mis errores.</p><p>Si estás luchando por aprender una habilidad nueva, te animo a explorar cómo la IA puede ser tu aliada. ¡Para mí, marcó toda la diferencia!</p>', author: 'Sofía Ramírez', date: '2025-04-15', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', tags: ['Historia Estudiante', 'IA', 'Programación'], slug: 'historia-estudiante-ia-programacion', authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
];


const ArticlePage = () => {
  const { articleSlug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const foundArticle = placeholderArticles.find(a => a.slug === articleSlug);
    setArticle(foundArticle);
    window.scrollTo(0, 0);
  }, [articleSlug]);

  if (!article) {
    return <div className="flex justify-center items-center h-screen"><p>Artículo no encontrado.</p></div>;
  }

  const relatedArticles = placeholderArticles.filter(a => a.id !== article.id && a.tags.some(tag => article.tags.includes(tag))).slice(0, 3);

  return (
    <div className="bg-background text-foreground">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-accent hover:underline mb-6">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Volver al Blog
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {article.tags.map(tag => (
                  <span key={tag} className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">{article.title}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={article.authorImage || `https://ui-avatars.com/api/?name=${article.author.replace(/\s/g, '+')}&background=random`} alt={article.author} />
                    <AvatarFallback>{article.author.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  <span>{new Date(article.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </header>

            {article.image && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img  src={article.image} alt={article.title} className="w-full h-auto object-cover max-h-[500px]" />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none text-foreground prose-headings:text-primary prose-blockquote:border-accent prose-blockquote:text-muted-foreground prose-a:text-accent hover:prose-a:underline prose-strong:text-primary"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />

            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex space-x-2">
                  <Button variant="outline"><ThumbsUp className="h-5 w-5 mr-2" /> Me gusta</Button>
                  <Button variant="outline"><MessageCircle className="h-5 w-5 mr-2" /> Comentar</Button>
                </div>
                <Button variant="outline"><Share2 className="h-5 w-5 mr-2" /> Compartir</Button>
              </div>
            </footer>
          </article>

          {relatedArticles.length > 0 && (
            <section className="mt-16 pt-8 border-t border-border">
              <h2 className="text-3xl font-bold text-primary mb-8">Artículos Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map(related => (
                  <ArticleCard key={related.id} article={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ArticlePage;
  