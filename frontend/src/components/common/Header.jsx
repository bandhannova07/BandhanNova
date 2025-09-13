import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Globe,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';

/**
 * Header Component
 * Main navigation header with responsive design
 */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();
  const { unreadCount } = useNotification();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setIsProfileMenuOpen(false);
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigationItems = [
    { name: t('nav.home'), href: '/', key: 'home' },
    { name: t('nav.services'), href: '/services', key: 'services' },
    { name: t('nav.aiTools'), href: '/ai-tools', key: 'ai-tools' },
    { name: t('nav.community'), href: '/community', key: 'community' },
    { name: t('nav.freelance'), href: '/freelance', key: 'freelance' },
    { name: t('nav.news'), href: '/news', key: 'news' },
    { name: t('nav.about'), href: '/about', key: 'about' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">BN</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">BandhanNova</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('tagline')}
                </p>
              </div>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <motion.a
                key={item.key}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>

            {/* Language Selector */}
            <div className="relative dropdown-menu">
              <motion.button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {currentLanguage.code.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </motion.button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {availableLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          changeLanguage(language.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                          currentLanguage.code === language.code 
                            ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{language.flag}</span>
                          <span className="font-medium">{language.name}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            {user && (
              <motion.button
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative dropdown-menu">
                <motion.button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </motion.button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>

                      <a
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {t('profile.title')}
                        </span>
                      </a>

                      <a
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {t('settings.title')}
                        </span>
                      </a>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-red-600 dark:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('auth.logout')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium"
                >
                  {t('auth.login')}
                </a>
                <a
                  href="/register"
                  className="btn btn-primary"
                >
                  {t('auth.register')}
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                {!user && (
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
                    <a
                      href="/login"
                      className="block w-full text-center py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      {t('auth.login')}
                    </a>
                    <a
                      href="/register"
                      className="block w-full text-center btn btn-primary"
                    >
                      {t('auth.register')}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
