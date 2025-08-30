
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Cpu, Users, Menu, Newspaper, Presentation, LogIn, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const NavItem = ({ to, children, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
        isActive ? 'bg-accent text-accent-foreground' : 'text-primary'
      )
    }
  >
    {icon && React.cloneElement(icon, { className: 'mr-2 h-5 w-5' })}
    {children}
  </NavLink>
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { to: '/courses', label: 'Cursos', icon: <BookOpen /> },
    { to: '/ai-tools', label: 'Herramientas IA', icon: <Cpu /> },
    { to: '/community', label: 'Comunidad', icon: <Users /> },
    { to: '/blog', label: 'Blog', icon: <Newspaper /> },
    { to: '/demos', label: 'Demos', icon: <Presentation /> },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = async () => {
    await signOut();
    closeMobileMenu();
  };

  const getAvatarFallback = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0,2).toUpperCase();
    }
    return 'YO';
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">educa</span>
          <span className="text-2xl font-bold text-accent">IA</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center px-3 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground">
                <BookOpen className="mr-2 h-5 w-5" /> Cursos
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Navegación de Cursos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/courses">Catálogo Completo</Link>
              </DropdownMenuItem>
              {isAuthenticated && (
                <DropdownMenuItem asChild>
                  <Link to="/courses/my-active">Mis Cursos Activos</Link>
                </DropdownMenuItem>
              )}
               <DropdownMenuItem asChild>
                <Link to="/courses/recommended">Recomendados</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {menuItems.filter(item => item.label !== 'Cursos').map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon}>
              {item.label}
            </NavItem>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          {loading ? (
            <div className="h-8 w-8 animate-pulse bg-muted rounded-full"></div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user?.email || 'User')}&background=random`} alt="Avatar de usuario" />
                    <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile?.full_name || user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile/overview">Resumen del Perfil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile/dashboard">Panel de Aprendizaje</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile/settings">Configuración</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10">Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden md:flex">
              <LogIn className="mr-2 h-5 w-5" />
              Iniciar Sesión
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-6 w-6 text-primary" />
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t"
        >
          <nav className="flex flex-col space-y-1 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start flex items-center px-3 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground">
                   <BookOpen className="mr-2 h-5 w-5" /> Cursos
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-2rem)]">
                <DropdownMenuLabel>Navegación de Cursos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/courses" onClick={closeMobileMenu}>Catálogo Completo</Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <DropdownMenuItem asChild>
                    <Link to="/courses/my-active" onClick={closeMobileMenu}>Mis Cursos Activos</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/courses/recommended" onClick={closeMobileMenu}>Recomendados</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {menuItems.filter(item => item.label !== 'Cursos').map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon} onClick={closeMobileMenu}>
                {item.label}
              </NavItem>
            ))}
            <DropdownMenuSeparator />
            {isAuthenticated ? (
              <>
                <NavItem to="/profile/overview" icon={<UserCircle />} onClick={closeMobileMenu}>Mi Perfil</NavItem>
                <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-red-500 hover:text-red-500 hover:!bg-red-500/10">
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <NavItem to="/auth" icon={<LogIn />} onClick={closeMobileMenu}>Iniciar Sesión</NavItem>
            )}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
  