// BandhanNova Main JavaScript

// Global state management
const BandhanNova = {
    user: null,
    progress: {},
    achievements: [],
    settings: {
        theme: 'light',
        animations: true,
        sound: true
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
    startAnimations();
});

// Initialize the application
function initializeApp() {
    console.log('🚀 BandhanNova initializing...');
    
    // Load user preferences
    loadSettings();
    
    // Initialize components
    initializeNavigation();
    initializeScrollReveal();
    initializeCounters();
    initializeProgressBars();
    
    // Copy protection
    setupCopyProtection();
    
    console.log('✅ BandhanNova initialized successfully');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Hub cards hover effects
    document.querySelectorAll('.hub-card').forEach(card => {
        card.addEventListener('mouseenter', handleHubCardHover);
        card.addEventListener('mouseleave', handleHubCardLeave);
    });
    
    // Window scroll events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
}

// Navigation functions
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }
}

// Scroll reveal animation
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe elements with scroll reveal classes
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Progress bar animation
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Animation functions
function startAnimations() {
    // Typing animation for hero title
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        setTimeout(() => {
            typingText.classList.add('no-cursor');
        }, 3000);
    }
    
    // Stagger animations
    document.querySelectorAll('.stagger-animation').forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

// Hub card interactions
function handleHubCardHover(e) {
    const card = e.currentTarget;
    const hubType = card.getAttribute('data-hub');
    
    // Add hover effects based on hub type
    switch(hubType) {
        case 'tech':
            card.style.transform = 'translateY(-8px) rotateX(5deg)';
            break;
        case 'entertainment':
            card.style.transform = 'translateY(-8px) rotateZ(2deg)';
            break;
        case 'dark-mind':
            card.style.transform = 'translateY(-8px) scale(1.02)';
            break;
        case 'youth':
            card.style.transform = 'translateY(-8px) rotateY(5deg)';
            break;
    }
}

function handleHubCardLeave(e) {
    const card = e.currentTarget;
    card.style.transform = '';
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Message sent successfully!', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Scroll handling
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Parallax effect for floating orbs
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.1);
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    // Update active navigation link
    updateActiveNavLink();
}

function handleResize() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Copy protection
function setupCopyProtection() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showNotification('Content is protected', 'warning');
    });
    
    // Disable common keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+C
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u') ||
            (e.ctrlKey && e.key === 's') ||
            (e.ctrlKey && e.key === 'a') ||
            (e.ctrlKey && e.key === 'c')) {
            e.preventDefault();
            showNotification('This action is not allowed', 'warning');
        }
    });
    
    // Add watermark
    addWatermark();
}

function addWatermark() {
    const watermark = document.createElement('div');
    watermark.textContent = 'BandhanNova © 2024';
    watermark.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 12px;
        color: rgba(2, 86, 155, 0.3);
        pointer-events: none;
        z-index: 9999;
        font-family: var(--font-family);
    `;
    document.body.appendChild(watermark);
}

// Notification system
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} notification-slide-in`;
    
    const icons = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]} notification-icon"></i>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="closeNotification(this.parentElement)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        closeNotification(notification);
    }, duration);
}

function closeNotification(notification) {
    notification.classList.remove('notification-slide-in');
    notification.classList.add('notification-slide-out');
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// Local storage functions
function saveToStorage(key, data) {
    try {
        localStorage.setItem(`bandhannova_${key}`, JSON.stringify(data));
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(`bandhannova_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        return null;
    }
}

function loadSettings() {
    const savedSettings = loadFromStorage('settings');
    if (savedSettings) {
        BandhanNova.settings = { ...BandhanNova.settings, ...savedSettings };
    }
}

function saveSettings() {
    saveToStorage('settings', BandhanNova.settings);
}

function loadUserData() {
    const userData = loadFromStorage('user');
    const progressData = loadFromStorage('progress');
    const achievementsData = loadFromStorage('achievements');
    
    if (userData) BandhanNova.user = userData;
    if (progressData) BandhanNova.progress = progressData;
    if (achievementsData) BandhanNova.achievements = achievementsData;
}

function saveUserData() {
    saveToStorage('user', BandhanNova.user);
    saveToStorage('progress', BandhanNova.progress);
    saveToStorage('achievements', BandhanNova.achievements);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization
const debouncedScroll = debounce(handleScroll, 10);
const throttledResize = throttle(handleResize, 250);

window.addEventListener('scroll', debouncedScroll);
window.addEventListener('resize', throttledResize);

// Export for global access
window.BandhanNova = BandhanNova;
window.showNotification = showNotification;
