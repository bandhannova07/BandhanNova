// Authentication JavaScript for BandhanNova

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  initializeAuthForms();
  initializePasswordToggles();
  initializeFormSwitching();
  initializeMessageHandling();
});

// ===== FORM INITIALIZATION ===== //
function initializeAuthForms() {
  const loginForm = document.getElementById('loginFormElement');
  const signupForm = document.getElementById('signupFormElement');
  const resetForm = document.getElementById('resetFormElement');
  
  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Signup form
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Reset form
  if (resetForm) {
    resetForm.addEventListener('submit', handlePasswordReset);
  }
  
  // Google Sign-In buttons
  const googleSignInBtn = document.getElementById('googleSignIn');
  const googleSignUpBtn = document.getElementById('googleSignUp');
  
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', handleGoogleSignIn);
  }
  
  if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener('click', handleGoogleSignIn);
  }
  
  // Form field animations and validation
  initializeFormFields();
}

// ===== FORM FIELD HANDLING ===== //
function initializeFormFields() {
  const formGroups = document.querySelectorAll('.form-group');
  
  formGroups.forEach(group => {
    const input = group.querySelector('input');
    const label = group.querySelector('label');
    
    if (input && label) {
      // Focus events
      input.addEventListener('focus', () => {
        group.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value.trim()) {
          group.classList.remove('focused');
        }
        validateField(input);
      });
      
      // Input events
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          group.classList.add('has-value');
        } else {
          group.classList.remove('has-value');
        }
        
        // Clear previous validation states
        clearFieldValidation(group);
      });
      
      // Check if field has value on load
      if (input.value.trim()) {
        group.classList.add('has-value', 'focused');
      }
    }
  });
}

// ===== PASSWORD TOGGLES ===== //
function initializePasswordToggles() {
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// ===== FORM SWITCHING ===== //
function initializeFormSwitching() {
  const authSwitches = document.querySelectorAll('.auth-switch');
  const forgotPasswordLink = document.querySelector('.forgot-password');
  
  authSwitches.forEach(switchLink => {
    switchLink.addEventListener('click', function(e) {
      e.preventDefault();
      const targetForm = this.getAttribute('data-target');
      switchAuthForm(targetForm);
    });
  });
  
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      switchAuthForm('resetForm');
    });
  }
}

function switchAuthForm(targetFormId) {
  const currentForm = document.querySelector('.auth-form-container.active');
  const targetForm = document.getElementById(targetFormId);
  
  if (currentForm && targetForm && currentForm !== targetForm) {
    // Slide out current form
    currentForm.classList.add('slide-out');
    
    setTimeout(() => {
      currentForm.classList.remove('active', 'slide-out');
      targetForm.classList.add('active');
      targetForm.classList.add('slide-in');
      
      setTimeout(() => {
        targetForm.classList.remove('slide-in');
      }, 300);
    }, 300);
  }
}

// ===== AUTHENTICATION HANDLERS ===== //

// Handle Login
async function handleLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  const rememberMe = form.rememberMe?.checked || false;
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Validate inputs
  if (!validateLoginForm(email, password)) {
    return;
  }
  
  // Add loading state
  setButtonLoading(submitButton, true);
  
  try {
    // Sign in with Firebase Auth
    const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Set persistence based on remember me
    if (rememberMe) {
      await window.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } else {
      await window.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }
    
    // Update user login data
    try {
      await window.firebaseDb.collection('users').doc(user.uid).update({
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastActiveAt: firebase.firestore.FieldValue.serverTimestamp(),
        loginCount: firebase.firestore.FieldValue.increment(1)
      });
    } catch (error) {
      console.warn('Could not update user login data:', error);
    }
    
    showMessage('Login successful! Welcome back.', 'success');
    
    // Redirect after successful login
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
    }
    
    showMessage(errorMessage, 'error');
  } finally {
    setButtonLoading(submitButton, false);
  }
}

