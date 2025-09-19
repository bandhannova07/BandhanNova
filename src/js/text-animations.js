// Text Animation System for BandhanNova
class TextAnimations {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.initializeAnimations();
        this.addReadingProgressBar();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, this.observerOptions);
    }

    initializeAnimations() {
        // Add animation classes to elements
        this.addAnimationClasses();
        
        // Start observing elements
        this.observeElements();
        
        // Add typing effect to hero titles
        this.addTypingEffect();
        
        // Add fade-in animations to cards
        this.addFadeInAnimations();
        
        // Add slide animations to sections
        this.addSlideAnimations();
    }

    addAnimationClasses() {
        // Add CSS classes for animations
        const style = document.createElement('style');
        style.textContent = `
            .animate-fade-in {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .animate-slide-left {
                opacity: 0;
                transform: translateX(-50px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-slide-left.visible {
                opacity: 1;
                transform: translateX(0);
            }
            
            .animate-slide-right {
                opacity: 0;
                transform: translateX(50px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-slide-right.visible {
                opacity: 1;
                transform: translateX(0);
            }
            
            .animate-scale {
                opacity: 0;
                transform: scale(0.8);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-scale.visible {
                opacity: 1;
                transform: scale(1);
            }
            
            .animate-bounce-in {
                opacity: 0;
                transform: scale(0.3);
                transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .animate-bounce-in.visible {
                opacity: 1;
                transform: scale(1);
            }
            
            .typing-text {
                border-right: 2px solid var(--primary-blue);
                animation: blink 1s infinite;
            }
            
            @keyframes blink {
                0%, 50% { border-color: var(--primary-blue); }
                51%, 100% { border-color: transparent; }
            }
            
            .reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, var(--primary-blue), var(--accent-blue));
                z-index: 1000;
                transition: width 0.1s ease;
            }
            
            .animate-counter {
                font-variant-numeric: tabular-nums;
            }
            
            .highlight-text {
                background: linear-gradient(120deg, transparent 0%, transparent 50%, var(--light-blue) 50%);
                background-size: 220% 100%;
                transition: background-position 0.8s ease;
            }
            
            .highlight-text.visible {
                background-position: 100% 0;
            }
            
            .stagger-animation {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease;
            }
            
            .stagger-animation.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    observeElements() {
        // Observe headings
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading, index) => {
            heading.classList.add('animate-fade-in');
            this.observer.observe(heading);
        });

        // Observe paragraphs
        document.querySelectorAll('p').forEach((p, index) => {
            if (index % 2 === 0) {
                p.classList.add('animate-slide-left');
            } else {
                p.classList.add('animate-slide-right');
            }
            this.observer.observe(p);
        });

        // Observe cards and sections
        document.querySelectorAll('.card, .section, .hub-card, .course-card').forEach((element, index) => {
            element.classList.add('animate-scale');
            this.observer.observe(element);
        });

        // Observe buttons
        document.querySelectorAll('.btn, .cta-button').forEach((button, index) => {
            button.classList.add('animate-bounce-in');
            this.observer.observe(button);
        });

        // Observe code blocks
        document.querySelectorAll('pre, code').forEach((code, index) => {
            code.classList.add('animate-fade-in');
            this.observer.observe(code);
        });
    }

    triggerAnimation(element) {
        // Add staggered delay for multiple elements
        const delay = Array.from(element.parentNode.children).indexOf(element) * 100;
        
        setTimeout(() => {
            element.classList.add('visible');
        }, delay);

        // Unobserve after animation
        this.observer.unobserve(element);
    }

    addTypingEffect() {
        const heroTitles = document.querySelectorAll('.hero h1, .hero-title, .main-title');
        
        heroTitles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            title.classList.add('typing-text');
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        title.classList.remove('typing-text');
                    }, 2000);
                }
            };
            
            // Start typing after a short delay
            setTimeout(typeWriter, 500);
        });
    }

    addFadeInAnimations() {
        // Add fade-in animations to specific elements
        const fadeElements = document.querySelectorAll('.feature-card, .testimonial, .stat-card');
        
        fadeElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
            element.classList.add('animate-fade-in');
            this.observer.observe(element);
        });
    }

    addSlideAnimations() {
        // Add slide animations to alternating sections
        const sections = document.querySelectorAll('section, .content-section');
        
        sections.forEach((section, index) => {
            if (index % 2 === 0) {
                section.classList.add('animate-slide-left');
            } else {
                section.classList.add('animate-slide-right');
            }
            this.observer.observe(section);
        });
    }

    addReadingProgressBar() {
        // Create reading progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Counter animation for statistics
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // Highlight text animation
    highlightText(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('highlight-text');
            this.observer.observe(element);
        });
    }

    // Stagger animation for lists
    staggerList(listSelector, itemSelector) {
        const lists = document.querySelectorAll(listSelector);
        
        lists.forEach(list => {
            const items = list.querySelectorAll(itemSelector);
            items.forEach((item, index) => {
                item.classList.add('stagger-animation');
                item.style.transitionDelay = `${index * 0.1}s`;
                this.observer.observe(item);
            });
        });
    }

    // Parallax effect for background elements
    addParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Text reveal animation
    revealText(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = text.split('').map(char => 
                `<span style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">${char}</span>`
            ).join('');
            
            this.observer.observe(element);
            
            element.addEventListener('animationstart', () => {
                const chars = element.querySelectorAll('span');
                chars.forEach((char, index) => {
                    setTimeout(() => {
                        char.style.opacity = '1';
                        char.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            });
        });
    }

    // Initialize specific animations for different page types
    initPageSpecificAnimations() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('index.html') || currentPage === '/') {
            this.addTypingEffect();
            this.highlightText('.highlight');
        }
        
        if (currentPage.includes('course') || currentPage.includes('learning')) {
            this.staggerList('.chapter-list', '.chapter-item');
            this.revealText('.course-description');
        }
        
        if (currentPage.includes('dashboard')) {
            // Animate statistics counters
            document.querySelectorAll('.stat-number').forEach(stat => {
                const target = parseInt(stat.textContent);
                this.animateCounter(stat, target);
            });
        }
    }
}

// Initialize text animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.textAnimations = new TextAnimations();
    
    // Initialize page-specific animations after a short delay
    setTimeout(() => {
        window.textAnimations.initPageSpecificAnimations();
    }, 500);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextAnimations;
}
