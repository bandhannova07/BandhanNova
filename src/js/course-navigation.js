// Course Navigation and Quiz System for BandhanNova Tech Learning Hub
class CourseNavigation {
    constructor() {
        this.currentChapter = 1;
        this.totalChapters = 10;
        this.userProgress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupQuizSystem();
        this.setupProgressTracking();
        this.setupChapterNavigation();
        this.updateProgressBars();
    }

    setupQuizSystem() {
        // Add click handlers for quiz options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const question = e.target.closest('.quiz-question');
                const options = question.querySelectorAll('.quiz-option');
                
                // Remove previous selections
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Add selection to clicked option
                e.target.classList.add('selected');
                
                // Check if answer is correct
                if (e.target.dataset.answer === 'correct') {
                    setTimeout(() => {
                        e.target.style.backgroundColor = 'var(--flutter-success)';
                        this.updateProgress();
                    }, 500);
                } else {
                    setTimeout(() => {
                        e.target.style.backgroundColor = 'var(--flutter-error)';
                        // Show correct answer
                        const correctOption = question.querySelector('[data-answer="correct"]');
                        if (correctOption) {
                            correctOption.style.backgroundColor = 'var(--flutter-success)';
                        }
                    }, 500);
                }
            });
        });
    }

    setupProgressTracking() {
        // Track chapter completion
        const chapters = document.querySelectorAll('.chapter-card');
        chapters.forEach((chapter, index) => {
            const chapterNumber = index + 1;
            if (this.userProgress.completedChapters?.includes(chapterNumber)) {
                this.markChapterComplete(chapter);
            }
        });
    }

    setupChapterNavigation() {
        // Smooth scroll to chapters
        window.scrollToChapter = (chapterNumber) => {
            const chapter = document.getElementById(`chapter-${chapterNumber}`);
            if (chapter) {
                chapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
                this.currentChapter = chapterNumber;
            }
        };
    }

    updateProgress() {
        const completedQuizzes = document.querySelectorAll('.quiz-option.selected[data-answer="correct"]').length;
        const totalQuizzes = document.querySelectorAll('.quiz-option[data-answer="correct"]').length;
        const progressPercentage = Math.round((completedQuizzes / totalQuizzes) * 100);
        
        // Update progress bars
        document.querySelectorAll('.progress-fill').forEach((bar, index) => {
            const chapterProgress = Math.min(((index + 1) / this.totalChapters) * progressPercentage, (index + 1) * 10);
            bar.style.width = `${chapterProgress}%`;
        });

        // Save progress
        this.saveProgress({
            completedQuizzes,
            totalQuizzes,
            progressPercentage,
            lastUpdated: Date.now()
        });
    }

    updateProgressBars() {
        document.querySelectorAll('.progress-tracker').forEach((tracker, index) => {
            const chapterNumber = index + 1;
            const progressBar = tracker.querySelector('.progress-fill');
            const progressText = tracker.querySelector('.progress-text');
            
            if (progressBar && progressText) {
                const progress = (chapterNumber / this.totalChapters) * 100;
                progressBar.style.width = `${Math.min(progress, 100)}%`;
                progressText.textContent = `Chapter ${chapterNumber} of ${this.totalChapters} (${Math.round(progress)}%)`;
            }
        });
    }

    markChapterComplete(chapter) {
        chapter.classList.add('completed');
        const progressTracker = chapter.querySelector('.progress-tracker');
        if (progressTracker) {
            progressTracker.innerHTML += '<div class="completion-badge"><i class="fas fa-check-circle"></i> Completed!</div>';
        }
    }

    saveProgress(progress) {
        const courseId = this.getCourseId();
        const savedProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        savedProgress[courseId] = progress;
        localStorage.setItem('courseProgress', JSON.stringify(savedProgress));
    }

    loadProgress() {
        const courseId = this.getCourseId();
        const savedProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        return savedProgress[courseId] || {};
    }

    getCourseId() {
        const path = window.location.pathname;
        if (path.includes('html-css')) return 'html-css';
        if (path.includes('javascript')) return 'javascript';
        if (path.includes('python')) return 'python';
        if (path.includes('css')) return 'css';
        if (path.includes('cpp')) return 'cpp';
        if (path.includes('java')) return 'java';
        if (path.includes('sql')) return 'sql';
        return 'unknown';
    }
}