// Handle Signup
async function handleSignup(e) {
  e.preventDefault();
  
  const form = e.target;
  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const agreeTerms = form.agreeTerms.checked;
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Validate inputs
  if (!validateSignupForm(firstName, lastName, email, password, confirmPassword, agreeTerms)) {
    return;
  }
  
  // Add loading state
  setButtonLoading(submitButton, true);
  
  try {
    // Create user with Firebase Auth
    const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Update user profile
    await user.updateProfile({
      displayName: `${firstName} ${lastName}`
    });
    
    // Save additional user data to Firestore
    await window.firebaseDb.collection('users').doc(user.uid).set({
      // Basic Information
      firstName: firstName,
      lastName: lastName,
      displayName: `${firstName} ${lastName}`,
      email: email,
      
      // Authentication Details
      provider: 'email',
      emailVerified: user.emailVerified,
      photoURL: user.photoURL || '',
      
      // Timestamps
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      
      // Profile Information (Optional)
      phone: '',
      company: '',
      designation: '',
      location: '',
      
      // Preferences
      preferences: {
        newsletter: true,
        notifications: true,
        theme: 'dark',
        language: 'en'
      },
      
      // Account Status
      status: 'active',
      role: 'user',
      
      // Additional Data
      loginCount: 1,
      lastActiveAt: firebase.firestore.FieldValue.serverTimestamp(),
      profileComplete: false,
      
      // Social Links (Optional)
      socialLinks: {
        linkedin: '',
        github: '',
        twitter: ''
      }
    });
    
    // Send email verification
    await user.sendEmailVerification();
    
    showMessage('Account created successfully! Please check your email for verification.', 'success');
    
    // Switch to login form
    setTimeout(() => {
      switchAuthForm('loginForm');
    }, 2000);
    
  } catch (error) {
    console.error('Signup error:', error);
    
    let errorMessage = 'Account creation failed. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters long.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled.';
        break;
    }
    
    showMessage(errorMessage, 'error');
  } finally {
    setButtonLoading(submitButton, false);
  }
}

// Handle Password Reset
async function handlePasswordReset(e) {
  e.preventDefault();
  
  const form = e.target;
  const email = form.email.value.trim();
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Validate email
  if (!validateEmail(email)) {
    showFieldError(form.email, 'Please enter a valid email address.');
    return;
  }
  
  // Add loading state
  setButtonLoading(submitButton, true);
  
  try {
    // Send password reset email
    await window.firebaseAuth.sendPasswordResetEmail(email);
    
    showMessage('Password reset email sent! Check your inbox.', 'success');
    
    // Switch to login form
    setTimeout(() => {
      switchAuthForm('loginForm');
    }, 2000);
    
  } catch (error) {
    console.error('Password reset error:', error);
    
    let errorMessage = 'Failed to send reset email. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
    }
    
    showMessage(errorMessage, 'error');
  } finally {
    setButtonLoading(submitButton, false);
  }
}

// Handle Google Sign-In
async function handleGoogleSignIn() {
  try {
    const result = await window.firebaseAuth.signInWithPopup(window.googleProvider);
    const user = result.user;
    
    // Check if this is a new user
    const isNewUser = result.additionalUserInfo?.isNewUser;
    
    if (isNewUser) {
      // Save new user data to Firestore
      await window.firebaseDb.collection('users').doc(user.uid).set({
        // Basic Information
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        displayName: user.displayName || '',
        email: user.email,
        
        // Authentication Details
        provider: 'google',
        emailVerified: user.emailVerified,
        photoURL: user.photoURL || '',
        
        // Timestamps
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        
        // Profile Information (Optional)
        phone: '',
        company: '',
        designation: '',
        location: '',
        
        // Preferences
        preferences: {
          newsletter: true,
          notifications: true,
          theme: 'dark',
          language: 'en'
        },
        
        // Account Status
        status: 'active',
        role: 'user',
        
        // Additional Data
        loginCount: 1,
        lastActiveAt: firebase.firestore.FieldValue.serverTimestamp(),
        profileComplete: true, // Google users have more complete profiles
        
        // Social Links (Optional)
        socialLinks: {
          linkedin: '',
          github: '',
          twitter: ''
        }
      });
      
      showMessage('Account created successfully! Welcome to BandhanNova.', 'success');
    } else {
      // Update last login time and login count
      await window.firebaseDb.collection('users').doc(user.uid).update({
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastActiveAt: firebase.firestore.FieldValue.serverTimestamp(),
        loginCount: firebase.firestore.FieldValue.increment(1)
      });
      
      showMessage('Welcome back! Login successful.', 'success');
    }
    
    // Redirect after successful authentication
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    let errorMessage = 'Google sign-in failed. Please try again.';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign-in cancelled. Please try again.';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup blocked. Please allow popups and try again.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign-in cancelled. Please try again.';
        break;
    }
    
    showMessage(errorMessage, 'error');
  }
}

// ===== VALIDATION FUNCTIONS ===== //

function validateLoginForm(email, password) {
  let isValid = true;
  
  // Clear previous errors
  clearAllFieldValidation();
  
  // Validate email
  if (!email) {
    showFieldError(document.getElementById('loginEmail'), 'Email is required.');
    isValid = false;
  } else if (!validateEmail(email)) {
    showFieldError(document.getElementById('loginEmail'), 'Please enter a valid email address.');
    isValid = false;
  }
  
  // Validate password
  if (!password) {
    showFieldError(document.getElementById('loginPassword'), 'Password is required.');
    isValid = false;
  }
  
  return isValid;
}

