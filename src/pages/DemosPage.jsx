
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCardComponent from '@/components/courses/CourseCardComponent';
import { PlayCircle, Lightbulb, BarChart3, MessageSquare, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockDemoCourse = {
  id: 'demo-course-1',
  title: 'Introducción a la Programación en Python - Lección Demo',
  tags: ['Python', 'Principiante', 'Programación'],
  duration: '15 min',
  rating: 4.8,
  description: '¡Prueba nuestro curso de Python! Esta lección demo interactiva cubre sintaxis básica, variables y tu primer programa "¡Hola, Mundo!", seguido de un breve cuestionario.',
  progress: 0, 
  trailerUrl: null,
  coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 
};

const DemoSection = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-12"
  >
    <div className="flex items-center mb-6">
      {React.cloneElement(icon, { className: "h-8 w-8 text-accent mr-3" })}
      <h2 className="text-3xl font-semibold text-primary">{title}</h2>
    </div>
    {children}
  </motion.div>
);


const DemosPage = () => {
  const { toast } = useToast();
  const [summarizerInput, setSummarizerInput] = useState('La inteligencia artificial (IA) está transformando rápidamente diversas industrias al permitir que las máquinas realicen tareas que normalmente requieren inteligencia humana. Las áreas clave de la IA incluyen el aprendizaje automático, el procesamiento del lenguaje natural y la visión por computadora. Los algoritmos de aprendizaje automático permiten que los sistemas aprendan de los datos y mejoren con el tiempo sin programación explícita. El procesamiento del lenguaje natural se centra en la interacción entre las computadoras y el lenguaje humano, lo que permite aplicaciones como chatbots y servicios de traducción. La visión por computadora se ocupa de cómo las computadoras pueden obtener una comprensión de alto nivel a partir de imágenes o videos digitales.');
  const [summarizerOutput, setSummarizerOutput] = useState('');
  const [quizTopic, setQuizTopic] = useState('Álgebra Básica');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const handleSummarize = () => {
    if (!summarizerInput.trim()) {
      toast({ title: "Entrada Requerida", description: "Por favor, ingresa texto para resumir.", variant: "destructive" });
      return;
    }
    setSummarizerOutput(`La IA está cambiando las industrias al permitir que las máquinas realicen tareas similares a las humanas. Los principales campos de la IA son el aprendizaje automático (los sistemas aprenden de los datos), el procesamiento del lenguaje natural (interacción computadora-lenguaje humano) y la visión por computadora (comprensión de imágenes/videos).`);
    toast({ title: "¡Texto Resumido!", description: "Se ha generado un resumen para tu entrada." });
  };

  const handleGenerateQuiz = () => {
    if (!quizTopic.trim()) {
      toast({ title: "Tema Requerido", description: "Por favor, ingresa un tema para el cuestionario.", variant: "destructive" });
      return;
    }
    setGeneratedQuiz([
      { question: `¿Cuánto es 2 + 2 en ${quizTopic}? (Contexto de álgebra)`, options: ["3", "4", "5", "6"], answer: "4" },
      { question: `Resuelve para x: x - 5 = 10 (de ${quizTopic})`, options: ["5", "10", "15", "20"], answer: "15" },
    ]);
    toast({ title: "¡Cuestionario Generado!", description: `Un cuestionario de ejemplo para "${quizTopic}" está listo.` });
  };

  const handleCourseAction = (action) => {
     toast({ title: "Acción Demo", description: `Esto ${action === 'start/continue' ? 'iniciaría/continuaría' : action === 'save' ? 'guardaría' : 'reproduciría el tráiler de'} el curso demo.` });
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-primary">Experimenta educa<span className="text-accent">IA</span></h1>
        <p className="text-xl text-muted-foreground mt-3">
          Vistas previas interactivas para mostrar lo que nuestra plataforma puede hacer. ¡Sin necesidad de registrarse!
        </p>
      </motion.div>

      <DemoSection title="Prueba un Curso Demo" icon={<PlayCircle />}>
        <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardContent className="p-0 md:p-6 md:flex items-center gap-6">
            <div className="md:w-1/2 lg:w-2/5">
               <CourseCardComponent 
                course={mockDemoCourse} 
                onStartContinue={() => handleCourseAction('start/continue')}
                onSaveLater={() => handleCourseAction('save')}
                onPlayTrailer={() => handleCourseAction('play trailer')}
              />
            </div>
            <div className="p-6 md:p-0 md:w-1/2 lg:w-3/5">
              <h3 className="text-2xl font-semibold text-primary mb-2">{mockDemoCourse.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
                <span>Duración: {mockDemoCourse.duration}</span>
                <span>Valoración: {mockDemoCourse.rating} ★</span>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">{mockDemoCourse.description}</p>
              <div className="bg-secondary p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-primary mb-2">Contenido de la Lección Demo:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Video Interactivo: "Conceptos Básicos de Python" (5 min)</li>
                  <li>Material de Lectura: "Variables y Tipos de Datos" (Texto)</li>
                  <li>Cuestionario Rápido: 3 Preguntas de Opción Múltiple</li>
                </ul>
              </div>
              <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleCourseAction('start demo lesson')}>
                <PlayCircle className="mr-2 h-5 w-5" /> Iniciar Lección Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </DemoSection>

      <DemoSection title="Prueba las Herramientas IA" icon={<Lightbulb />}>
        <Tabs defaultValue="summarizer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="summarizer">Resumidor de Texto</TabsTrigger>
            <TabsTrigger value="quiz-generator">Generador de Cuestionarios</TabsTrigger>
          </TabsList>
          <TabsContent value="summarizer">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Resumidor de Texto IA</CardTitle>
                <CardDescription>Pega cualquier texto abajo y nuestra IA generará un resumen conciso. (Demo usa salida predefinida)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Pega tu texto aquí para resumir..."
                  value={summarizerInput}
                  onChange={(e) => setSummarizerInput(e.target.value)}
                  rows={6}
                  className="mb-4 text-sm"
                />
                <Button onClick={handleSummarize} className="bg-accent hover:bg-accent/90 text-accent-foreground">Resumir Texto</Button>
                {summarizerOutput && (
                  <div className="mt-4 p-4 bg-secondary rounded-md">
                    <h4 className="font-semibold text-primary mb-2">Resumen Generado:</h4>
                    <p className="text-sm text-muted-foreground">{summarizerOutput}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quiz-generator">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Generador de Cuestionarios IA</CardTitle>
                <CardDescription>Ingresa un tema y nuestra IA creará un cuestionario de ejemplo. (Demo usa preguntas predefinidas)</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Ingresa un tema (ej: Fotosíntesis)"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="mb-4 text-sm"
                />
                <Button onClick={handleGenerateQuiz} className="bg-accent hover:bg-accent/90 text-accent-foreground">Generar Cuestionario</Button>
                {generatedQuiz && (
                  <div className="mt-4 p-4 bg-secondary rounded-md">
                    <h4 className="font-semibold text-primary mb-2">Cuestionario de Ejemplo sobre "{quizTopic}":</h4>
                    <ul className="space-y-3">
                      {generatedQuiz.map((q, index) => (
                        <li key={index} className="text-sm">
                          <p className="font-medium text-primary">{index + 1}. {q.question}</p>
                          <ul className="list-disc list-inside pl-4 text-muted-foreground">
                            {q.options.map(opt => <li key={opt}>{opt} {opt === q.answer && <CheckCircle className="inline h-4 w-4 text-green-500 ml-1" />}</li>)}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Simula el Panel de Control" icon={<BarChart3 />}>
        <Card className="shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle>Vista Previa de Tu Centro de Aprendizaje</CardTitle>
            <CardDescription>Esta es una maqueta de tu panel de aprendizaje personalizado donde seguirás tu progreso, gestionarás cursos y verás recomendaciones.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-6 rounded-lg border border-dashed border-gray-300">
              <img  alt="Maqueta del panel de aprendizaje de educaIA mostrando gráficos de progreso, cursos activos y un calendario de estudio." className="w-full h-auto rounded-md shadow-md" src="https://images.unsplash.com/photo-1694532409273-b26e2ce266ea" />
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Elementos interactivos como gráficos de progreso, integración de calendario y notificaciones inteligentes estarían activos aquí.
              </p>
            </div>
          </CardContent>
        </Card>
      </DemoSection>

      <DemoSection title="Explora los Foros de la Comunidad" icon={<Users />}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Un Vistazo al Foro Comunitario</CardTitle>
            <CardDescription>Mira cómo puedes conectar con otros estudiantes, hacer preguntas y compartir conocimiento en nuestra vibrante comunidad.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3 mb-2">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-primary hover:text-accent cursor-pointer">Ayuda con Python: Atascado en un problema de comprensión de listas</h4>
                    <p className="text-xs text-muted-foreground">Preguntado por <span className="text-accent">MagoDelCodigo88</span> • Hace 2 horas • 3 respuestas</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground ml-12 truncate">"Hola a todos, estoy intentando filtrar una lista de números y luego elevarlos al cuadrado usando una comprensión de listas, pero sigo recibiendo un error..."</p>
              </div>

              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                 <div className="flex items-start space-x-3 mb-2">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" />
                    <AvatarFallback>IA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-primary hover:text-accent cursor-pointer">Idea de Proyecto: Generador de Recetas con IA</h4>
                    <p className="text-xs text-muted-foreground">Compartido por <span className="text-accent">EstudianteCreativo</span> • Hace 1 día • 5 respuestas</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground ml-12 truncate">"Tuve esta idea genial para un proyecto usando PLN para generar recetas basadas en los ingredientes que tienes. ¿Alguien interesado en colaborar o tiene ideas sobre esto?"</p>
                <Separator className="my-3" />
                <div className="ml-12 space-y-2">
                    <div className="flex items-start space-x-2 text-sm">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" />
                            <AvatarFallback>DG</AvatarFallback>
                        </Avatar>
                        <p><span className="font-semibold text-primary">DevGuru</span>: ¡Suena increíble! Podrías usar un modelo transformer para la generación de texto.</p>
                    </div>
                     <div className="flex items-start space-x-2 text-sm">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="https://images.unsplash.com/photo-1580894908361-967195033215" />
                            <AvatarFallback>MM</AvatarFallback>
                        </Avatar>
                        <p><span className="font-semibold text-primary">MakerMia</span>: ¡Me interesaría! He trabajado con APIs de recetas antes.</p>
                    </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-6 w-full sm:w-auto" onClick={() => toast({title: "Explorar Más", description: "Esto te llevaría al foro completo de la comunidad."})}>
              <MessageSquare className="mr-2 h-5 w-5" /> Explorar Más Hilos
            </Button>
          </CardContent>
        </Card>
      </DemoSection>

      <motion.div 
        className="text-center mt-20 py-10 bg-gradient-to-r from-primary to-gray-800 rounded-lg shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-background mb-4">¿Listo para Profundizar?</h2>
        <p className="text-lg text-gray-300 mb-8 px-4">
          Estas demos ofrecen solo un vistazo. ¡Regístrate para desbloquear todo el poder de educaIA!
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6" onClick={() => toast({title: "Registrarse", description: "Esto te llevaría a la página de registro."})}>
          Únete a educaIA Ahora
        </Button>
      </motion.div>

    </div>
  );
};

export default DemosPage;
  