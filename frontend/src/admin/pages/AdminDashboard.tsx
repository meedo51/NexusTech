import React, { useState, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { appsApi, heroApi, socialApi } from '../../services/api';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useClickOutside } from '../../hooks/useClickOutside';
import { FiHome, FiImage, FiLink, FiLogOut, FiMenu, FiBox, FiBarChart2, FiChevronLeft, FiUser, FiX, FiMail } from 'react-icons/fi';
import AppsManager from '../components/AppsManager';
import HeroManager from '../components/HeroManager';
import SocialManager from '../components/SocialManager';
import ProfileDashboard from '../components/Profile/ProfileDashboard';
import ContactDashboard from '../components/Contact/ContactDashboard';

const sidebarItems = [
  { path: '/admin/dashboard', label: 'Overview', icon: <FiHome /> },
  { path: '/admin/dashboard/profile', label: 'Profile', icon: <FiUser /> },
  { path: '/admin/dashboard/apps', label: 'Apps', icon: <FiBox /> },
  { path: '/admin/dashboard/hero', label: 'Hero Section', icon: <FiImage /> },
  { path: '/admin/dashboard/social', label: 'Social Links', icon: <FiLink /> },
  { path: '/admin/dashboard/contact', label: 'Contact', icon: <FiMail /> },
];

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const sidebarRef = useClickOutside<HTMLElement>(closeMobileSidebar);

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  const handleNavClick = () => {
    if (isMobile) setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile overlay */}
      {isMobile && mobileSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          bg-[#0a0a0f]/95 backdrop-blur-xl border-r border-white/5
          transition-all duration-300
          ${isMobile
            ? `fixed inset-y-0 left-0 z-50 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `relative ${sidebarOpen ? 'w-64' : 'w-16'}`
          }
          ${isMobile ? 'w-64' : ''}
          overflow-hidden
        `}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <span className={`font-heading font-bold gradient-text text-xl ${!sidebarOpen && !isMobile && 'lg:hidden'}`}>NEXUS</span>
          {isMobile ? (
            <button onClick={closeMobileSidebar} className="p-2 rounded-lg hover:bg-white/5 text-nexus-muted hover:text-white transition-all">
              <FiX />
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5 text-nexus-muted hover:text-white transition-all">
              {sidebarOpen ? <FiChevronLeft /> : <FiMenu />}
            </button>
          )}
        </div>
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-gradient-primary/20 text-white'
                  : 'text-nexus-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className={!sidebarOpen && !isMobile ? 'lg:hidden' : ''}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <div className={`flex items-center gap-3 px-3 py-2 ${!sidebarOpen && !isMobile && 'lg:hidden'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold">{(user.fullName || user.username)?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user.fullName || user.username}</p>
              <p className="text-xs text-nexus-muted truncate">{user.email}</p>
            </div>
            <button onClick={() => { logout(); navigate('/admin/login'); }} className="p-2 rounded-lg hover:bg-white/5 text-nexus-muted hover:text-red-400 transition-all shrink-0">
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen flex flex-col overflow-auto">
        {/* Mobile header with hamburger */}
        {isMobile && (
          <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between px-4 h-14">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-nexus-muted hover:text-white transition-all"
                aria-label="Open navigation menu"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <Link to="/" className="font-heading font-bold gradient-text text-lg">NEXUS</Link>
              <div className="w-9" />
            </div>
          </header>
        )}

        <div className="flex-1 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route index element={<Overview />} />
              <Route path="profile" element={<ProfileDashboard />} />
              <Route path="apps" element={<AppsManager />} />
              <Route path="hero" element={<HeroManager />} />
              <Route path="social" element={<SocialManager />} />
              <Route path="contact" element={<ContactDashboard />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const Overview: React.FC = () => {
  const { data: appsData } = useQuery({ queryKey: ['admin-apps'], queryFn: () => appsApi.getAll().then(r => r.data) });
  const { data: heroData } = useQuery({ queryKey: ['admin-hero'], queryFn: () => heroApi.getAll().then(r => r.data) });
  const { data: socialData } = useQuery({ queryKey: ['admin-socials'], queryFn: () => socialApi.getAll().then(r => r.data) });

  const stats = [
    { label: 'Total Apps', value: appsData?.total || 0, icon: <FiBox />, color: 'from-blue-500 to-purple-500' },
    { label: 'Active Apps', value: appsData?.apps?.filter((a: any) => a.status === 'active').length || 0, icon: <FiBarChart2 />, color: 'from-green-500 to-teal-500' },
    { label: 'Hero Sections', value: heroData?.length || 0, icon: <FiImage />, color: 'from-orange-500 to-pink-500' },
    { label: 'Social Links', value: socialData?.length || 0, icon: <FiLink />, color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 flex items-center justify-center mb-4`}>
              <span className="text-white">{stat.icon}</span>
            </div>
            <p className="text-3xl font-heading font-bold text-white">{stat.value}</p>
            <p className="text-sm text-nexus-muted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
