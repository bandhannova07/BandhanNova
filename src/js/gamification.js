// Gamification System for BandhanNova
class GamificationSystem {
    constructor() {
        this.userProgress = this.loadUserProgress();
        this.achievements = this.initializeAchievements();
        this.pointsSystem = {
            chapterComplete: 100,
            quizPassed: 50,
            courseComplete: 500,
            perfectQuiz: 100,
            streakBonus: 25,
            firstLogin: 50
        };
        this.init();
    }

    init() {
        this.updateProgressDisplay();
        this.checkAchievements();
        this.initializeProgressTrackers();
    }

    initializeAchievements() {
        return {
            'first-steps': {
                id: 'first-steps',
                title: 'First Steps',
                description: 'Complete your first chapter',
                icon: 'fas fa-baby',
                points: 100,
                unlocked: false,
                category: 'beginner'
            },
            'quiz-master': {
                id: 'quiz-master',
                title: 'Quiz Master',
                description: 'Pass 10 quizzes',
                icon: 'fas fa-brain',
                points: 500,
                unlocked: false,
                category: 'learning'
            },
            'python-expert': {
                id: 'python-expert',
                title: 'Python Expert',
                description: 'Complete Python course',
                icon: 'fab fa-python',
                points: 1000,
                unlocked: false,
                category: 'mastery'
            },
            'javascript-ninja': {
                id: 'javascript-ninja',
                title: 'JavaScript Ninja',
                description: 'Complete JavaScript course',
                icon: 'fab fa-js-square',
                points: 1000,
                unlocked: false,
                category: 'mastery'
            },
            'full-stack': {
                id: 'full-stack',
                title: 'Full Stack Developer',
                description: 'Complete 3 programming courses',
                icon: 'fas fa-layer-group',
                points: 2000,
                unlocked: false,
                category: 'expert'
            },
            'streak-warrior': {
                id: 'streak-warrior',
                title: 'Streak Warrior',
                description: 'Learn for 7 consecutive days',
                icon: 'fas fa-fire',
                points: 750,
                unlocked: false,
                category: 'dedication'
            },
            'perfectionist': {
                id: 'perfectionist',
                title: 'Perfectionist',
                description: 'Score 100% on 5 quizzes',
                icon: 'fas fa-star',
                points: 600,
                unlocked: false,
                category: 'excellence'
            },
            'polyglot': {
                id: 'polyglot',
                title: 'Programming Polyglot',
                description: 'Complete all 7 programming courses',
                icon: 'fas fa-crown',
                points: 5000,
                unlocked: false,
                category: 'legendary'
            }
        };
    }

    loadUserProgress() {
        const defaultProgress = {
            totalPoints: 0,
            level: 1,
            coursesCompleted: [],
            chaptersCompleted: [],
            quizzesPassed: [],
            perfectQuizzes: [],
            loginStreak: 0,
            lastLoginDate: null,
            achievements: [],
            badges: []
        };
        
        const saved = localStorage.getItem('bandhannova_progress');
        return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
    }

    saveUserProgress() {
        localStorage.setItem('bandhannova_progress', JSON.stringify(this.userProgress));
    }

    addPoints(points, reason = '') {
        this.userProgress.totalPoints += points;
        this.updateLevel();
        this.saveUserProgress();
        this.showPointsNotification(points, reason);
        this.updateProgressDisplay();
    }

    updateLevel() {
        const newLevel = Math.floor(this.userProgress.totalPoints / 1000) + 1;
        if (newLevel > this.userProgress.level) {
            this.userProgress.level = newLevel;
            this.showLevelUpNotification(newLevel);
        }
    }

    completeChapter(courseId, chapterId) {
        const chapterKey = `${courseId}-${chapterId}`;
        if (!this.userProgress.chaptersCompleted.includes(chapterKey)) {
            this.userProgress.chaptersCompleted.push(chapterKey);
            this.addPoints(this.pointsSystem.chapterComplete, 'Chapter Completed');
            this.checkAchievements();
        }
    }

    completeQuiz(courseId, chapterId, score) {
        const quizKey = `${courseId}-${chapterId}`;
        if (!this.userProgress.quizzesPassed.includes(quizKey)) {
            this.userProgress.quizzesPassed.push(quizKey);
            this.addPoints(this.pointsSystem.quizPassed, 'Quiz Passed');
            
            if (score === 100) {
                this.userProgress.perfectQuizzes.push(quizKey);
                this.addPoints(this.pointsSystem.perfectQuiz, 'Perfect Quiz!');
            }
            
            this.checkAchievements();
        }
    }

    completeCourse(courseId) {
        if (!this.userProgress.coursesCompleted.includes(courseId)) {
            this.userProgress.coursesCompleted.push(courseId);
            this.addPoints(this.pointsSystem.courseComplete, 'Course Completed');
            this.unlockAchievement(`${courseId}-expert`);
            this.checkAchievements();
        }
    }

