// BandhanNova Navigation System

class NavigationController {
    constructor() {
        this.currentPage = window.location.pathname;
        this.history = [];
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupActiveLinks();
        this.setupBreadcrumbs();
    }

    setupMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu when clicking on nav links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        const body = document.body;

        if (navMenu && navToggle) {
            const isOpen = navMenu.classList.contains('active');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    openMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        const body = document.body;

        navMenu.classList.add('active');
        navToggle.classList.add('active');
        body.style.overflow = 'hidden';

        // Animate menu items
        const menuItems = navMenu.querySelectorAll('.nav-link');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        const body = document.body;

        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = '';

            // Reset menu item styles
            const menuItems = navMenu.querySelectorAll('.nav-link');
            menuItems.forEach(item => {
                item.style.transition = '';
                item.style.opacity = '';
                item.style.transform = '';
            });
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }

    smoothScrollTo(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = elementPosition - startPosition;
        const duration = 800;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavLink(entry.target.id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    setupBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbContainer) return;

        const pathSegments = window.location.pathname.split('/').filter(segment => segment);
        const breadcrumbs = this.generateBreadcrumbs(pathSegments);
        
        breadcrumbContainer.innerHTML = breadcrumbs;
    }

    generateBreadcrumbs(segments) {
        const breadcrumbMap = {
            '': 'Home',
            'pages': 'Pages',
            'tech-learning': 'Tech Learning',
            'entertainment': 'Entertainment',
            'dark-mind': 'Dark Mind',
            'youth-hub': 'Youth Hub',
            'dashboard': 'Dashboard',
            'python': 'Python',
            'javascript': 'JavaScript',
            'flutter': 'Flutter'
        };

        let breadcrumbs = '<a href="/" class="breadcrumb-item">Home</a>';
        let currentPath = '';

        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;
            const displayName = breadcrumbMap[segment] || this.formatSegmentName(segment);

            if (isLast) {
                breadcrumbs += ` <span class="breadcrumb-separator">/</span> <span class="breadcrumb-item active">${displayName}</span>`;
            } else {
                breadcrumbs += ` <span class="breadcrumb-separator">/</span> <a href="${currentPath}" class="breadcrumb-item">${displayName}</a>`;
            }
        });

        return breadcrumbs;
    }

    formatSegmentName(segment) {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Page navigation with animation
    navigateTo(url, useAnimation = true) {
        if (useAnimation && window.animationController) {
            window.animationController.pageTransition(() => {
                window.location.href = url;
            });
        } else {
            window.location.href = url;
        }
    }

    // Back navigation
    goBack() {
        if (this.history.length > 0) {
            const previousPage = this.history.pop();
            this.navigateTo(previousPage);
        } else {
            window.history.back();
        }
    }

    // Add to navigation history
    addToHistory(url) {
        if (this.currentPage !== url) {
            this.history.push(this.currentPage);
            this.currentPage = url;
        }
    }

    // Search functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');

        if (!searchInput) return;

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length < 2) {
                this.hideSearchResults();
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
                this.hideSearchResults();
            }
        });
    }

    performSearch(query) {
        // Mock search data - in real implementation, this would be an API call
        const searchData = [
            { title: 'Python Basics', url: '/pages/tech-learning/python/basics', type: 'course' },
            { title: 'JavaScript Functions', url: '/pages/tech-learning/javascript/functions', type: 'lesson' },
            { title: 'Snake Game', url: '/pages/entertainment/snake-game', type: 'game' },
            { title: 'Dark Psychology Techniques', url: '/pages/dark-mind/psychology', type: 'article' }
        ];

        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result">No results found</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result" onclick="navigationController.navigateTo('${result.url}')">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-description">${result.type}</div>
                </div>
            `).join('');
        }

        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    // Keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + H for home
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.navigateTo('/');
            }
            
            // Alt + T for tech learning
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                this.navigateTo('/pages/tech-learning.html');
            }
            
            // Alt + E for entertainment
            if (e.altKey && e.key === 'e') {
                e.preventDefault();
                this.navigateTo('/pages/entertainment.html');
            }
            
            // Alt + D for dashboard
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                this.navigateTo('/pages/dashboard.html');
            }
            
            // Escape to close mobile menu
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                this.hideSearchResults();
            }
        });
    }
}

// Initialize navigation controller
const navigationController = new NavigationController();

// Setup keyboard navigation and search
document.addEventListener('DOMContentLoaded', () => {
    navigationController.setupKeyboardNavigation();
    navigationController.setupSearch();
});

// Export for global access
window.NavigationController = NavigationController;
window.navigationController = navigationController;
