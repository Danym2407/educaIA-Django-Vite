
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, Search, Library, Settings, BarChart, UploadCloud, Link2, FileText, Video, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const initialCustomCourses = [
  { id: 'cc1', title: 'Aprendizaje Profundo con Python', tags: ['Programación', 'IA'], progress: 75, description: 'Un curso personalizado sobre redes neuronales y TensorFlow.' },
  { id: 'cc2', title: 'Historia de la Filosofía Antigua', tags: ['Filosofía', 'Historia'], progress: 40, description: 'Exploración de los pensadores clave desde Tales a Plotino.' },
  { id: 'cc3', title: 'Desarrollo Web Frontend Avanzado', tags: ['Web', 'React', 'Avanzado'], progress: 90, description: 'Técnicas modernas para construir interfaces de usuario interactivas.' },
];

const AIToolsPage = () => {
  const { toast } = useToast();
  const [customCourses, setCustomCourses] = useState(initialCustomCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentWizardStep, setCurrentWizardStep] = useState(1);

  const [newCourseData, setNewCourseData] = useState({
    topic: '',
    category: '',
    resources: [],
    name: '',
    visibility: 'private'
  });

  const handleInputChange = (field, value) => {
    setNewCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleResourceUpload = (type) => {
    toast({ title: `Subir ${type}`, description: `Funcionalidad de carga de ${type} no implementada en esta demo.` });
  };

  const filteredCourses = customCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetWizard = () => {
    setCurrentWizardStep(1);
    setNewCourseData({ topic: '', category: '', resources: [], name: '', visibility: 'private' });
  };

  const handleCreateCourse = () => {
    if (!newCourseData.name.trim() || !newCourseData.topic.trim()) {
      toast({ title: "Campos Requeridos", description: "Por favor, completa el nombre y el tema del curso.", variant: "destructive" });
      return;
    }
    const newCourse = {
      id: `cc${customCourses.length + 1}`,
      title: newCourseData.name,
      tags: newCourseData.category ? [newCourseData.category, 'Nuevo'] : ['Nuevo'],
      progress: 0,
      description: newCourseData.topic,
    };
    setCustomCourses(prev => [newCourse, ...prev]);
    toast({ title: "¡Curso Creado!", description: `El curso "${newCourse.title}" ha sido añadido.` });
    setIsCreateModalOpen(false);
    resetWizard();
  };
  
  const handleDeleteCourse = (courseId) => {
    setCustomCourses(prev => prev.filter(course => course.id !== courseId));
    toast({ title: "Curso Eliminado", description: "El curso ha sido eliminado." });
  };

  const renderWizardStep = () => {
    switch (currentWizardStep) {
      case 1:
        return (
          <div className="space-y-4">
            <DialogTitle className="text-xl">Paso 1: ¿Qué quieres aprender o enseñar?</DialogTitle>
            <DialogDescription>Describe el tema o el objetivo de tu curso personalizado.</DialogDescription>
            <div>
              <Label htmlFor="topic-description">Describe el tema o meta</Label>
              <Input id="topic-description" placeholder="Ej: Fundamentos de React, Historia del Arte Renacentista" value={newCourseData.topic} onChange={(e) => handleInputChange('topic', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="topic-category">Categoría (Opcional)</Label>
              <Input id="topic-category" placeholder="Ej: Programación, Arte, Ciencia" value={newCourseData.category} onChange={(e) => handleInputChange('category', e.target.value)} />
            </div>
            <DialogFooter>
              <Button onClick={() => setCurrentWizardStep(2)} className="bg-accent hover:bg-accent/90">Siguiente</Button>
            </DialogFooter>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <DialogTitle className="text-xl">Paso 2: ¿Qué recursos te gustaría usar?</DialogTitle>
            <DialogDescription>Sube tus propios materiales o enlaza recursos online.</DialogDescription>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleResourceUpload('Video')}><Video className="mr-2 h-4 w-4" /> Subir Video</Button>
              <Button variant="outline" onClick={() => handleResourceUpload('PDF')}><FileText className="mr-2 h-4 w-4" /> Subir PDF/Libro</Button>
              <Button variant="outline" onClick={() => handleResourceUpload('Resumen')}><BookOpen className="mr-2 h-4 w-4" /> Subir Resumen</Button>
              <Button variant="outline" onClick={() => handleResourceUpload('Notas')}><Edit className="mr-2 h-4 w-4" /> Subir Notas</Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input placeholder="O pega una URL a un recurso online" />
              <Button variant="outline" size="icon"><Link2 className="h-4 w-4" /></Button>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentWizardStep(1)}>Anterior</Button>
              <Button onClick={() => setCurrentWizardStep(3)} className="bg-accent hover:bg-accent/90">Siguiente</Button>
            </DialogFooter>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <DialogTitle className="text-xl">Paso 3: Sugerencias de la IA</DialogTitle>
            <DialogDescription>Nuestra IA está analizando tu tema y recursos para generar un plan de estudio. (Esto es una simulación)</DialogDescription>
            <div className="p-4 bg-secondary rounded-md space-y-2">
              <p className="font-semibold">Plan de Estudio Sugerido:</p>
              <ul className="list-disc list-inside text-sm">
                <li>Concepto Clave 1: Introducción a {newCourseData.topic || "tu tema"}</li>
                <li>Concepto Clave 2: Aplicaciones prácticas</li>
                <li>Actividad: Cuestionario sobre los fundamentos</li>
              </ul>
              <Progress value={66} className="w-full h-2 [&>div]:bg-accent" />
              <p className="text-xs text-muted-foreground text-center">Analizando contenido...</p>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentWizardStep(2)}>Anterior</Button>
              <Button onClick={() => setCurrentWizardStep(4)} className="bg-accent hover:bg-accent/90">Siguiente</Button>
            </DialogFooter>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <DialogTitle className="text-xl">Paso 4: Finalizar y Guardar</DialogTitle>
            <DialogDescription>Dale un nombre a tu curso y elige su visibilidad.</DialogDescription>
            <div>
              <Label htmlFor="course-name">Nombre de tu curso personalizado</Label>
              <Input id="course-name" placeholder="Ej: Mi Viaje por React" value={newCourseData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="course-visibility">Visibilidad</Label>
              <select id="course-visibility" className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={newCourseData.visibility} onChange={(e) => handleInputChange('visibility', e.target.value)}>
                <option value="private">Privado</option>
                <option value="shareable">Compartible (solo con enlace)</option>
              </select>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentWizardStep(3)}>Anterior</Button>
              <Button onClick={handleCreateCourse} className="bg-accent hover:bg-accent/90">Guardar Curso</Button>
            </DialogFooter>
          </div>
        );
      default: return null;
    }
  };


  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-primary">Herramientas IA</h1>
          <p className="text-lg text-muted-foreground mt-2">Crea, gestiona y potencia tu aprendizaje con IA.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={(isOpen) => { setIsCreateModalOpen(isOpen); if (!isOpen) resetWizard(); }}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Crear Nuevo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            {renderWizardStep()}
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navegación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start"><Search className="mr-2 h-4 w-4" /> Buscar Cursos</Button>
              <Button variant="ghost" className="w-full justify-start"><Library className="mr-2 h-4 w-4" /> Biblioteca de Recursos</Button>
              <Button variant="ghost" className="w-full justify-start"><Settings className="mr-2 h-4 w-4" /> Configuración</Button>
              <Button variant="ghost" className="w-full justify-start"><BarChart className="mr-2 h-4 w-4" /> Perspectivas IA</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="text-lg">Herramientas Rápidas IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">Resumidor de Texto</Button>
              <Button variant="outline" className="w-full justify-start">Generador de Exámenes</Button>
              <Button variant="outline" className="w-full justify-start">Asistente de Código</Button>
              <Button variant="outline" className="w-full justify-start">Traductor Técnico</Button>
            </CardContent>
          </Card>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Buscar en mis cursos personalizados..."
              className="pl-10 h-11 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" style={{top: 'calc(50% + 0.125rem)', left: '0.875rem'}}/>
          </div>

          <motion.h2 
            className="text-2xl font-semibold text-primary mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Mis Cursos Personalizados
          </motion.h2>
          
          {filteredCourses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 bg-secondary rounded-lg"
            >
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No has creado ningún curso personalizado todavía.</p>
              <Button variant="link" className="text-accent mt-2" onClick={() => setIsCreateModalOpen(true)}>
                ¡Crea tu primer curso ahora!
              </Button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="truncate hover:text-clip">{course.title}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.tags.map(tag => (
                        <span key={tag} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                    <Progress value={course.progress} className="h-2 [&>div]:bg-accent" />
                    <p className="text-xs text-muted-foreground mt-1">{course.progress}% completado</p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Editar Curso", description: `Editar ${course.title}`})}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteCourse(course.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => toast({title: "Continuar Curso", description: `Continuar ${course.title}`})}>Continuar</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIToolsPage;
  