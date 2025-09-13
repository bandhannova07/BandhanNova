import { useNotificationContext } from '../context/NotificationContext';

/**
 * Custom hook for notification management
 * Provides easy access to notification state and methods
 */
export const useNotification = () => {
  const context = useNotificationContext();
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return {
    // Notification state
    notifications: context.notifications,
    unreadCount: context.unreadCount,
    loading: context.loading,
    error: context.error,
    isPermissionGranted: context.isPermissionGranted,
    settings: context.settings,
    
    // Notification methods
    showToast: context.showToast,
    showBrowserNotification: context.showBrowserNotification,
    addNotification: context.addNotification,
    markAsRead: context.markAsRead,
    markAllAsRead: context.markAllAsRead,
    deleteNotification: context.deleteNotification,
    updateSettings: context.updateSettings,
    clearAllNotifications: context.clearAllNotifications,
    requestNotificationPermission: context.requestNotificationPermission,
    loadNotifications: context.loadNotifications,
    clearError: context.clearError,
    
    // Helper methods
    hasUnreadNotifications: () => context.unreadCount > 0,
    getUnreadCount: () => context.unreadCount,
    getTotalCount: () => context.notifications.length,
    
    // Get notifications by type
    getNotificationsByType: (type) => context.notifications.filter(n => n.type === type),
    getUnreadNotifications: () => context.notifications.filter(n => !n.isRead),
    getRecentNotifications: (limit = 5) => context.notifications.slice(0, limit),
    
    // Quick toast methods
    success: (message, options) => context.showToast(message, 'success', options),
    error: (message, options) => context.showToast(message, 'error', options),
    info: (message, options) => context.showToast(message, 'info', options),
    loading: (message, options) => context.showToast(message, 'loading', options),
    
    // Settings helpers
    isEmailEnabled: () => context.settings.email,
    isPushEnabled: () => context.settings.push,
    isUpdatesEnabled: () => context.settings.updates,
    isMarketingEnabled: () => context.settings.marketing,
    
    // Permission helpers
    canShowBrowserNotifications: () => context.isPermissionGranted && 'Notification' in window,
    getPermissionStatus: () => {
      if (!('Notification' in window)) return 'not-supported';
      return Notification.permission;
    }
  };
};
