import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isPermissionGranted: false,
  settings: {
    email: true,
    push: true,
    updates: true,
    marketing: false
  }
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_PERMISSION: 'SET_PERMISSION',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT'
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      const notifications = action.payload;
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      return {
        ...state,
        notifications,
        unreadCount,
        loading: false,
        error: null
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotification = action.payload;
      const updatedNotifications = [newNotification, ...state.notifications];
      const newUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
      
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: newUnreadCount
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      const notificationId = action.payload;
      const markedNotifications = state.notifications.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      );
      const readUnreadCount = markedNotifications.filter(n => !n.isRead).length;
      
      return {
        ...state,
        notifications: markedNotifications,
        unreadCount: readUnreadCount
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      const allReadNotifications = state.notifications.map(n => ({ ...n, isRead: true }));
      
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const deleteId = action.payload;
      const filteredNotifications = state.notifications.filter(n => n._id !== deleteId);
      const deleteUnreadCount = filteredNotifications.filter(n => !n.isRead).length;
      
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: deleteUnreadCount
      };

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case NOTIFICATION_ACTIONS.SET_PERMISSION:
      return {
        ...state,
        isPermissionGranted: action.payload
      };

    case NOTIFICATION_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case NOTIFICATION_ACTIONS.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload
      };

    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Initialize notifications on mount
  useEffect(() => {
    initializeNotifications();
    requestNotificationPermission();
  }, []);

  // Initialize notifications
  const initializeNotifications = async () => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      
      // Load user notification settings
      const settings = localStorage.getItem('bandhannova-notification-settings');
      if (settings) {
        dispatch({
          type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS,
          payload: JSON.parse(settings)
        });
      }

      // Load notifications from API
      await loadNotifications();
    } catch (error) {
      console.error('Error initializing notifications:', error);
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: 'Failed to initialize notifications'
      });
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_PERMISSION,
        payload: permission === 'granted'
      });
    }
  };

  // Load notifications from API
  const loadNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
        payload: response.data.notifications
      });
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Set empty array if API fails
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
        payload: []
      });
    }
  };

  // Show toast notification
  const showToast = (message, type = 'success', options = {}) => {
    const toastOptions = {
      duration: 4000,
      position: 'bottom-right',
      ...options
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'loading':
        toast.loading(message, toastOptions);
        break;
      case 'info':
      default:
        toast(message, toastOptions);
        break;
    }
  };

  // Show browser notification
  const showBrowserNotification = (title, options = {}) => {
    if (!state.isPermissionGranted || !('Notification' in window)) {
      return;
    }

    const notification = new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'bandhannova',
      renotify: true,
      ...options
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  };

  // Add new notification
  const addNotification = (notification) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: {
        _id: Date.now().toString(),
        isRead: false,
        createdAt: new Date().toISOString(),
        ...notification
      }
    });

    // Show toast for new notifications
    if (notification.showToast !== false) {
      showToast(notification.message, 'info');
    }

    // Show browser notification if enabled
    if (state.settings.push && notification.showBrowser !== false) {
      showBrowserNotification(notification.title, {
        body: notification.message,
        data: notification
      });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      dispatch({
        type: NOTIFICATION_ACTIONS.MARK_AS_READ,
        payload: notificationId
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      dispatch({
        type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION,
        payload: notificationId
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Update notification settings
  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...state.settings, ...newSettings };
      
      // Save to API
      await notificationService.updateSettings(updatedSettings);
      
      // Save to localStorage
      localStorage.setItem('bandhannova-notification-settings', JSON.stringify(updatedSettings));
      
      dispatch({
        type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS,
        payload: newSettings
      });

      showToast('Notification settings updated', 'success');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      showToast('Failed to update settings', 'error');
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await notificationService.clearAllNotifications();
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
        payload: []
      });
      showToast('All notifications cleared', 'success');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      showToast('Failed to clear notifications', 'error');
    }
  };

  // Listen for real-time notifications (WebSocket or Server-Sent Events)
  useEffect(() => {
    // This would be implemented with WebSocket or SSE
    // For now, we'll poll for new notifications periodically
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadNotifications();
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Clear error
  const clearError = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    error: state.error,
    isPermissionGranted: state.isPermissionGranted,
    settings: state.settings,
    showToast,
    showBrowserNotification,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    clearAllNotifications,
    requestNotificationPermission,
    loadNotifications,
    clearError
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

// Export with expected name for compatibility
export const useNotification = () => {
  const context = useNotificationContext();
  return {
    ...context,
    showNotification: context.showToast
  };
};

export default NotificationContext;
