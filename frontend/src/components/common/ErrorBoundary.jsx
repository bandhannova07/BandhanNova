import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, Home, Mail } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // This would typically send to an error monitoring service like Sentry
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    // For now, just log to console
    console.error('Error logged:', errorData);
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const subject = encodeURIComponent(`Error Report - ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error Message: ${this.state.error?.message || 'Unknown error'}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
[Your description here]
    `);
    
    window.open(`mailto:support@bandhannova.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-red-900/20 flex items-center justify-center p-4">
          <motion.div
            className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Error Icon */}
            <motion.div
              className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </motion.div>

            {/* Error Title */}
            <motion.h1
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Oops! Something went wrong
            </motion.h1>

            {/* Error Description */}
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We're sorry, but something unexpected happened. Don't worry, our team has been notified and we're working to fix this issue.
            </motion.p>

            {/* Error ID */}
            <motion.div
              className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 mb-6 text-sm text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <strong>Error ID:</strong> {this.state.errorId}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={this.handleRetry}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="btn btn-secondary flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>

              <button
                onClick={this.handleReportError}
                className="btn btn-outline flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Report Issue
              </button>
            </motion.div>

            {/* Additional Actions */}
            <motion.div
              className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Still having trouble?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                <button
                  onClick={this.handleReload}
                  className="text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Reload Page
                </button>
                <span className="hidden sm:inline text-gray-300">•</span>
                <a
                  href="/contact"
                  className="text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Contact Support
                </a>
                <span className="hidden sm:inline text-gray-300">•</span>
                <a
                  href="/help"
                  className="text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Help Center
                </a>
              </div>
            </motion.div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.details
                className="mt-6 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Development Error Details
                </summary>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-xs">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap text-red-700 dark:text-red-300">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-red-700 dark:text-red-300">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (Component, fallback = null) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = () => setError(null);

  const captureError = (error) => {
    setError(error);
    console.error('Error captured:', error);
  };

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

export default ErrorBoundary;
