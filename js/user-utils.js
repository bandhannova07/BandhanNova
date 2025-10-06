// User Utility Functions for BandhanNova

// ===== USER PROFILE MANAGEMENT ===== //

// Get current user profile data
async function getUserProfile(userId) {
  try {
    const userDoc = await window.firebaseDb.collection('users').doc(userId).get();
    
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      console.warn('User profile not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Update user profile
async function updateUserProfile(userId, profileData) {
  try {
    const updateData = {
      ...profileData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await window.firebaseDb.collection('users').doc(userId).update(updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
}

// Update user preferences
async function updateUserPreferences(userId, preferences) {
  try {
    await window.firebaseDb.collection('users').doc(userId).update({
      preferences: preferences,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return { success: false, error: error.message };
  }
}

// Update user activity
async function updateUserActivity(userId) {
  try {
    await window.firebaseDb.collection('users').doc(userId).update({
      lastActiveAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.warn('Could not update user activity:', error);
  }
}

// Check if user profile is complete
function isProfileComplete(userData) {
  const requiredFields = ['firstName', 'lastName', 'email'];
  const optionalButImportant = ['phone', 'company', 'designation'];
  
  // Check required fields
  const hasRequiredFields = requiredFields.every(field => 
    userData[field] && userData[field].trim() !== ''
  );
  
  // Check optional important fields (at least 2 should be filled)
  const filledOptionalFields = optionalButImportant.filter(field => 
    userData[field] && userData[field].trim() !== ''
  ).length;
  
  return hasRequiredFields && filledOptionalFields >= 2;
}

// Get user display name
function getUserDisplayName(userData) {
  if (userData.displayName) {
    return userData.displayName;
  }
  
  if (userData.firstName && userData.lastName) {
    return `${userData.firstName} ${userData.lastName}`;
  }
  
  if (userData.firstName) {
    return userData.firstName;
  }
  
  if (userData.email) {
    return userData.email.split('@')[0];
  }
  
  return 'User';
}

// Get user avatar URL
function getUserAvatarUrl(userData) {
  if (userData.photoURL) {
    return userData.photoURL;
  }
  
  // Generate initials-based avatar
  const displayName = getUserDisplayName(userData);
  const initials = displayName.split(' ').map(name => name[0]).join('').toUpperCase();
  
  // Return a placeholder avatar URL with initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=00f5ff&color=000000&size=128`;
}

// ===== USER STATISTICS ===== //

// Get user statistics
async function getUserStats(userId) {
  try {
    const userDoc = await window.firebaseDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    const userData = userDoc.data();
    
    // Calculate days since registration
    const createdAt = userData.createdAt?.toDate();
    const daysSinceRegistration = createdAt ? 
      Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)) : 0;
    
    // Calculate days since last login
    const lastLoginAt = userData.lastLoginAt?.toDate();
    const daysSinceLastLogin = lastLoginAt ? 
      Math.floor((new Date() - lastLoginAt) / (1000 * 60 * 60 * 24)) : 0;
    
    return {
      loginCount: userData.loginCount || 0,
      daysSinceRegistration,
      daysSinceLastLogin,
      profileComplete: userData.profileComplete || false,
      emailVerified: userData.emailVerified || false,
      provider: userData.provider || 'email',
      status: userData.status || 'active',
      role: userData.role || 'user'
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}

// ===== USER VALIDATION ===== //

// Validate user data
function validateUserData(userData) {
  const errors = [];
  
  // Validate required fields
  if (!userData.firstName || userData.firstName.trim() === '') {
    errors.push('First name is required');
  }
  
  if (!userData.lastName || userData.lastName.trim() === '') {
    errors.push('Last name is required');
  }
  
  if (!userData.email || userData.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Invalid email format');
  }
  
  // Validate optional fields
  if (userData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(userData.phone.replace(/\s/g, ''))) {
    errors.push('Invalid phone number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ===== USER PREFERENCES ===== //

// Default user preferences
const DEFAULT_PREFERENCES = {
  newsletter: true,
  notifications: true,
  theme: 'dark',
  language: 'en'
};

// Get user preferences with defaults
function getUserPreferences(userData) {
  return {
    ...DEFAULT_PREFERENCES,
    ...(userData.preferences || {})
  };
}

// ===== EXPORT FUNCTIONS ===== //

// Export functions for global use
window.UserUtils = {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  updateUserActivity,
  isProfileComplete,
  getUserDisplayName,
  getUserAvatarUrl,
  getUserStats,
  validateUserData,
  getUserPreferences,
  DEFAULT_PREFERENCES
};

// Auto-update user activity for authenticated users
if (window.firebaseAuth) {
  window.firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // Update activity every 5 minutes
      setInterval(() => {
        updateUserActivity(user.uid);
      }, 5 * 60 * 1000);
    }
  });
}
