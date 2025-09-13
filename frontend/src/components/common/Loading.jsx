import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loading Component
 * Displays loading spinner with BandhanNova branding
 */
const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  // Spinner animation variants
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Pulse animation variants
  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Dots animation variants
  const dotsVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const LoadingSpinner = () => (
    <motion.div
      className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-500 rounded-full`}
      variants={spinnerVariants}
      animate="animate"
    />
  );

  const LoadingPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full`}
      variants={pulseVariants}
      animate="animate"
    />
  );

  const LoadingDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-primary-500 rounded-full"
          variants={dotsVariants}
          animate="animate"
          style={{
            animationDelay: `${index * 0.2}s`
          }}
        />
      ))}
    </div>
  );

  const LoadingBars = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="w-2 bg-primary-500 rounded-full"
          style={{ height: '20px' }}
          animate={{
            scaleY: [1, 2, 1],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.1
            }
          }}
        />
      ))}
    </div>
  );

  const renderLoadingVariant = () => {
    switch (variant) {
      case 'pulse':
        return <LoadingPulse />;
      case 'dots':
        return <LoadingDots />;
      case 'bars':
        return <LoadingBars />;
      case 'spinner':
      default:
        return <LoadingSpinner />;
    }
  };

  const LoadingContent = () => (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderLoadingVariant()}
      
      {text && (
        <motion.p
          className={`${textSizes[size]} text-gray-600 dark:text-gray-300 font-medium`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl font-bold gradient-text mb-2">
              BandhanNova
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Innovating Tomorrow, Today
            </div>
          </motion.div>
          <LoadingContent />
        </div>
      </motion.div>
    );
  }

  return <LoadingContent />;
};

// Loading overlay component
export const LoadingOverlay = ({ isVisible, children, ...props }) => {
  if (!isVisible) return children;

  return (
    <div className="relative">
      {children}
      <motion.div
        className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loading {...props} />
      </motion.div>
    </div>
  );
};

// Loading skeleton component
export const LoadingSkeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  count = 1,
  spacing = 'space-y-2'
}) => {
  return (
    <div className={count > 1 ? spacing : ''}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
};

// Loading button component
export const LoadingButton = ({ 
  loading, 
  children, 
  disabled, 
  className = '',
  loadingText = 'Loading...',
  ...props 
}) => {
  return (
    <button
      className={`relative ${className} ${loading ? 'cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loading 
            size="small" 
            variant="spinner" 
            text={loadingText}
          />
        </div>
      )}
    </button>
  );
};

// Page loading component with progress
export const PageLoading = ({ progress = null, message = 'Loading page...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-5xl font-bold gradient-text mb-3">
            BandhanNova
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Innovating Tomorrow, Today
          </div>
        </motion.div>

        <Loading size="large" variant="pulse" text={message} />

        {progress !== null && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-secondary-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {progress}% complete
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Loading;
