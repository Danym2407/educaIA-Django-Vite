
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

// Componente de la página de autenticación (Login/Registro)
const AuthPage = () => {
  // Estados para controlar la UI y los datos del formulario
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hooks para autenticación, navegación y notificaciones
  // useAuth provee las funciones signIn y signUp
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/profile/overview';

  // Funciones de validación básica para email y contraseña
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  // Manejador del envío del formulario
  // Llama a la función de autenticación correspondiente (signIn o signUp)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast({ title: 'Error de Validación', description: 'Por favor, introduce un correo electrónico válido.', variant: 'destructive' });
      return;
    }
    if (!validatePassword(password)) {
      toast({ title: 'Error de Validación', description: 'La contraseña debe tener al menos 6 caracteres.', variant: 'destructive' });
      return;
    }

    try {
      if (isLogin) {
        // Lógica para inicio de sesión
        await signIn(email, password);
        toast({ title: 'Inicio de Sesión Exitoso', description: '¡Bienvenido de nuevo!' });
        navigate(from, { replace: true });
      } else {
        // Lógica para registro
        // Validaciones adicionales para el registro
        if (!fullName.trim()) {
          toast({ title: 'Error de Validación', description: 'Por favor, introduce tu nombre completo.', variant: 'destructive' });
          return;
        }
        if (password !== confirmPassword) {
          toast({ title: 'Error de Validación', description: 'Las contraseñas no coinciden.', variant: 'destructive' });
          return;
        }
        // Llama a la función de registro
        await signUp(email, password, fullName);
        toast({ title: 'Registro Exitoso', description: '¡Cuenta creada! Revisa tu correo para confirmar.' });
        navigate(from, { replace: true }); // O a una página de "revisa tu email"
      }
    } catch (error) {
      // Manejo de errores de autenticación
      toast({ title: 'Error de Autenticación', description: error.message || 'Ocurrió un error.', variant: 'destructive' });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4"
    >
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          {/* Título y descripción dinámicos según si es login o registro */}
          <CardTitle className="text-3xl font-bold text-primary">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin ? 'Accede a tu cuenta para continuar.' : 'Únete a educaIA y empieza a aprender.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nombre Completo visible solo en el formulario de registro */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Tu Nombre Completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="text-base"
                />
              </div>
            )}
            {/* Campo de Correo Electrónico */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
              />
            </div>
            {/* Campo de Contraseña con toggle para mostrar/ocultar */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-base pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {/* Campo Confirmar Contraseña visible solo en el formulario de registro, con toggle */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                 <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="text-base pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

            )}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" disabled={loading}>
              {/* Texto del botón dinámico */}
              {loading ? (isLogin ? 'Iniciando Sesión...' : 'Creando Cuenta...') : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm text-accent">
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
          </Button>
          {isLogin && (
            <Link to="/forgot-password" /* Implementar esta ruta si se desea */ className="text-xs text-muted-foreground hover:text-accent">
              ¿Olvidaste tu contraseña?
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthPage;
  