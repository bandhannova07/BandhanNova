import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

/**
 * 404 Not Found Page Component
 */
const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="text-8xl md:text-9xl font-bold gradient-text mb-4">
            404
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-primary-500 to-secondary-400 mx-auto rounded-full"></div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            onClick={() => window.location.href = '/'}
            size="large"
            className="text-lg px-8 py-4"
          >
            <Home className="mr-2 w-5 h-5" />
            Go Home
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            size="large"
            className="text-lg px-8 py-4"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/search'}
            size="large"
            className="text-lg px-8 py-4"
          >
            <Search className="mr-2 w-5 h-5" />
            Search
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/services" className="text-primary-500 hover:text-primary-600 transition-colors">
              Services
            </a>
            <a href="/freelance" className="text-primary-500 hover:text-primary-600 transition-colors">
              Freelance Lab
            </a>
            <a href="/ai-tools" className="text-primary-500 hover:text-primary-600 transition-colors">
              AI Tools
            </a>
            <a href="/community" className="text-primary-500 hover:text-primary-600 transition-colors">
              Community
            </a>
            <a href="/about" className="text-primary-500 hover:text-primary-600 transition-colors">
              About Us
            </a>
            <a href="/contact" className="text-primary-500 hover:text-primary-600 transition-colors">
              Contact
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
