import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';

// Import Context Hooks
import { useAuth } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './context/LanguageContext';

// Import Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy Load Pages for Better Performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const FreelanceLab = lazy(() => import('./pages/FreelanceLab'));
const AITools = lazy(() => import('./pages/AITools'));
const CommunityPage = lazy(() => import('./pages/Community'));
const NewsPage = lazy(() => import('./pages/News'));
const AboutPage = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const ServicesPage = lazy(() => import('./pages/Services'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const SettingsPage = lazy(() => import('./pages/Settings'));

// 404 Page
const NotFoundPage = lazy(() => import('./pages/NotFound'));

// App Content Component
const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  // Show loading screen while checking authentication
  if (authLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div 
      className={`App min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 ${theme}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
    >
      <Router>
        {/* Header Navigation */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1">
          <Suspense fallback={<Loading fullScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/freelance" element={<FreelanceLab />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={user ? <ProfilePage /> : <Login />} 
              />
              <Route 
                path="/settings" 
                element={user ? <SettingsPage /> : <Login />} 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#1e293b' : '#ffffff',
              color: theme === 'dark' ? '#f1f5f9' : '#1f2937',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e5e7eb'}`,
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </Router>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
