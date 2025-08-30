
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import CourseCatalogView from '@/components/courses/CourseCatalogView';
// Importa los componentes de la UI de Shadcn/ui para el diálogo modal
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// Importa el componente de botón de Shadcn/ui
import { Button } from '@/components/ui/button';
// Importa los datos de cursos y la función para obtener un curso por ID (en español)
import { placeholderCoursesDataES, getCourseByIdES } from '@/lib/courseData';

// Exporta la función getCourseByIdES como getCourseById
export const getCourseById = getCourseByIdES;

// Componente principal de la página de Cursos
const CoursesPage = () => {
  // Obtiene el parámetro 'filter' de la URL usando useParams
  const { filter } = useParams();
  // Hook para la navegación programática entre rutas
  const navigate = useNavigate();
  // Hook para mostrar notificaciones 'toast'
  const { toast } = useToast();
  
  // Estado para controlar la visibilidad del modal de autenticación
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Estado para almacenar el ID del curso seleccionado para acceder
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  // Estado para verificar si el usuario ha iniciado sesión.
  // Se inicializa leyendo del localStorage.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedInEducaIA') === 'true';
  });

  // Función que maneja el acceso a un curso
  const handleCourseAccess = (courseId) => {
    // Guarda el ID del curso seleccionado
    setSelectedCourseId(courseId);
    if (isLoggedIn) {
      navigate(`/courses/view/${courseId}`);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Función que maneja el inicio de sesión (simulado)
  const handleLogin = () => {
    // Actualiza el estado de login a true
    setIsLoggedIn(true);
    // Guarda el estado de login en localStorage
    localStorage.setItem('isLoggedInEducaIA', 'true');
    // Cierra el modal de autenticación
    setIsAuthModalOpen(false);
    // Si había un curso seleccionado, navega a la página de visualización del curso
    if (selectedCourseId) {
      navigate(`/courses/view/${selectedCourseId}`);
    }
    // Muestra un mensaje de éxito con toast
    toast({ title: "Inicio de Sesión Exitoso", description: "¡Bienvenido/a de nuevo!" });
  };

  // Función que maneja el registro (simulado)
  const handleRegister = () => {
    // Muestra un mensaje indicando que llevaría a la página de registro
    toast({ title: "Registro", description: "Esto te llevaría a la página de registro." });
    // Cierra el modal de autenticación
    setIsAuthModalOpen(false);
  };
  
  // Función que maneja el cierre de sesión (simulado)
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedInEducaIA');
    toast({ title: "Sesión Cerrada", description: "Has cerrado sesión exitosamente." });
  };

  return (
    <>
      {/* Componente que muestra el catálogo de cursos */}
      <CourseCatalogView 
        filterParam={filter} 
        coursesData={placeholderCoursesDataES}
        onCourseAccess={handleCourseAccess}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        {/* Contenido del modal de autenticación */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            {/* Título y descripción del modal */}
            <DialogTitle>Acceder al Contenido del Curso</DialogTitle>
            <DialogDescription>
              Por favor, inicia sesión o regístrate para acceder a este curso.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" onClick={handleLogin} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Iniciar sesión</Button>
            {/* Botones para Iniciar Sesión y Registrarse */}
            <Button type="button" variant="outline" onClick={handleRegister} className="w-full">Registrarse</Button>
            {/* El botón de registro es una variante de 'outline' */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoursesPage;
