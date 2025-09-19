// BandhanNova Animation Controller

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupTypingAnimations();
        this.setupParticleSystem();
        this.setupCodeAnimations();
    }

    // Intersection Observer for scroll animations
    setupIntersectionObservers() {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerFadeIn(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const slideInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSlideIn(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -30px 0px'
        });

        // Observe elements
        document.querySelectorAll('.fade-in-up, .scroll-reveal').forEach(el => {
            fadeInObserver.observe(el);
        });

        document.querySelectorAll('.slide-in-down').forEach(el => {
            slideInObserver.observe(el);
        });

        this.observers.set('fadeIn', fadeInObserver);
        this.observers.set('slideIn', slideInObserver);
    }

    // Typing animation system
    setupTypingAnimations() {
        const typingElements = document.querySelectorAll('.typing-text, .code-typing');
        
        typingElements.forEach((element, index) => {
            const text = element.textContent;
            const speed = element.dataset.speed || 50;
            const delay = element.dataset.delay || index * 500;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-blue)';
            
            setTimeout(() => {
                this.typeText(element, text, speed);
            }, delay);
        });
    }

    typeText(element, text, speed) {
        if (this.isReducedMotion) {
            element.textContent = text;
            return;
        }

        let i = 0;
        const timer = setInterval(() => {
            element.textContent = text.slice(0, i + 1);
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }

    // Particle system for background effects
    setupParticleSystem() {
        const particleContainers = document.querySelectorAll('.floating-orbs, .particles');
        
        particleContainers.forEach(container => {
            this.createParticles(container);
        });
    }

    createParticles(container) {
        if (this.isReducedMotion) return;

        const particleCount = container.dataset.particles || 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and animation
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            
            container.appendChild(particle);
        }
    }

    // Code block animations
    setupCodeAnimations() {
        const codeBlocks = document.querySelectorAll('.code-highlight, pre code');
        
        codeBlocks.forEach(block => {
            this.setupCodeHighlight(block);
        });
    }

    setupCodeHighlight(block) {
        if (this.isReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCodeHighlight(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(block);
    }

    animateCodeHighlight(block) {
        const lines = block.textContent.split('\n');
        block.innerHTML = '';
        
        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.textContent = line;
            lineElement.style.opacity = '0';
            lineElement.style.transform = 'translateX(-20px)';
            lineElement.style.transition = 'all 0.3s ease';
            
            block.appendChild(lineElement);
            
            setTimeout(() => {
                lineElement.style.opacity = '1';
                lineElement.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    // Animation triggers
    triggerFadeIn(element) {
        if (this.isReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        element.classList.add('revealed');
    }

    triggerSlideIn(element) {
        if (this.isReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        element.style.animation = 'slideInDown 0.6s ease-out forwards';
    }

    // Progress bar animation
    animateProgressBar(progressBar, targetWidth, duration = 2000) {
        if (this.isReducedMotion) {
            progressBar.style.width = targetWidth;
            return;
        }

        progressBar.style.width = '0%';
        progressBar.style.transition = `width ${duration}ms ease-out`;
        
        setTimeout(() => {
            progressBar.style.width = targetWidth;
        }, 100);
    }

    // Counter animation
    animateCounter(element, target, duration = 2000) {
        if (this.isReducedMotion) {
            element.textContent = target;
            return;
        }

        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Achievement animation
    showAchievement(title, description, icon = 'fas fa-trophy') {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-notification';
        achievement.innerHTML = `
            <div class="achievement-icon">
                <i class="${icon}"></i>
            </div>
            <div class="achievement-content">
                <h4>${title}</h4>
                <p>${description}</p>
            </div>
        `;
        
        achievement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue));
            color: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.5s ease;
        `;
        
        document.body.appendChild(achievement);
        
        // Animate in
        setTimeout(() => {
            achievement.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out
        setTimeout(() => {
            achievement.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(achievement);
            }, 500);
        }, 4000);
    }

    // Loading animation
    showLoadingAnimation(container, type = 'dots') {
        const loader = document.createElement('div');
        loader.className = `loading-${type}`;
        
        if (type === 'dots') {
            loader.innerHTML = '<span></span><span></span><span></span>';
        } else if (type === 'spinner') {
            loader.innerHTML = '<div class="spinner"></div>';
        }
        
        container.appendChild(loader);
        return loader;
    }

    hideLoadingAnimation(loader) {
        if (loader && loader.parentElement) {
            loader.parentElement.removeChild(loader);
        }
    }

    // Stagger animation for lists
    staggerAnimation(elements, delay = 100) {
        if (this.isReducedMotion) return;

        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }

    // Hover effects
    addHoverEffect(element, effect = 'lift') {
        if (this.isReducedMotion) return;

        const effects = {
            lift: () => {
                element.style.transform = 'translateY(-8px)';
                element.style.boxShadow = 'var(--shadow-xl)';
            },
            scale: () => {
                element.style.transform = 'scale(1.05)';
            },
            rotate: () => {
                element.style.transform = 'rotate(2deg) scale(1.02)';
            },
            glow: () => {
                element.style.boxShadow = '0 0 20px rgba(66, 165, 245, 0.4)';
            }
        };

        element.addEventListener('mouseenter', () => {
            if (effects[effect]) effects[effect]();
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.boxShadow = '';
        });
    }

    // Page transition animation
    pageTransition(callback) {
        if (this.isReducedMotion) {
            callback();
            return;
        }

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary-blue);
            z-index: 9999;
            transform: translateX(-100%);
            transition: transform 0.5s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.transform = 'translateX(0)';
        }, 50);
        
        setTimeout(() => {
            callback();
            overlay.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }, 500);
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.animations.clear();
        this.observers.clear();
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Export for global access
window.AnimationController = AnimationController;
window.animationController = animationController;
