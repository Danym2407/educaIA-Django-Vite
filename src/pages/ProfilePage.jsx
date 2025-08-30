import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, LayoutDashboard, Settings, BarChart3, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProfilePage = () => {
  const location = useLocation();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/profile/overview', label: 'Resumen', icon: <User className="mr-2 h-4 w-4" /> },
    { path: '/profile/dashboard', label: 'Panel de Aprendizaje', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { path: '/profile/stats', label: 'Mis Estadísticas', icon: <BarChart3 className="mr-2 h-4 w-4" /> },
    { path: '/profile/certificates', label: 'Mis Certificados', icon: <GraduationCap className="mr-2 h-4 w-4" /> },
    { path: '/profile/settings', label: 'Configuración', icon: <Settings className="mr-2 h-4 w-4" /> },
  ];

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div></div>;
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-primary">Mi Perfil</h1>
        <p className="text-lg text-muted-foreground">Bienvenido, {profile?.full_name || user.email}</p>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <motion.nav 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:w-1/4 space-y-2"
        >
          {navItems.map(item => (
            <Button
              key={item.path}
              asChild
              variant={location.pathname === item.path || (location.pathname === '/profile' && item.path === '/profile/overview') ? 'default' : 'ghost'}
              className="w-full justify-start text-base py-3"
            >
              <Link to={item.path}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))} 
          <Separator className="my-4" />
          <Button
            variant="ghost"
            className="w-full justify-start text-base py-3 text-red-500 hover:text-red-500 hover:!bg-red-500/10"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </motion.nav>
        
        <Separator orientation="vertical" className="hidden md:block h-auto mx-4" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:flex-grow"
        >
          <Outlet context={{ user, profile }} />
        </motion.div>
      </div>
    </div>
  );
};

// Vista general del perfil (Resumen)
export const ProfileOverview = () => {
  const { user, profile } = useAuth();
  const [enrolledCoursesCount, setEnrolledCoursesCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => { 
      if (user) {
        // Cursos inscritos
        try {
          const token = localStorage.getItem('authToken');
          const res = await fetch(`http://localhost:8000/api/user/courses/count/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('No se pudo cargar el número de cursos.');
          const data = await res.json();
          setEnrolledCoursesCount(data.count || 0);
        } catch (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }

        // Notificaciones recientes
        try {
          const token = localStorage.getItem('authToken');
          const res = await fetch(`http://localhost:8000/api/user/notifications/?limit=5`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('No se pudieron cargar las notificaciones.');
          const data = await res.json();
          setNotifications(data || []);
        } catch (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
      }
    };
    fetchData();
  }, [user, toast]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong className="text-primary">Nombre:</strong> {profile?.full_name || 'No especificado'}</p>
          <p><strong className="text-primary">Correo Electrónico:</strong> {user.email}</p>
          <p><strong className="text-primary">Miembro desde:</strong> {new Date(user.created_at).toLocaleDateString('es-ES')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Resumen de Actividad</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-3xl font-bold text-accent">{enrolledCoursesCount}</p>
            <p className="text-muted-foreground">Cursos Inscritos</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-3xl font-bold text-accent">{notifications.filter(n => !n.is_read).length}</p>
            <p className="text-muted-foreground">Notificaciones Nuevas</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Notificaciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <ul className="space-y-3">
              {notifications.map(notification => (
                <li key={notification.id} className={`p-3 rounded-md ${notification.is_read ? 'bg-muted/30' : 'bg-accent/10 border-l-4 border-accent'}`}>
                  <p className="text-sm text-primary">{notification.message}</p>
                  <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                    <span>{new Date(notification.created_at).toLocaleString('es-ES')}</span>
                    {notification.link && <Link to={notification.link} className="hover:underline text-accent">Ver más</Link>}
                  </div> 
                </li>
              ))} 
            </ul> 
          ) : (
            <p className="text-muted-foreground">No tienes notificaciones recientes.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Componentes placeholder para las otras secciones del perfil (en desarrollo)
export const LearningDashboard = () => <div className="p-6 rounded-lg bg-card border shadow-sm"><h2 className="text-2xl font-semibold mb-4 text-primary">Panel de Aprendizaje</h2><p className="text-muted-foreground">Tu progreso global, calendario de estudio, rutas activas y notificaciones inteligentes se mostrarán aquí. Esta sección está en desarrollo.</p></div>;
export const ProfileStats = () => <div className="p-6 rounded-lg bg-card border shadow-sm"><h2 className="text-2xl font-semibold mb-4 text-primary">Mis Estadísticas y Logros</h2><p className="text-muted-foreground">Estadísticas detalladas sobre tu progreso de aprendizaje y logros obtenidos se mostrarán aquí. Esta sección está en desarrollo.</p></div>;
export const MyCertificates = () => <div className="p-6 rounded-lg bg-card border shadow-sm"><h2 className="text-2xl font-semibold mb-4 text-primary">Mis Certificados</h2><p className="text-muted-foreground">Todos tus certificados obtenidos se listarán aquí para ver y compartir. Esta sección está en desarrollo.</p></div>;

// Configuración de perfil
export const ProfileSettings = () => {
  const { user, profile, fetchProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFullName(profile?.full_name || ''); 
    setAvatarUrl(profile?.avatar_url || ''); 
  }, [profile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          avatar_url: avatarUrl
        })
      });
      if (!res.ok) throw new Error('No se pudo actualizar el perfil');
      toast({ title: 'Éxito', description: 'Perfil actualizado correctamente.' });
      await fetchProfile(token);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Configuración de la Cuenta</CardTitle>
        <CardDescription>Administra tus preferencias de cuenta y datos personales.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-primary">Correo Electrónico</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled className="mt-1 bg-muted/50"/>
            <p className="text-xs text-muted-foreground mt-1">El correo electrónico no se puede cambiar desde aquí.</p>
          </div>
          <div>
            <Label htmlFor="fullName" className="text-primary">Nombre Completo</Label>
            <Input 
              id="fullName" 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="mt-1"
              placeholder="Tu nombre completo"
            />
          </div>
          <div>
            <Label htmlFor="avatarUrl" className="text-primary">URL del Avatar</Label>
            <Input 
              id="avatarUrl" 
              type="url" 
              value={avatarUrl} 
              onChange={(e) => setAvatarUrl(e.target.value)} 
              className="mt-1"
              placeholder="https://ejemplo.com/avatar.png"
            />
             <p className="text-xs text-muted-foreground mt-1">Pega la URL de una imagen para tu avatar.</p>
          </div>
          <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {loading ? 'Actualizando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;