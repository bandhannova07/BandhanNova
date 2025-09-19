// Flutter Course Interactive Features

class FlutterCourse {
    constructor() {
        this.currentChapter = 1;
        this.totalChapters = 16;
        this.currentQuestion = 1;
        this.totalQuestions = 4;
        this.quizAnswers = {};
        this.correctAnswers = {
            q1: 'b', // Dart
            q2: 'b', // Google
            q3: 'a', // Cross-platform development
            q4: 'b'  // main() function
        };
        this.userProgress = this.loadProgress();
        this.dartOutput = [];
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
        const tabBtns = document.querySelectorAll('.tab-btn');
        const dartCode = document.getElementById('dartCode');

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                document.querySelectorAll('.code-editor, .code-result').forEach(el => {
                    el.classList.remove('active');
                });

                const targetElement = document.getElementById(`${tab}-editor`) || 
                                    document.getElementById(`${tab}-output`);
                
                if (targetElement) {
                    targetElement.classList.add('active');
                }

                if (tab === 'output') {
                    this.runDartCode();
                }
            });
        });

        // Auto-run on code change
        dartCode.addEventListener('input', () => {
            clearTimeout(this.codeTimeout);
            this.codeTimeout = setTimeout(() => {
                if (document.querySelector('[data-tab="output"]').classList.contains('active')) {
                    this.runDartCode();
                }
            }, 2000);
        });
    }

    runDartCode() {
        const dartCode = document.getElementById('dartCode').value;
        const outputContent = document.getElementById('dartOutputContent');
        
        // Clear previous output
        outputContent.innerHTML = '';
        
        try {
            // Simulate Dart code execution for educational purposes
            // In a real implementation, this would use DartPad API or similar
            const simulatedOutput = this.simulateDartExecution(dartCode);
            
            simulatedOutput.forEach(line => {
                const outputLine = document.createElement('div');
                outputLine.className = 'output-line';
                outputLine.textContent = line;
                outputContent.appendChild(outputLine);
            });
            
        } catch (error) {
            const errorLine = document.createElement('div');
            errorLine.className = 'output-line error';
            errorLine.textContent = `Error: ${error.message}`;
            outputContent.appendChild(errorLine);
        }
        
        // Track code execution
        this.trackActivity('dart_code_execution', {
            chapter: this.currentChapter,
            codeLength: dartCode.length
        });
    }

    simulateDartExecution(code) {
        const output = [];
        
        // Simple simulation of Dart print statements
        const printRegex = /print\(['"`](.*?)['"`]\);/g;
        const printWithVarRegex = /print\(['"`](.*?)\$\{?(.*?)\}?(.*?)['"`]\);/g;
        
        let match;
        
        // Handle simple print statements
        while ((match = printRegex.exec(code)) !== null) {
            output.push(match[1]);
        }
        
        // Handle print statements with variables (simplified)
        const varPrintMatches = code.match(/print\([^)]+\);/g);
        if (varPrintMatches) {
            varPrintMatches.forEach(statement => {
                if (statement.includes('$name')) {
                    output.push('Hello, I am Flutter Developer');
                } else if (statement.includes('Age:')) {
                    output.push('Age: 25, Height: 5.9');
                } else if (statement.includes('Currently learning:')) {
                    output.push('Currently learning: true');
                } else if (statement.includes('Skills:')) {
                    output.push('Skills: Dart, Flutter, Mobile Development');
                } else if (statement.includes('Profile:')) {
                    output.push('Profile: {name: Flutter Developer, skills: [Dart, Flutter, Mobile Development], experience: 2 years}');
                } else if (statement.includes('greetUser')) {
                    output.push('Welcome to Flutter, Student!');
                }
            });
        }
        
        if (output.length === 0) {
            output.push('Code executed successfully (no output)');
        }
        
        return output;
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
            this.awardPoints(100);
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
            feedback = 'Perfect! You have excellent understanding of Flutter fundamentals. Ready to build amazing mobile apps!';
        } else if (percentage >= 75) {
            feedback = 'Great work! You understand Flutter basics well. Keep practicing to master mobile development!';
        } else if (percentage >= 50) {
            feedback = 'Good start! Review the Flutter concepts and try the code examples to improve your understanding.';
        } else {
            feedback = 'Keep learning! Flutter takes practice. Review the fundamentals and try again.';
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
            1: { title: 'Chapter 1: Introduction to Flutter', duration: '90 minutes' },
            2: { title: 'Chapter 2: Dart Programming Basics', duration: '120 minutes' },
            3: { title: 'Chapter 3: Flutter Widgets Fundamentals', duration: '100 minutes' },
            4: { title: 'Chapter 4: Layouts and UI Design', duration: '110 minutes' },
            5: { title: 'Chapter 5: Stateful vs Stateless Widgets', duration: '95 minutes' },
            6: { title: 'Chapter 6: User Input and Forms', duration: '85 minutes' },
            7: { title: 'Chapter 7: Navigation and Routing', duration: '105 minutes' },
            8: { title: 'Chapter 8: State Management', duration: '130 minutes' },
            9: { title: 'Chapter 9: HTTP Requests and APIs', duration: '115 minutes' },
            10: { title: 'Chapter 10: Local Storage and Databases', duration: '100 minutes' },
            11: { title: 'Chapter 11: Animations and Transitions', duration: '120 minutes' },
            12: { title: 'Chapter 12: Device Features and Plugins', duration: '110 minutes' },
            13: { title: 'Chapter 13: Testing Flutter Apps', duration: '90 minutes' },
            14: { title: 'Chapter 14: App Deployment', duration: '100 minutes' },
            15: { title: 'Chapter 15: Performance Optimization', duration: '85 minutes' },
            16: { title: 'Chapter 16: Final Project: Complete App', duration: '180 minutes' }
        };
        
        return chapters[chapterNum] || chapters[1];
    }

    completeChapter(chapterNum) {
        const chapterItem = document.querySelector(`[data-chapter="${chapterNum}"]`);
        chapterItem.classList.add('completed');
        chapterItem.classList.remove('active');
        chapterItem.querySelector('.chapter-status i').className = 'fas fa-check';

        this.unlockNextChapter();
        this.awardPoints(150);
        
        this.userProgress.completedChapters.push(chapterNum);
        this.saveProgress();
        this.updateProgress();

        this.showNotification('Chapter completed! +150 points earned', 'success');

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
            courseName: 'Flutter Mobile Development Mastery',
            studentName: this.getUserName(),
            completionDate: new Date().toLocaleDateString(),
            courseHours: '30 Hours',
            grade: 'A+',
            skills: ['Flutter Framework', 'Dart Programming', 'Mobile UI/UX', 'Cross-Platform Development', 'App Store Deployment']
        });

        this.awardPoints(1000);
        this.awardBadge('Flutter Developer');
        this.awardBadge('Mobile App Creator');
        this.awardBadge('Cross-Platform Expert');

        this.showNotification('🎉 Congratulations! Flutter course completed. Certificate generated!', 'success');
        
        this.trackActivity('course_completed', {
            course: 'flutter',
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
        const duration = 1500;
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
        }, 70);
    }

    loadProgress() {
        const saved = localStorage.getItem('bandhannova_flutter_progress');
        return saved ? JSON.parse(saved) : {
            completedChapters: [],
            points: 0,
            badges: [],
            startDate: new Date().toISOString()
        };
    }

    saveProgress() {
        localStorage.setItem('bandhannova_flutter_progress', JSON.stringify(this.userProgress));
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
            course: 'flutter'
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
        }, 7000);
    }
}

// Global functions for HTML onclick handlers
function runDartCode() {
    window.flutterCourse.runDartCode();
}

function nextQuestion() {
    window.flutterCourse.nextQuestion();
}

function previousQuestion() {
    window.flutterCourse.previousQuestion();
}

function submitQuiz() {
    window.flutterCourse.submitQuiz();
}

function completeChapter(chapterNum) {
    window.flutterCourse.completeChapter(chapterNum);
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
    window.flutterCourse = new FlutterCourse();
});

// Copy protection
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
    }
});
