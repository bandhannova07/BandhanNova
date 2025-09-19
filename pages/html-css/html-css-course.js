// HTML & CSS Course Interactive Features

class HTMLCSSCourse {
    constructor() {
        this.currentChapter = 1;
        this.totalChapters = 10;
        this.currentQuestion = 1;
        this.totalQuestions = 3;
        this.quizAnswers = {};
        this.correctAnswers = {
            q1: 'b', // HyperText Markup Language
            q2: 'b', // <h1>
            q3: 'c'  // <br>
        };
        this.userProgress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupCodePlayground();
        this.setupQuiz();
        this.setupChapterNavigation();
        this.updateProgress();
        this.setupAnimations();
        this.loadUserData();
    }

    setupCodePlayground() {
        const runBtn = document.querySelector('.run-btn');
        const htmlCode = document.getElementById('htmlCode');
        const output = document.getElementById('output');
        const tabBtns = document.querySelectorAll('.tab-btn');

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                document.querySelectorAll('.code-editor, .code-result').forEach(el => {
                    el.classList.remove('active');
                });

                if (tab === 'html') {
                    document.getElementById('html-editor').classList.add('active');
                } else {
                    document.getElementById('result-frame').classList.add('active');
                    this.runCode();
                }
            });
        });

        // Auto-run on code change
        htmlCode.addEventListener('input', () => {
            clearTimeout(this.codeTimeout);
            this.codeTimeout = setTimeout(() => {
                if (document.querySelector('[data-tab="result"]').classList.contains('active')) {
                    this.runCode();
                }
            }, 1000);
        });

        // Initial code run
        this.runCode();
    }

    runCode() {
        const htmlCode = document.getElementById('htmlCode').value;
        const output = document.getElementById('output');
        
        const fullHTML = htmlCode;
        
        output.srcdoc = fullHTML;
        
        // Track code execution
        this.trackActivity('code_execution', {
            chapter: this.currentChapter,
            codeLength: htmlCode.length
        });
    }

    setupQuiz() {
        const questions = document.querySelectorAll('.quiz-question');
        const options = document.querySelectorAll('.quiz-option input');

        options.forEach(option => {
            option.addEventListener('change', (e) => {
                const questionName = e.target.name;
                this.quizAnswers[questionName] = e.target.value;
                
                // Enable next button if answer selected
                const nextBtn = document.getElementById('nextBtn');
                const submitBtn = document.getElementById('submitBtn');
                
                if (this.currentQuestion < this.totalQuestions) {
                    nextBtn.disabled = false;
                } else {
                    submitBtn.style.display = 'inline-block';
                    nextBtn.style.display = 'none';
                }
            });
        });
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            document.querySelector(`[data-question="${this.currentQuestion}"]`).classList.remove('active');
            this.currentQuestion++;
            document.querySelector(`[data-question="${this.currentQuestion}"]`).classList.add('active');
            
            this.updateQuizNavigation();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 1) {
            document.querySelector(`[data-question="${this.currentQuestion}"]`).classList.remove('active');
            this.currentQuestion--;
            document.querySelector(`[data-question="${this.currentQuestion}"]`).classList.add('active');
            
            this.updateQuizNavigation();
        }
    }

    updateQuizNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        prevBtn.disabled = this.currentQuestion === 1;
        
        if (this.currentQuestion === this.totalQuestions) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
            nextBtn.disabled = !this.quizAnswers[`q${this.currentQuestion}`];
        }
    }

    submitQuiz() {
        let correctCount = 0;
        
        Object.keys(this.correctAnswers).forEach(question => {
            if (this.quizAnswers[question] === this.correctAnswers[question]) {
                correctCount++;
            }
        });

        const percentage = Math.round((correctCount / this.totalQuestions) * 100);
        const passed = percentage >= 70;

        this.showQuizResults(percentage, correctCount, passed);
        
        if (passed) {
            this.awardPoints(50);
            this.unlockNextChapter();
        }

        this.trackActivity('quiz_completed', {
            chapter: this.currentChapter,
            score: percentage,
            passed: passed
        });
    }

    showQuizResults(percentage, correctCount, passed) {
        const quizContainer = document.querySelector('.quiz-container');
        const resultsDiv = document.getElementById('quizResults');
        const scoreElement = document.getElementById('scorePercentage');
        const feedbackElement = document.getElementById('feedbackText');

        quizContainer.style.display = 'none';
        resultsDiv.style.display = 'block';

        scoreElement.textContent = `${percentage}%`;
        
        let feedback = '';
        if (percentage === 100) {
            feedback = 'Perfect! You have mastered the basics of HTML. Ready for the next chapter!';
        } else if (percentage >= 70) {
            feedback = 'Great job! You understand the fundamentals. Keep up the good work!';
        } else {
            feedback = 'Good effort! Review the lesson content and try again to unlock the next chapter.';
        }
        
        feedbackElement.textContent = feedback;

        // Animate score circle
        this.animateScore(percentage);
    }

    animateScore(targetPercentage) {
        const scoreElement = document.getElementById('scorePercentage');
        let currentPercentage = 0;
        const increment = targetPercentage / 30;

        const animation = setInterval(() => {
            currentPercentage += increment;
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
                clearInterval(animation);
            }
            scoreElement.textContent = `${Math.round(currentPercentage)}%`;
        }, 50);
    }

    setupChapterNavigation() {
        const chapterItems = document.querySelectorAll('.chapter-item');
        
        chapterItems.forEach(item => {
            item.addEventListener('click', () => {
                const chapterNum = parseInt(item.dataset.chapter);
                if (!item.classList.contains('locked')) {
                    this.loadChapter(chapterNum);
                }
            });
        });
    }

    loadChapter(chapterNum) {
        // Update active chapter in sidebar
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-chapter="${chapterNum}"]`).classList.add('active');

        this.currentChapter = chapterNum;
        
        // Load chapter content (would be dynamic in real implementation)
        this.loadChapterContent(chapterNum);
        
        this.trackActivity('chapter_opened', {
            chapter: chapterNum
        });
    }

    loadChapterContent(chapterNum) {
        const chapterData = this.getChapterData(chapterNum);
        
        // Update lesson title
        document.querySelector('.lesson-title').textContent = chapterData.title;
        
        // Update lesson meta
        document.querySelector('.lesson-duration').innerHTML = `<i class="fas fa-clock"></i> ${chapterData.duration}`;
        
        // In a real implementation, you would load the full chapter content here
        // For now, we'll just update the title and duration
    }

    getChapterData(chapterNum) {
        const chapters = {
            1: { title: 'Chapter 1: Introduction to HTML', duration: '45 minutes' },
            2: { title: 'Chapter 2: HTML Structure & Elements', duration: '60 minutes' },
            3: { title: 'Chapter 3: Forms & Input Elements', duration: '50 minutes' },
            4: { title: 'Chapter 4: Introduction to CSS', duration: '55 minutes' },
            5: { title: 'Chapter 5: CSS Selectors & Properties', duration: '70 minutes' },
            6: { title: 'Chapter 6: Layout with Flexbox', duration: '80 minutes' },
            7: { title: 'Chapter 7: CSS Grid Layout', duration: '75 minutes' },
            8: { title: 'Chapter 8: Responsive Design', duration: '90 minutes' },
            9: { title: 'Chapter 9: CSS Animations', duration: '65 minutes' },
            10: { title: 'Chapter 10: Final Project', duration: '120 minutes' }
        };
        
        return chapters[chapterNum] || chapters[1];
    }

    completeChapter(chapterNum) {
        // Mark chapter as completed
        const chapterItem = document.querySelector(`[data-chapter="${chapterNum}"]`);
        chapterItem.classList.add('completed');
        chapterItem.classList.remove('active');
        chapterItem.querySelector('.chapter-status i').className = 'fas fa-check';

        // Unlock next chapter
        this.unlockNextChapter();
        
        // Award points
        this.awardPoints(100);
        
        // Update progress
        this.userProgress.completedChapters.push(chapterNum);
        this.saveProgress();
        this.updateProgress();

        // Show completion notification
        this.showNotification('Chapter completed! +100 points earned', 'success');

        this.trackActivity('chapter_completed', {
            chapter: chapterNum
        });

        // Auto-advance to next chapter if available
        if (chapterNum < this.totalChapters) {
            setTimeout(() => {
                this.loadChapter(chapterNum + 1);
            }, 2000);
        } else {
            // Course completed
            this.completeCourse();
        }
    }

    unlockNextChapter() {
        const nextChapterNum = this.currentChapter + 1;
        if (nextChapterNum <= this.totalChapters) {
            const nextChapter = document.querySelector(`[data-chapter="${nextChapterNum}"]`);
            if (nextChapter) {
                nextChapter.classList.remove('locked');
                nextChapter.querySelector('.chapter-status i').className = 'fas fa-play';
            }
        }
    }

    completeCourse() {
        // Generate certificate
        const certificateGenerator = new CertificateGenerator();
        certificateGenerator.generateCertificate({
            courseName: 'HTML & CSS Mastery',
            studentName: this.getUserName(),
            completionDate: new Date().toLocaleDateString(),
            courseHours: '15 Hours',
            grade: 'A+'
        });

        // Award final points and badge
        this.awardPoints(500);
        this.awardBadge('HTML & CSS Master');

        this.showNotification('🎉 Congratulations! Course completed. Certificate generated!', 'success');
        
        this.trackActivity('course_completed', {
            course: 'html-css',
            totalTime: this.calculateTotalTime()
        });
    }

    awardPoints(points) {
        this.userProgress.points += points;
        this.saveProgress();
        
        // Update points display
        const pointsElement = document.getElementById('pointsEarned');
        if (pointsElement) {
            pointsElement.textContent = this.userProgress.points;
        }

        // Animate points
        this.animatePointsIncrease(points);
    }

    awardBadge(badgeName) {
        if (!this.userProgress.badges.includes(badgeName)) {
            this.userProgress.badges.push(badgeName);
            this.saveProgress();
            
            // Update badges display
            const badgesElement = document.getElementById('badgesEarned');
            if (badgesElement) {
                badgesElement.textContent = this.userProgress.badges.length;
            }
        }
    }

    animatePointsIncrease(points) {
        const pointsElement = document.getElementById('pointsEarned');
        if (!pointsElement) return;

        const startPoints = this.userProgress.points - points;
        const endPoints = this.userProgress.points;
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentPoints = Math.round(startPoints + (endPoints - startPoints) * progress);
            
            pointsElement.textContent = currentPoints;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    updateProgress() {
        const completedCount = this.userProgress.completedChapters.length;
        const progressPercentage = Math.round((completedCount / this.totalChapters) * 100);
        
        // Update progress bar
        const progressFill = document.getElementById('courseProgress');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
            progressFill.dataset.progress = progressPercentage;
        }
        
        if (progressText) {
            progressText.textContent = `${progressPercentage}% Complete (${completedCount}/${this.totalChapters} chapters)`;
        }

        // Update completed chapters count
        const completedElement = document.getElementById('completedChapters');
        if (completedElement) {
            completedElement.textContent = completedCount;
        }
    }

    setupAnimations() {
        // Typing text animation
        const typingElements = document.querySelectorAll('.typing-text');
        typingElements.forEach(element => {
            this.typeText(element);
        });

        // Fade in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    typeText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #02569B';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text[i];
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        }, 50);
    }

    loadProgress() {
        const saved = localStorage.getItem('bandhannova_htmlcss_progress');
        return saved ? JSON.parse(saved) : {
            completedChapters: [],
            points: 0,
            badges: [],
            startDate: new Date().toISOString()
        };
    }

    saveProgress() {
        localStorage.setItem('bandhannova_htmlcss_progress', JSON.stringify(this.userProgress));
    }

    loadUserData() {
        // Load user data from global storage
        const userData = JSON.parse(localStorage.getItem('bandhannova_user_data') || '{}');
        this.userName = userData.name || 'Student';
    }

    getUserName() {
        return this.userName || 'Student';
    }

    trackActivity(action, data) {
        const activity = {
            action,
            data,
            timestamp: new Date().toISOString(),
            course: 'html-css'
        };
        
        const activities = JSON.parse(localStorage.getItem('bandhannova_activities') || '[]');
        activities.push(activity);
        localStorage.setItem('bandhannova_activities', JSON.stringify(activities));
    }

    calculateTotalTime() {
        const startDate = new Date(this.userProgress.startDate);
        const endDate = new Date();
        return Math.round((endDate - startDate) / (1000 * 60 * 60)); // hours
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Global functions for HTML onclick handlers
function runCode() {
    window.htmlCSSCourse.runCode();
}

function nextQuestion() {
    window.htmlCSSCourse.nextQuestion();
}

function previousQuestion() {
    window.htmlCSSCourse.previousQuestion();
}

function submitQuiz() {
    window.htmlCSSCourse.submitQuiz();
}

function completeChapter(chapterNum) {
    window.htmlCSSCourse.completeChapter(chapterNum);
}

function startCourse() {
    document.getElementById('course-content').scrollIntoView({ behavior: 'smooth' });
}

function togglePreview() {
    const preview = document.querySelector('.course-visual');
    preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
}

function copyCode(button) {
    const codeBlock = button.closest('.code-example').querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    });
}

// Initialize course when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.htmlCSSCourse = new HTMLCSSCourse();
});

// Copy protection
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
    }
});
