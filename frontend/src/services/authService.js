import api, { apiHelpers } from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  constructor() {
    this.endpoints = {
      login: '/auth/login',
      register: '/auth/register',
      googleLogin: '/auth/google',
      logout: '/auth/logout',
      verifyToken: '/auth/verify',
      refreshToken: '/auth/refresh',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      changePassword: '/auth/change-password',
      updateProfile: '/auth/profile',
      deleteAccount: '/auth/delete-account'
    };
  }

  /**
   * Login with email and password
   * @param {Object} credentials - { email, password }
   * @returns {Promise} API response
   */
  async login(credentials) {
    const response = await api.post(this.endpoints.login, credentials);
    
    // Set auth token for future requests
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, preferredLanguage }
   * @returns {Promise} API response
   */
  async register(userData) {
    const response = await api.post(this.endpoints.register, userData);
    
    // Set auth token for future requests
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Login with Google OAuth
   * @param {string} googleToken - Google OAuth token
   * @returns {Promise} API response
   */
  async googleLogin(googleToken) {
    const response = await api.post(this.endpoints.googleLogin, {
      token: googleToken
    });
    
    // Set auth token for future requests
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Logout user
   * @returns {Promise} API response
   */
  async logout() {
    try {
      const response = await api.post(this.endpoints.logout);
      
      // Remove auth token
      this.removeAuthToken();
      
      return response;
    } catch (error) {
      // Even if logout fails on server, remove token locally
      this.removeAuthToken();
      throw error;
    }
  }

  /**
   * Verify current token
   * @returns {Promise} API response
   */
  async verifyToken() {
    return await api.get(this.endpoints.verifyToken);
  }

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} API response
   */
  async refreshToken(refreshToken) {
    const response = await api.post(this.endpoints.refreshToken, {
      refreshToken
    });
    
    // Update auth token
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Send forgot password email
   * @param {string} email - User email
   * @returns {Promise} API response
   */
  async forgotPassword(email) {
    return await api.post(this.endpoints.forgotPassword, { email });
  }

  /**
   * Reset password with token
   * @param {Object} data - { token, newPassword }
   * @returns {Promise} API response
   */
  async resetPassword(data) {
    return await api.post(this.endpoints.resetPassword, data);
  }

  /**
   * Change password (authenticated user)
   * @param {Object} data - { currentPassword, newPassword }
   * @returns {Promise} API response
   */
  async changePassword(data) {
    return await api.put(this.endpoints.changePassword, data);
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} API response
   */
  async updateProfile(profileData) {
    // Handle file upload if avatar is included
    if (profileData.avatar && profileData.avatar instanceof File) {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (key === 'avatar') {
          formData.append('avatar', profileData.avatar);
        } else {
          formData.append(key, profileData[key]);
        }
      });
      
      return await api.put(this.endpoints.updateProfile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    return await api.put(this.endpoints.updateProfile, profileData);
  }

  /**
   * Delete user account
   * @param {string} password - User password for confirmation
   * @returns {Promise} API response
   */
  async deleteAccount(password) {
    const response = await api.delete(this.endpoints.deleteAccount, {
      data: { password }
    });
    
    // Remove auth token after account deletion
    this.removeAuthToken();
    
    return response;
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    apiHelpers.setAuthToken(token);
  }

  /**
   * Remove authentication token
   */
  removeAuthToken() {
    apiHelpers.removeAuthToken();
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Get current token from cookies
   * @returns {string|null} JWT token
   */
  getToken() {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] || null;
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} Expiration status
   */
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true; // Consider invalid tokens as expired
    }
  }

  /**
   * Get user info from token
   * @param {string} token - JWT token
   * @returns {Object|null} User info
   */
  getUserFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role
      };
    } catch (error) {
      return null;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export { authService };
