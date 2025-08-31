
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = lazy(() => import('@/pages/HomePage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const CourseViewerPage = lazy(() => import('@/pages/CourseViewerPage'));
const AIToolsPage = lazy(() => import('@/pages/AIToolsPage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const DemosPage = lazy(() => import('@/pages/DemosPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const ArticlePage = lazy(() => import('@/pages/ArticlePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));


const ProfileOverview = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfileOverview })));
const LearningDashboard = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.LearningDashboard })));
const ProfileStats = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfileStats })));
const MyCertificates = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.MyCertificates })));
const ProfileSettings = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfileSettings })));
const ActivateAccountPage = lazy(() => import('@/pages/ActivateAccountPage')); // <--- AGREGAR ESTA LÍNEA

import { AuthProvider } from '@/contexts/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>


const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children ? children : <Outlet />;
};


function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/activate/:uidb64/:token" element={<ActivateAccountPage />} /> {/* <-- AGREGAR ESTA LÍNEA */}

            
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:filter" element={<CoursesPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/courses/view/:courseId" element={<CourseViewerPage />} />
              <Route path="/profile" element={<ProfilePage />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<ProfileOverview />} />
                <Route path="dashboard" element={<LearningDashboard />} />
                <Route path="stats" element={<ProfileStats />} />
                <Route path="certificates" element={<MyCertificates />} />
                <Route path="settings" element={<ProfileSettings />} />
              </Route>
            </Route>

            <Route path="/ai-tools" element={<AIToolsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:articleSlug" element={<ArticlePage />} />
            <Route path="/demos" element={<DemosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
  