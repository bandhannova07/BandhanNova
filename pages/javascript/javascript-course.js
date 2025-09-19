// JavaScript Course Interactive Features

class JavaScriptCourse {
    constructor() {
        this.currentChapter = 1;
        this.totalChapters = 14;
        this.currentQuestion = 1;
        this.totalQuestions = 4;
        this.quizAnswers = {};
        this.correctAnswers = {
            q1: 'b', // let myVariable = 5;
            q2: 'b', // Prints output to the browser console
            q3: 'a', // //
            q4: 'b'  // In external .js files
        };
        this.userProgress = this.loadProgress();
        this.consoleOutput = [];
        this.init();
    }

    init() {
        this.setupCodePlayground();
        this.setupQuiz();
        this.setupChapterNavigation();
        this.updateProgress();
        this.setupAnimations();
        this.loadUserData();
        this.setupConsole();
    }

    setupCodePlayground() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const jsCode = document.getElementById('jsCode');
        const htmlCode = document.getElementById('htmlCode');

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                document.querySelectorAll('.code-editor, .code-result, .console-output').forEach(el => {
                    el.classList.remove('active');
                });

                const targetElement = document.getElementById(`${tab}-editor`) || 
                                    document.getElementById(`${tab}-frame`) || 
                                    document.getElementById(`${tab}-output`);
                
                if (targetElement) {
                    targetElement.classList.add('active');
                }

