// Firebase Configuration
// This file will be updated with your actual Firebase configuration

// BandhanNova Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYCqzWrTeyiX2nbYKcASYC35Ku7TH8p0g",
  authDomain: "bandhannova-main.firebaseapp.com",
  projectId: "bandhannova-main",
  storageBucket: "bandhannova-main.firebasestorage.app",
  messagingSenderId: "282990746183",
  appId: "1:282990746183:web:3ecf9c58b7aab89cfe6f62",
  measurementId: "G-JGFF1XRHKH"
};

// Initialize Firebase
let app, auth, db;

try {
  // Initialize Firebase App
  app = firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication
  auth = firebase.auth();
  
  // Initialize Firestore Database
  db = firebase.firestore();
  
  // Initialize Firebase Analytics
  if (typeof gtag !== 'undefined') {
    gtag('config', firebaseConfig.measurementId);
    console.log('Firebase Analytics initialized');
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Export Firebase services for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;

// Firebase Authentication State Observer
if (auth) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is signed in:', user.email);
      // Update UI for authenticated user
      updateAuthUI(true, user);
    } else {
      console.log('User is signed out');
      // Update UI for unauthenticated user
      updateAuthUI(false, null);
    }
  });
}

// Update Authentication UI
function updateAuthUI(isAuthenticated, user) {
  const loginLink = document.querySelector('.nav-cta');
  
  if (isAuthenticated && user) {
    if (loginLink) {
      loginLink.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${user.displayName || user.email}</span>
      `;
      loginLink.href = '#';
      loginLink.onclick = (e) => {
        e.preventDefault();
        showUserMenu();
      };
    }
  } else {
    if (loginLink) {
      loginLink.innerHTML = 'Login';
      loginLink.href = 'auth.html';
      loginLink.onclick = null;
    }
  }
}

// Show User Menu
function showUserMenu() {
  // Create user menu dropdown
  const existingMenu = document.querySelector('.user-menu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const userMenu = document.createElement('div');
  userMenu.className = 'user-menu';
  userMenu.innerHTML = `
    <div class="user-menu-content">
      <a href="#" onclick="showProfile()">
        <i class="fas fa-user"></i>
        Profile
      </a>
      <a href="#" onclick="showDashboard()">
        <i class="fas fa-tachometer-alt"></i>
        Dashboard
      </a>
      <a href="#" onclick="showSettings()">
        <i class="fas fa-cog"></i>
        Settings
      </a>
      <hr>
      <a href="#" onclick="signOut()">
        <i class="fas fa-sign-out-alt"></i>
        Sign Out
      </a>
    </div>
  `;

  // Add styles for user menu
  const style = document.createElement('style');
  style.textContent = `
    .user-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      z-index: var(--z-dropdown);
      min-width: 200px;
      animation: slideInDown 0.3s ease-out;
    }
    
    .user-menu-content {
      padding: var(--spacing-sm);
    }
    
    .user-menu a {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: var(--transition-fast);
    }
    
    .user-menu a:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }
    
    .user-menu hr {
      border: none;
      border-top: 1px solid var(--border-primary);
      margin: var(--spacing-sm) 0;
    }
  `;
  
  if (!document.querySelector('style[data-user-menu]')) {
    style.setAttribute('data-user-menu', 'true');
    document.head.appendChild(style);
  }

  const navCta = document.querySelector('.nav-cta');
  navCta.style.position = 'relative';
  navCta.appendChild(userMenu);

  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!navCta.contains(e.target)) {
        userMenu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 100);
}

// User Menu Functions
function showProfile() {
  console.log('Show profile');
  // Implement profile functionality
}

function showDashboard() {
  console.log('Show dashboard');
  // Implement dashboard functionality
}

function showSettings() {
  console.log('Show settings');
  // Implement settings functionality
}

// Sign Out Function
async function signOut() {
  try {
    await auth.signOut();
    showMessage('Successfully signed out!', 'success');
    
    // Redirect to home page after a delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (error) {
    console.error('Sign out error:', error);
    showMessage('Error signing out. Please try again.', 'error');
  }
}

// Google Sign-In Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Export provider for use in auth.js
window.googleProvider = googleProvider;

// Utility function to show messages
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

// Hide message function
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

// Export utility functions
window.showMessage = showMessage;
window.hideMessage = hideMessage;
