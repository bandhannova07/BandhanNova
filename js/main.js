// Main JavaScript for BandhanNova Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeScrollEffects();
  initializeAnimations();
  initializeContactForm();
  initializeParticles();
  initializeLazyLoading();
});

// ===== NAVIGATION ===== //
function initializeNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Navbar scroll effect
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (navbar) {
      if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    lastScrollY = currentScrollY;
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  });
}

// ===== SCROLL EFFECTS ===== //
function initializeScrollEffects() {
  // Intersection Observer for scroll animations
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

  // Observe elements for scroll animations
  const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
  scrollElements.forEach(el => observer.observe(el));

  // Stagger animation for grid items
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const staggerItems = entry.target.querySelectorAll('.stagger-item');
        staggerItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animate');
          }, index * 100);
        });
      }
    });
  }, observerOptions);

  const staggerContainers = document.querySelectorAll('.services-grid, .projects-grid, .team-grid');
  staggerContainers.forEach(container => {
    const items = container.querySelectorAll('.service-card, .project-card, .team-card');
    items.forEach(item => item.classList.add('stagger-item'));
    staggerObserver.observe(container);
  });

  // Parallax effect for hero section
  const hero = document.querySelector('.hero');
  const heroParticles = document.querySelector('.hero-particles');
  
  if (hero && heroParticles) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroParticles.style.transform = `translateY(${rate}px)`;
    });
  }
}

// ===== ANIMATIONS ===== //
function initializeAnimations() {
  // Typing animation for hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const titleLines = heroTitle.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
      line.style.animationDelay = `${index * 0.2}s`;
    });
  }

  // Counter animation for stats
  const stats = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statsObserver.observe(stat));

  // Tech circle rotation
  const techCircle = document.querySelector('.tech-circle');
  if (techCircle) {
    let rotation = 0;
    setInterval(() => {
      rotation += 0.5;
      techCircle.style.transform = `rotate(${rotation}deg)`;
    }, 50);
  }

  // Button hover effects
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Card hover effects
  const cards = document.querySelectorAll('.service-card, .project-card, .team-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Counter animation function
function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/\D/g, ''));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    const suffix = element.textContent.replace(/\d/g, '').replace('+', '');
    element.textContent = Math.floor(current) + suffix;
  }, 16);
}

// ===== CONTACT FORM ===== //
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  // Form field animations
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    const input = group.querySelector('input, textarea, select');
    const label = group.querySelector('label');
    
    if (input && label) {
      input.addEventListener('focus', () => {
        group.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          group.classList.remove('focused');
        }
      });
      
      input.addEventListener('input', () => {
        if (input.value) {
          group.classList.add('has-value');
        } else {
          group.classList.remove('has-value');
        }
      });
    }
  });
}

// Handle contact form submission
async function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  
  // Add loading state
  submitButton.classList.add('loading');
  submitButton.disabled = true;
  
  try {
    // Validate form
    if (!validateContactForm(formData)) {
      throw new Error('Please fill in all required fields correctly.');
    }
    
    // Submit to Firebase Firestore
    if (window.firebaseDb) {
      const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        service: formData.get('service'),
        message: formData.get('message'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'new'
      };
      
      await window.firebaseDb.collection('contacts').add(contactData);
      
      // Show success message
      showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
      
      // Reset form
      form.reset();
      
      // Remove form field states
      const formGroups = form.querySelectorAll('.form-group');
      formGroups.forEach(group => {
        group.classList.remove('focused', 'has-value');
      });
      
    } else {
      throw new Error('Database connection not available. Please try again later.');
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    showMessage(error.message || 'Something went wrong. Please try again.', 'error');
  } finally {
    // Remove loading state
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
  }
}

// Validate contact form
function validateContactForm(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const service = formData.get('service');
  const message = formData.get('message');
  
  // Check required fields
  if (!name || !email || !service || !message) {
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  
  return true;
}

// ===== PARTICLES ===== //
function initializeParticles() {
  const particleContainers = document.querySelectorAll('.hero-particles, .auth-particles');
  
  particleContainers.forEach(container => {
    createParticles(container);
  });
}

function createParticles(container) {
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    container.appendChild(particle);
  }
}

// ===== LAZY LOADING ===== //
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== UTILITY FUNCTIONS ===== //

// Debounce function
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

// Throttle function
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
  }
}

// Get random number between min and max
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Smooth scroll to element
function scrollToElement(element, offset = 80) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// ===== PERFORMANCE OPTIMIZATIONS ===== //

// Optimize scroll events
const optimizedScroll = throttle(() => {
  // Scroll-dependent operations
}, 16);

window.addEventListener('scroll', optimizedScroll);

// Optimize resize events
const optimizedResize = debounce(() => {
  // Resize-dependent operations
}, 250);

window.addEventListener('resize', optimizedResize);

// Preload critical resources
function preloadResources() {
  const criticalImages = [
    // Add paths to critical images here
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Initialize preloading
preloadResources();

// ===== ERROR HANDLING ===== //
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Could send error reports to analytics service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // Could send error reports to analytics service
});

// Export functions for use in other files
window.BandhanNova = {
  showMessage,
  hideMessage,
  scrollToElement,
  isInViewport,
  formatNumber,
  random,
  debounce,
  throttle
};