                if (tab === 'result') {
                    this.runJavaScript();
                }
            });
        });

        // Auto-run on code change
        jsCode.addEventListener('input', () => {
            clearTimeout(this.codeTimeout);
            this.codeTimeout = setTimeout(() => {
                if (document.querySelector('[data-tab="result"]').classList.contains('active')) {
                    this.runJavaScript();
                }
            }, 1500);
        });

        htmlCode.addEventListener('input', () => {
            clearTimeout(this.htmlTimeout);
            this.htmlTimeout = setTimeout(() => {
                if (document.querySelector('[data-tab="result"]').classList.contains('active')) {
                    this.runJavaScript();
                }
            }, 1500);
        });
    }

    setupConsole() {
        // Override console.log for our playground
        this.originalConsoleLog = console.log;
        this.playgroundConsole = {
            log: (...args) => {
                const message = args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                
                this.addConsoleOutput(message, 'log');
                this.originalConsoleLog(...args);
            },
            error: (message) => {
                this.addConsoleOutput(message, 'error');
                console.error(message);
            },
            warn: (message) => {
                this.addConsoleOutput(message, 'warn');
                console.warn(message);
            }
        };
    }

    addConsoleOutput(message, type = 'log') {
        const consoleContent = document.getElementById('consoleContent');
        const timestamp = new Date().toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = `console-line console-${type}`;
        logEntry.innerHTML = `
            <span class="console-time">${timestamp}</span>
            <span class="console-message">${message}</span>
        `;
        
        consoleContent.appendChild(logEntry);
        consoleContent.scrollTop = consoleContent.scrollHeight;
        
        this.consoleOutput.push({ message, type, timestamp });
    }

    clearConsole() {
        const consoleContent = document.getElementById('consoleContent');
        consoleContent.innerHTML = '<div class="console-line">Console cleared...</div>';
        this.consoleOutput = [];
    }

    runJavaScript() {
        const jsCode = document.getElementById('jsCode').value;
        const htmlCode = document.getElementById('htmlCode').value;
        const output = document.getElementById('jsOutput');
        
        // Clear previous console output
        this.clearConsole();
        
        // Create the full HTML with JavaScript
        const fullHTML = `
            ${htmlCode}
            <script>
                // Override console for iframe
                window.console = {
                    log: function(...args) {
                        const message = args.map(arg => 
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                        ).join(' ');
                        parent.postMessage({type: 'console', level: 'log', message: message}, '*');
                    },
                    error: function(message) {
                        parent.postMessage({type: 'console', level: 'error', message: String(message)}, '*');
                    },
                    warn: function(message) {
                        parent.postMessage({type: 'console', level: 'warn', message: String(message)}, '*');
                    }
                };
                
                try {
                    ${jsCode}
                } catch (error) {
                    console.error('JavaScript Error: ' + error.message);
                }
            </script>
        `;
        
        output.srcdoc = fullHTML;
        
        // Listen for console messages from iframe
        window.addEventListener('message', (event) => {
            if (event.data.type === 'console') {
                this.addConsoleOutput(event.data.message, event.data.level);
            }
        });
        
        // Track code execution
        this.trackActivity('code_execution', {
            chapter: this.currentChapter,
            jsCodeLength: jsCode.length,
            htmlCodeLength: htmlCode.length
        });
    }

    setupQuiz() {
        const options = document.querySelectorAll('.quiz-option input');

        options.forEach(option => {
            option.addEventListener('change', (e) => {
                const questionName = e.target.name;
                this.quizAnswers[questionName] = e.target.value;
                
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
            this.awardPoints(75);
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
            feedback = 'Excellent! You have a solid understanding of JavaScript fundamentals. Ready for more advanced concepts!';
        } else if (percentage >= 75) {
            feedback = 'Great work! You understand the core concepts. Keep practicing to master JavaScript!';
        } else if (percentage >= 50) {
            feedback = 'Good start! Review the lesson content and try the code examples to improve your understanding.';
        } else {
            feedback = 'Keep learning! JavaScript takes practice. Review the fundamentals and try again.';
        }
        
        feedbackElement.textContent = feedback;
        this.animateScore(percentage);
    }

    animateScore(targetPercentage) {
        const scoreElement = document.getElementById('scorePercentage');
        let currentPercentage = 0;
        const increment = targetPercentage / 40;

        const animation = setInterval(() => {
            currentPercentage += increment;
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
                clearInterval(animation);
            }
            scoreElement.textContent = `${Math.round(currentPercentage)}%`;
        }, 40);
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
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-chapter="${chapterNum}"]`).classList.add('active');

        this.currentChapter = chapterNum;
        this.loadChapterContent(chapterNum);
        
        this.trackActivity('chapter_opened', {
            chapter: chapterNum
        });
    }

    loadChapterContent(chapterNum) {
        const chapterData = this.getChapterData(chapterNum);
        
        document.querySelector('.lesson-title').textContent = chapterData.title;
        document.querySelector('.lesson-duration').innerHTML = `<i class="fas fa-clock"></i> ${chapterData.duration}`;
        
        // In a real implementation, you would load the full chapter content dynamically
        // For now, we'll just update the title and duration
    }

    getChapterData(chapterNum) {
        const chapters = {
            1: { title: 'Chapter 1: JavaScript Fundamentals', duration: '60 minutes' },
            2: { title: 'Chapter 2: Variables & Data Types', duration: '45 minutes' },
            3: { title: 'Chapter 3: Functions & Scope', duration: '70 minutes' },
            4: { title: 'Chapter 4: Objects & Arrays', duration: '80 minutes' },
            5: { title: 'Chapter 5: DOM Manipulation', duration: '90 minutes' },
            6: { title: 'Chapter 6: Events & Event Handling', duration: '75 minutes' },
            7: { title: 'Chapter 7: ES6+ Features', duration: '85 minutes' },
            8: { title: 'Chapter 8: Promises & Async/Await', duration: '95 minutes' },
            9: { title: 'Chapter 9: Fetch API & AJAX', duration: '70 minutes' },
            10: { title: 'Chapter 10: Error Handling', duration: '55 minutes' },
            11: { title: 'Chapter 11: Modules & Import/Export', duration: '65 minutes' },
            12: { title: 'Chapter 12: Local Storage & APIs', duration: '80 minutes' },
            13: { title: 'Chapter 13: Testing & Debugging', duration: '75 minutes' },
            14: { title: 'Chapter 14: Final Project: Todo App', duration: '150 minutes' }
        };
        
        return chapters[chapterNum] || chapters[1];
    }

    completeChapter(chapterNum) {
        const chapterItem = document.querySelector(`[data-chapter="${chapterNum}"]`);
        chapterItem.classList.add('completed');
        chapterItem.classList.remove('active');
        chapterItem.querySelector('.chapter-status i').className = 'fas fa-check';

        this.unlockNextChapter();
        this.awardPoints(125);
        
        this.userProgress.completedChapters.push(chapterNum);
        this.saveProgress();
        this.updateProgress();

        this.showNotification('Chapter completed! +125 points earned', 'success');

        this.trackActivity('chapter_completed', {
            chapter: chapterNum
        });

        if (chapterNum < this.totalChapters) {
            setTimeout(() => {
                this.loadChapter(chapterNum + 1);
            }, 2000);
        } else {
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
        const certificateGenerator = new CertificateGenerator();
        certificateGenerator.generateCertificate({
            courseName: 'Modern JavaScript Mastery',
            studentName: this.getUserName(),
            completionDate: new Date().toLocaleDateString(),
            courseHours: '25 Hours',
            grade: 'A+',
            skills: ['ES6+ JavaScript', 'DOM Manipulation', 'Async Programming', 'Modern Web Development']
        });

        this.awardPoints(750);
        this.awardBadge('JavaScript Master');
        this.awardBadge('Modern Web Developer');

        this.showNotification('🎉 Congratulations! JavaScript course completed. Certificate generated!', 'success');
        
        this.trackActivity('course_completed', {
            course: 'javascript',
            totalTime: this.calculateTotalTime()
        });
    }

    awardPoints(points) {
        this.userProgress.points += points;
        this.saveProgress();
        
        const pointsElement = document.getElementById('pointsEarned');
        if (pointsElement) {
            pointsElement.textContent = this.userProgress.points;
        }

        this.animatePointsIncrease(points);
    }

    awardBadge(badgeName) {
        if (!this.userProgress.badges.includes(badgeName)) {
            this.userProgress.badges.push(badgeName);
            this.saveProgress();
            
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
        const duration = 1200;
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
        
        const progressFill = document.getElementById('courseProgress');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
            progressFill.dataset.progress = progressPercentage;
        }
        
        if (progressText) {
            progressText.textContent = `${progressPercentage}% Complete (${completedCount}/${this.totalChapters} chapters)`;
        }

        const completedElement = document.getElementById('completedChapters');
        if (completedElement) {
            completedElement.textContent = completedCount;
        }
    }

    setupAnimations() {
        const typingElements = document.querySelectorAll('.typing-text');
        typingElements.forEach(element => {
            this.typeText(element);
        });

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
        }, 60);
    }

    loadProgress() {
        const saved = localStorage.getItem('bandhannova_javascript_progress');
        return saved ? JSON.parse(saved) : {
            completedChapters: [],
            points: 0,
            badges: [],
            startDate: new Date().toISOString()
        };
    }

    saveProgress() {
        localStorage.setItem('bandhannova_javascript_progress', JSON.stringify(this.userProgress));
    }

    loadUserData() {
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
            course: 'javascript'
        };
        
        const activities = JSON.parse(localStorage.getItem('bandhannova_activities') || '[]');
        activities.push(activity);
        localStorage.setItem('bandhannova_activities', JSON.stringify(activities));
    }

    calculateTotalTime() {
        const startDate = new Date(this.userProgress.startDate);
        const endDate = new Date();
        return Math.round((endDate - startDate) / (1000 * 60 * 60));
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
        }, 6000);
    }
}

// Global functions for HTML onclick handlers
function runJavaScript() {
    window.javaScriptCourse.runJavaScript();
}

function nextQuestion() {
    window.javaScriptCourse.nextQuestion();
}

function previousQuestion() {
    window.javaScriptCourse.previousQuestion();
}

function submitQuiz() {
    window.javaScriptCourse.submitQuiz();
}

function completeChapter(chapterNum) {
    window.javaScriptCourse.completeChapter(chapterNum);
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
    window.javaScriptCourse = new JavaScriptCourse();
});

// Copy protection
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
    }
});
