import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and methods
 */
export const useAuth = () => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    // Auth state
    user: context.user,
    token: context.token,
    loading: context.loading,
    isAuthenticated: context.isAuthenticated,
    error: context.error,
    
    // Auth methods
    login: context.login,
    register: context.register,
    loginWithGoogle: context.loginWithGoogle,
    logout: context.logout,
    updateUser: context.updateUser,
    clearError: context.clearError,
    loadUser: context.loadUser,
    
    // Helper methods
    isLoggedIn: () => !!context.user && !!context.token,
    getUserId: () => context.user?._id,
    getUserName: () => context.user?.name,
    getUserEmail: () => context.user?.email,
    getUserAvatar: () => context.user?.avatar,
    getUserRole: () => context.user?.role || 'user',
    isAdmin: () => context.user?.role === 'admin',
    isPremium: () => context.user?.subscription?.type !== 'free'
  };
};
