import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Modal Component
 * Reusable modal component with animations and accessibility
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  overlayClassName = '',
  contentClassName = ''
}) => {
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-800 rounded-2xl shadow-2xl ${className}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={`p-6 ${contentClassName}`}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Confirmation Modal
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const variantClasses = {
    danger: 'btn-danger',
    warning: 'btn-warning',
    primary: 'btn-primary',
    success: 'btn-success'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <div className="flex space-x-3 justify-center">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${variantClasses[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Alert Modal
export const AlertModal = ({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  type = 'info',
  buttonText = 'OK'
}) => {
  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const typeColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="text-center">
        <div className={`text-4xl mb-4 ${typeColors[type]}`}>
          {typeIcons[type]}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="btn btn-primary"
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};

// Loading Modal
export const LoadingModal = ({
  isOpen,
  title = 'Loading...',
  message = 'Please wait while we process your request.'
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} 
      title={title} 
      size="small"
      showCloseButton={false}
      closeOnOverlayClick={false}
      closeOnEscape={false}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {message}
        </p>
      </div>
    </Modal>
  );
};

// Image Modal
export const ImageModal = ({
  isOpen,
  onClose,
  src,
  alt,
  title
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      size="full"
      className="bg-black/90"
      overlayClassName="bg-black/80"
    >
      <div className="flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </Modal>
  );
};

export default Modal;