// Enhanced AI Assistant for Course Context
class CourseAIAssistant extends AIAssistant {
    constructor() {
        super();
        this.courseContext = this.detectCourseContext();
        this.enhanceForCourse();
    }

    detectCourseContext() {
        const path = window.location.pathname;
        const currentChapter = this.getCurrentChapter();
        
        return {
            language: this.getCourseLanguage(path),
            chapter: currentChapter,
            topic: this.getCurrentTopic()
        };
    }

    getCourseLanguage(path) {
        if (path.includes('html-css')) return 'HTML & CSS';
        if (path.includes('javascript')) return 'JavaScript';
        if (path.includes('python')) return 'Python';
        if (path.includes('cpp')) return 'C++';
        if (path.includes('java')) return 'Java';
        if (path.includes('sql')) return 'SQL';
        return 'Programming';
    }

    getCurrentChapter() {
        const visibleChapter = document.querySelector('.chapter-card:in-viewport');
        if (visibleChapter) {
            return visibleChapter.id.replace('chapter-', '');
        }
        return '1';
    }

    getCurrentTopic() {
        const visibleChapter = document.querySelector('.chapter-card:in-viewport');
        if (visibleChapter) {
            const title = visibleChapter.querySelector('.chapter-title');
            return title ? title.textContent.trim() : 'Introduction';
        }
        return 'Introduction';
    }

    enhanceForCourse() {
        // Override default responses with course-specific ones
        this.courseSpecificResponses = {
            'html-css': {
                'help': 'I can help you with HTML structure, CSS styling, responsive design, and web development best practices. What specific topic would you like to learn about?',
                'syntax': 'HTML uses tags like <div>, <p>, <h1> while CSS uses selectors and properties. Need help with specific syntax?',
                'example': 'Would you like to see more code examples for the current chapter? I can provide additional HTML/CSS snippets.',
            },
            'javascript': {
                'help': 'I can assist with JavaScript fundamentals, ES6+ features, DOM manipulation, and modern web development. What would you like to explore?',
                'syntax': 'JavaScript syntax includes variables (let, const), functions, objects, and arrays. Need clarification on any concept?',
                'example': 'I can show you more JavaScript examples and explain how they work step by step.',
            },
            'python': {
                'help': 'I can help with Python basics, data structures, functions, and programming logic. What Python concept interests you?',
                'syntax': 'Python uses indentation for structure and has simple, readable syntax. Need help with specific Python code?',
                'example': 'Would you like more Python code examples? I can demonstrate different programming patterns.',
            }
        };
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        const courseResponses = this.courseSpecificResponses[this.courseContext.language.toLowerCase().replace(' & ', '-')] || {};
        
        // Course-specific help
        if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
            return courseResponses.help || super.generateResponse(message);
        }
        
        // Syntax questions
        if (lowerMessage.includes('syntax') || lowerMessage.includes('how to write')) {
            return courseResponses.syntax || super.generateResponse(message);
        }
        
        // Example requests
        if (lowerMessage.includes('example') || lowerMessage.includes('show me')) {
            return courseResponses.example || super.generateResponse(message);
        }
        
        // Chapter-specific help
        if (lowerMessage.includes('chapter') || lowerMessage.includes('topic')) {
            return `You're currently on ${this.courseContext.topic} in the ${this.courseContext.language} course. This chapter covers the fundamentals you need to master. Would you like me to explain any specific concept?`;
        }
        
        // Quiz help
        if (lowerMessage.includes('quiz') || lowerMessage.includes('answer')) {
            return `Having trouble with the quiz questions? Remember to read each question carefully and think about what you learned in this chapter. The answers are all covered in the content above. Would you like me to review any specific concept?`;
        }
        
        return super.generateResponse(message);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.courseNavigation = new CourseNavigation();
    
    // Replace default AI assistant with course-enhanced version
    if (window.aiAssistant) {
        window.aiAssistant = new CourseAIAssistant();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CourseNavigation, CourseAIAssistant };
}
