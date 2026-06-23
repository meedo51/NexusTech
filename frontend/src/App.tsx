import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navigation/Navbar';
import CustomCursor from './components/Effects/CustomCursor';
import ScrollProgress from './components/shared/ScrollProgress';
import LoadingScreen from './components/shared/LoadingScreen';
import ParticleBackground from './components/Effects/ParticleBackground';
import Footer from './components/Footer/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const VerifyEmail = lazy(() => import('./admin/pages/VerifyEmail'));

const App: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          {!isAdmin && <CustomCursor />}
          {!isAdmin && <ParticleBackground />}
          {!isAdmin && <ScrollProgress />}
          {!isAdmin && <Navbar />}
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/profile/verify-email" element={<VerifyEmail />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
            </Routes>
          </AnimatePresence>

          {!isAdmin && <Footer />}
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