function validateSignupForm(firstName, lastName, email, password, confirmPassword, agreeTerms) {
  let isValid = true;
  
  // Clear previous errors
  clearAllFieldValidation();
  
  // Validate first name
  if (!firstName) {
    showFieldError(document.getElementById('firstName'), 'First name is required.');
    isValid = false;
  }
  
  // Validate last name
  if (!lastName) {
    showFieldError(document.getElementById('lastName'), 'Last name is required.');
    isValid = false;
  }
  
  // Validate email
  if (!email) {
    showFieldError(document.getElementById('signupEmail'), 'Email is required.');
    isValid = false;
  } else if (!validateEmail(email)) {
    showFieldError(document.getElementById('signupEmail'), 'Please enter a valid email address.');
    isValid = false;
  }
  
  // Validate password
  if (!password) {
    showFieldError(document.getElementById('signupPassword'), 'Password is required.');
    isValid = false;
  } else if (password.length < 6) {
    showFieldError(document.getElementById('signupPassword'), 'Password must be at least 6 characters long.');
    isValid = false;
  }
  
  // Validate confirm password
  if (!confirmPassword) {
    showFieldError(document.getElementById('confirmPassword'), 'Please confirm your password.');
    isValid = false;
  } else if (password !== confirmPassword) {
    showFieldError(document.getElementById('confirmPassword'), 'Passwords do not match.');
    isValid = false;
  }
  
  // Validate terms agreement
  if (!agreeTerms) {
    showMessage('Please agree to the Terms of Service and Privacy Policy.', 'error');
    isValid = false;
  }
  
  return isValid;
}

function validateField(input) {
  const value = input.value.trim();
  const fieldType = input.type;
  const fieldName = input.name;
  
  // Clear previous validation
  clearFieldValidation(input.closest('.form-group'));
  
  if (!value && input.required) {
    showFieldError(input, `${getFieldLabel(fieldName)} is required.`);
    return false;
  }
  
  if (fieldType === 'email' && value && !validateEmail(value)) {
    showFieldError(input, 'Please enter a valid email address.');
    return false;
  }
  
  if (fieldType === 'password' && value && value.length < 6) {
    showFieldError(input, 'Password must be at least 6 characters long.');
    return false;
  }
  
  // Show success state for valid fields
  showFieldSuccess(input);
  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getFieldLabel(fieldName) {
  const labels = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password'
  };
  return labels[fieldName] || fieldName;
}

// ===== FIELD VALIDATION UI ===== //

function showFieldError(input, message) {
  const formGroup = input.closest('.form-group');
  formGroup.classList.add('error');
  formGroup.classList.remove('success');
  
  // Remove existing error message
  const existingError = formGroup.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error message
  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  formGroup.appendChild(errorElement);
}

function showFieldSuccess(input) {
  const formGroup = input.closest('.form-group');
  formGroup.classList.add('success');
  formGroup.classList.remove('error');
  
  // Remove error message
  const existingError = formGroup.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
}

function clearFieldValidation(formGroup) {
  formGroup.classList.remove('error', 'success');
  const errorElement = formGroup.querySelector('.form-error');
  if (errorElement) {
    errorElement.remove();
  }
}

function clearAllFieldValidation() {
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => clearFieldValidation(group));
}

// ===== BUTTON LOADING STATE ===== //

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

// ===== MESSAGE HANDLING ===== //

function initializeMessageHandling() {
  const messageClose = document.getElementById('messageClose');
  
  if (messageClose) {
    messageClose.addEventListener('click', hideMessage);
  }
}

function showMessage(message, type = 'info', duration = 5000) {
  const messageContainer = document.getElementById('messageContainer');
  if (!messageContainer) return;

  const messageElement = document.getElementById('message');
  const messageIcon = messageElement.querySelector('.message-icon');
  const messageText = messageElement.querySelector('.message-text');

  // Set message content
  messageText.textContent = message;
  
  // Set message type and icon
  messageElement.className = `message ${type}`;
  
  switch (type) {
    case 'success':
      messageIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
      break;
    case 'error':
      messageIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
      break;
    case 'warning':
      messageIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    case 'info':
    default:
      messageIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
      break;
  }

  // Show message
  messageContainer.style.display = 'block';
  setTimeout(() => {
    messageElement.classList.add('show');
  }, 100);

  // Auto-hide message
  setTimeout(() => {
    hideMessage();
  }, duration);
}

function hideMessage() {
  const messageElement = document.getElementById('message');
  if (messageElement) {
    messageElement.classList.remove('show');
    setTimeout(() => {
      const messageContainer = document.getElementById('messageContainer');
      if (messageContainer) {
        messageContainer.style.display = 'none';
      }
    }, 300);
  }
}

// Export functions for global use
window.showMessage = showMessage;
window.hideMessage = hideMessage;
