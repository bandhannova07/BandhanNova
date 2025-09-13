import api from './api';

/**
 * Notification Service
 * Handles all notification-related API calls and push notifications
 */
class NotificationService {
  constructor() {
    this.endpoints = {
      getUserNotifications: '/notifications',
      markAsRead: '/notifications/read',
      markAllAsRead: '/notifications/read-all',
      deleteNotification: '/notifications',
      updateSettings: '/notifications/settings',
      clearAllNotifications: '/notifications/clear',
      sendNotification: '/notifications/send',
      subscribe: '/notifications/subscribe'
    };
  }

  /**
   * Get user notifications
   * @param {Object} params - Query parameters { page, limit, type, unreadOnly }
   * @returns {Promise} API response
   */
  async getUserNotifications(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${this.endpoints.getUserNotifications}?${queryParams}` : this.endpoints.getUserNotifications;
    
    return await api.get(url);
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} API response
   */
  async markAsRead(notificationId) {
    return await api.put(`${this.endpoints.markAsRead}/${notificationId}`);
  }

  /**
   * Mark all notifications as read
   * @returns {Promise} API response
   */
  async markAllAsRead() {
    return await api.put(this.endpoints.markAllAsRead);
  }

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} API response
   */
  async deleteNotification(notificationId) {
    return await api.delete(`${this.endpoints.deleteNotification}/${notificationId}`);
  }

  /**
   * Update notification settings
   * @param {Object} settings - Notification settings
   * @returns {Promise} API response
   */
  async updateSettings(settings) {
    return await api.put(this.endpoints.updateSettings, settings);
  }

  /**
   * Clear all notifications
   * @returns {Promise} API response
   */
  async clearAllNotifications() {
    return await api.delete(this.endpoints.clearAllNotifications);
  }

  /**
   * Send notification (admin only)
   * @param {Object} notification - Notification data
   * @returns {Promise} API response
   */
  async sendNotification(notification) {
    return await api.post(this.endpoints.sendNotification, notification);
  }

  /**
   * Subscribe to push notifications
   * @param {Object} subscription - Push subscription object
   * @returns {Promise} API response
   */
  async subscribeToPush(subscription) {
    return await api.post(this.endpoints.subscribe, { subscription });
  }

  /**
   * Request notification permission and setup service worker
   * @returns {Promise<boolean>} Permission granted status
   */
  async requestPermissionAndSetup() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (!('serviceWorker' in navigator)) {
      console.warn('This browser does not support service workers');
      return false;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      // Subscribe to push notifications
      const subscription = await this.subscribeToPushNotifications(registration);
      
      if (subscription) {
        // Send subscription to backend
        await this.subscribeToPush(subscription);
        console.log('Push subscription successful');
      }

      return true;
    } catch (error) {
      console.error('Error setting up notifications:', error);
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   * @param {ServiceWorkerRegistration} registration - Service worker registration
   * @returns {Promise<PushSubscription|null>} Push subscription
   */
  async subscribeToPushNotifications(registration) {
    try {
      const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        console.warn('VAPID public key not configured');
        return null;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   * @param {string} base64String - Base64 encoded VAPID key
   * @returns {Uint8Array} Converted key
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Show local notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @returns {Notification} Notification instance
   */
  showLocalNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.warn('Notifications not available or permission not granted');
      return null;
    }

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'bandhannova',
      renotify: true,
      requireInteraction: false,
      silent: false,
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    // Auto close after 5 seconds if not persistent
    if (!defaultOptions.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    return notification;
  }

  /**
   * Create notification types for different scenarios
   */
  notificationTypes = {
    /**
     * Admin update notification
     * @param {string} message - Update message
     * @param {string} actionUrl - Optional action URL
     */
    adminUpdate: (message, actionUrl = null) => ({
      type: 'update',
      title: 'BandhanNova Update',
      message,
      actionUrl,
      showToast: true,
      showBrowser: true
    }),

    /**
     * New article notification
     * @param {string} title - Article title
     * @param {string} slug - Article slug
     */
    newArticle: (title, slug) => ({
      type: 'announcement',
      title: 'New Article Published',
      message: `Check out our latest article: ${title}`,
      actionUrl: `/articles/${slug}`,
      showToast: true,
      showBrowser: true
    }),

    /**
     * Tech news notification
     * @param {string} title - News title
     * @param {string} slug - News slug
     */
    techNews: (title, slug) => ({
      type: 'announcement',
      title: 'Tech News Update',
      message: title,
      actionUrl: `/tech-news/${slug}`,
      showToast: true,
      showBrowser: true
    }),

    /**
     * Freelance order update
     * @param {string} status - Order status
     * @param {string} orderId - Order ID
     */
    freelanceUpdate: (status, orderId) => ({
      type: 'order',
      title: 'Freelance Order Update',
      message: `Your order status has been updated to: ${status}`,
      actionUrl: `/freelance/orders/${orderId}`,
      showToast: true,
      showBrowser: true
    }),

    /**
     * Payment confirmation
     * @param {number} amount - Payment amount
     * @param {string} service - Service name
     */
    paymentConfirmed: (amount, service) => ({
      type: 'payment',
      title: 'Payment Confirmed',
      message: `Your payment of ₹${amount} for ${service} has been confirmed`,
      showToast: true,
      showBrowser: true
    }),

    /**
     * Community post interaction
     * @param {string} action - Action type (like, comment)
     * @param {string} postId - Post ID
     */
    communityInteraction: (action, postId) => ({
      type: 'system',
      title: 'Community Interaction',
      message: `Someone ${action}d your post`,
      actionUrl: `/community/posts/${postId}`,
      showToast: false,
      showBrowser: true
    }),

    /**
     * System maintenance notification
     * @param {string} message - Maintenance message
     * @param {Date} scheduledTime - Scheduled maintenance time
     */
    systemMaintenance: (message, scheduledTime) => ({
      type: 'system',
      title: 'Scheduled Maintenance',
      message: `${message} Scheduled for: ${scheduledTime.toLocaleString()}`,
      showToast: true,
      showBrowser: true
    })
  };

  /**
   * Send bulk notifications to all users (admin only)
   * @param {Object} notification - Notification data
   * @param {Array} userIds - Optional array of specific user IDs
   * @returns {Promise} API response
   */
  async sendBulkNotification(notification, userIds = null) {
    return await api.post(`${this.endpoints.sendNotification}/bulk`, {
      notification,
      userIds
    });
  }

  /**
   * Get notification statistics (admin only)
   * @returns {Promise} API response
   */
  async getNotificationStats() {
    return await api.get(`${this.endpoints.getUserNotifications}/stats`);
  }

  /**
   * Test notification functionality
   * @returns {Promise<boolean>} Test result
   */
  async testNotifications() {
    try {
      // Test local notification
      const localNotification = this.showLocalNotification('Test Notification', {
        body: 'This is a test notification from BandhanNova',
        tag: 'test'
      });

      if (!localNotification) {
        throw new Error('Local notification failed');
      }

      // Test API notification
      await this.sendNotification({
        type: 'system',
        title: 'Test Notification',
        message: 'This is a test notification from the API',
        isGlobal: false
      });

      console.log('Notification test successful');
      return true;
    } catch (error) {
      console.error('Notification test failed:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const notificationService = new NotificationService();
export { notificationService };