    checkAchievements() {
        // First Steps
        if (this.userProgress.chaptersCompleted.length >= 1) {
            this.unlockAchievement('first-steps');
        }

        // Quiz Master
        if (this.userProgress.quizzesPassed.length >= 10) {
            this.unlockAchievement('quiz-master');
        }

        // Course-specific achievements
        if (this.userProgress.coursesCompleted.includes('python')) {
            this.unlockAchievement('python-expert');
        }
        if (this.userProgress.coursesCompleted.includes('javascript')) {
            this.unlockAchievement('javascript-ninja');
        }

        // Full Stack Developer
        if (this.userProgress.coursesCompleted.length >= 3) {
            this.unlockAchievement('full-stack');
        }

        // Perfectionist
        if (this.userProgress.perfectQuizzes.length >= 5) {
            this.unlockAchievement('perfectionist');
        }

        // Programming Polyglot
        if (this.userProgress.coursesCompleted.length >= 7) {
            this.unlockAchievement('polyglot');
        }
    }

    unlockAchievement(achievementId) {
        if (this.achievements[achievementId] && !this.achievements[achievementId].unlocked) {
            this.achievements[achievementId].unlocked = true;
            this.userProgress.achievements.push(achievementId);
            this.addPoints(this.achievements[achievementId].points, `Achievement: ${this.achievements[achievementId].title}`);
            this.showAchievementNotification(this.achievements[achievementId]);
            this.saveUserProgress();
        }
    }

    updateLoginStreak() {
        const today = new Date().toDateString();
        const lastLogin = this.userProgress.lastLoginDate;
        
        if (lastLogin) {
            const lastLoginDate = new Date(lastLogin);
            const todayDate = new Date(today);
            const diffTime = todayDate - lastLoginDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                this.userProgress.loginStreak++;
                this.addPoints(this.pointsSystem.streakBonus, `${this.userProgress.loginStreak} Day Streak!`);
            } else if (diffDays > 1) {
                this.userProgress.loginStreak = 1;
            }
        } else {
            this.userProgress.loginStreak = 1;
            this.addPoints(this.pointsSystem.firstLogin, 'Welcome to BandhanNova!');
        }
        
        this.userProgress.lastLoginDate = today;
        
        // Check streak achievements
        if (this.userProgress.loginStreak >= 7) {
            this.unlockAchievement('streak-warrior');
        }
        
        this.saveUserProgress();
    }

    initializeProgressTrackers() {
        // Create progress indicators for courses
        this.createCourseProgressIndicators();
        this.createAchievementDisplay();
        this.createLevelDisplay();
    }

    createCourseProgressIndicators() {
        const courses = ['python', 'javascript', 'html-css', 'flutter', 'sql', 'ruby', 'cpp'];
        const chapters = { python: 12, javascript: 14, 'html-css': 10, flutter: 16, sql: 12, ruby: 14, cpp: 18 };
        
        courses.forEach(courseId => {
            const completedChapters = this.userProgress.chaptersCompleted.filter(ch => ch.startsWith(courseId)).length;
            const totalChapters = chapters[courseId];
            const progress = (completedChapters / totalChapters) * 100;
            
            // Update progress bars if they exist
            const progressBar = document.querySelector(`[data-course="${courseId}"] .progress-fill`);
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            const progressText = document.querySelector(`[data-course="${courseId}"] .progress-text`);
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}% Complete`;
            }
        });
    }

    createAchievementDisplay() {
        const achievementContainer = document.getElementById('achievements-container');
        if (!achievementContainer) return;
        
        achievementContainer.innerHTML = '';
        
        Object.values(this.achievements).forEach(achievement => {
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            achievementEl.innerHTML = `
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    <span class="achievement-points">${achievement.points} pts</span>
                </div>
            `;
            achievementContainer.appendChild(achievementEl);
        });
    }

    createLevelDisplay() {
        const levelDisplay = document.getElementById('user-level');
        if (levelDisplay) {
            levelDisplay.innerHTML = `
                <div class="level-info">
                    <div class="level-number">Level ${this.userProgress.level}</div>
                    <div class="level-points">${this.userProgress.totalPoints} points</div>
                    <div class="level-progress">
                        <div class="level-progress-bar">
                            <div class="level-progress-fill" style="width: ${(this.userProgress.totalPoints % 1000) / 10}%"></div>
                        </div>
                        <span class="level-progress-text">${this.userProgress.totalPoints % 1000}/1000 to next level</span>
                    </div>
                </div>
            `;
        }
    }

    updateProgressDisplay() {
        this.createCourseProgressIndicators();
        this.createLevelDisplay();
        this.createAchievementDisplay();
    }

    showPointsNotification(points, reason) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-plus-circle"></i>
                <span>+${points} points</span>
                ${reason ? `<small>${reason}</small>` : ''}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showLevelUpNotification(level) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-trophy"></i>
                <h3>Level Up!</h3>
                <p>You've reached Level ${level}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-text">
                    <h3>Achievement Unlocked!</h3>
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    <span>+${achievement.points} points</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getProgressStats() {
        return {
            level: this.userProgress.level,
            totalPoints: this.userProgress.totalPoints,
            coursesCompleted: this.userProgress.coursesCompleted.length,
            chaptersCompleted: this.userProgress.chaptersCompleted.length,
            quizzesPassed: this.userProgress.quizzesPassed.length,
            achievementsUnlocked: this.userProgress.achievements.length,
            loginStreak: this.userProgress.loginStreak
        };
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('bandhannova_progress');
            this.userProgress = this.loadUserProgress();
            this.achievements = this.initializeAchievements();
            this.updateProgressDisplay();
        }
    }
}

// Global gamification instance
window.gamificationSystem = new GamificationSystem();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.gamificationSystem.updateLoginStreak();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}
