// Dashboard Interactive Features

class Dashboard {
    constructor() {
        this.userData = this.loadUserData();
        this.learningChart = null;
        this.init();
    }

    init() {
        this.updateUserStats();
        this.loadProgress();
        this.loadRecentActivity();
        this.loadAchievements();
        this.initializeChart();
        this.setupEventListeners();
    }

    loadUserData() {
        const defaultData = {
            name: 'BandhanNova Student',
            email: '',
            bio: '',
            goals: [],
            totalPoints: 0,
            badges: [],
            certificates: [],
            progress: {
                python: 0,
                javascript: 0,
                flutter: 0,
                'html-css': 0,
                sql: 0,
                cpp: 0,
                ruby: 0
            },
            activities: [],
            achievements: []
        };

        const saved = localStorage.getItem('bandhannova_user_data');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveUserData() {
        localStorage.setItem('bandhannova_user_data', JSON.stringify(this.userData));
    }

    updateUserStats() {
        document.getElementById('userName').textContent = this.userData.name;
        document.getElementById('totalPoints').textContent = this.userData.totalPoints;
        document.getElementById('totalBadges').textContent = this.userData.badges.length;
        document.getElementById('totalCertificates').textContent = this.userData.certificates.length;
    }

    loadProgress() {
        const languages = ['python', 'javascript', 'flutter', 'html-css'];
        
        languages.forEach(lang => {
            const progressElement = document.querySelector(`[data-progress="${lang}"]`);
            const percentageElement = progressElement?.parentElement.nextElementSibling;
            
            if (progressElement && percentageElement) {
                const progress = this.userData.progress[lang] || 0;
                progressElement.style.width = `${progress}%`;
                percentageElement.textContent = `${progress}%`;
                
                // Animate progress bars
                setTimeout(() => {
                    progressElement.classList.add('animated-progress');
                }, 100);
            }
        });
    }

    loadRecentActivity() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const activities = this.userData.activities.slice(-5).reverse();
        
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-info">
                        <p>No recent activity</p>
                        <span class="activity-time">Start learning to see activities here</span>
                    </div>
                </div>
            `;
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-info">
                    <p>${activity.description}</p>
                    <span class="activity-time">${this.formatTimeAgo(activity.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    loadAchievements() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        if (!achievementsGrid) return;

        const allAchievements = [
            {
                id: 'first-steps',
                icon: 'fas fa-baby',
                title: 'First Steps',
                description: 'Complete your first lesson',
                condition: () => this.userData.activities.some(a => a.type === 'lesson_complete')
            },
            {
                id: 'on-fire',
                icon: 'fas fa-fire',
                title: 'On Fire',
                description: 'Complete 5 lessons in a day',
                condition: () => this.checkDailyLessons() >= 5
            },
            {
                id: 'graduate',
                icon: 'fas fa-graduation-cap',
                title: 'Graduate',
                description: 'Complete a full course',
                condition: () => Object.values(this.userData.progress).some(p => p >= 100)
            },
            {
                id: 'gamer',
                icon: 'fas fa-gamepad',
                title: 'Gamer',
                description: 'Play 10 different games',
                condition: () => this.userData.activities.filter(a => a.type === 'game_play').length >= 10
            },
            {
                id: 'points-collector',
                icon: 'fas fa-coins',
                title: 'Points Collector',
                description: 'Earn 1000 points',
                condition: () => this.userData.totalPoints >= 1000
            },
            {
                id: 'quiz-master',
                icon: 'fas fa-brain',
                title: 'Quiz Master',
                description: 'Score 100% on 5 quizzes',
                condition: () => this.userData.activities.filter(a => a.type === 'quiz_perfect').length >= 5
            }
        ];

        achievementsGrid.innerHTML = allAchievements.map(achievement => {
            const isUnlocked = achievement.condition();
            const isEarned = this.userData.achievements.includes(achievement.id);
            
            if (isUnlocked && !isEarned) {
                this.unlockAchievement(achievement.id);
            }
            
            return `
                <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">
                        <i class="${achievement.icon}"></i>
                    </div>
                    <div class="achievement-info">
                        <h4>${achievement.title}</h4>
                        <p>${achievement.description}</p>
                    </div>
                    ${isUnlocked ? '<div class="achievement-badge"><i class="fas fa-check"></i></div>' : ''}
                </div>
            `;
        }).join('');
    }

    unlockAchievement(achievementId) {
        if (!this.userData.achievements.includes(achievementId)) {
            this.userData.achievements.push(achievementId);
            this.userData.totalPoints += 100;
            this.saveUserData();
            
            // Show achievement notification
            if (window.animationController) {
                window.animationController.showAchievement(
                    'Achievement Unlocked!',
                    'You earned a new badge!',
                    'fas fa-trophy'
                );
            }
        }
    }

    checkDailyLessons() {
        const today = new Date().toDateString();
        return this.userData.activities.filter(a => 
            a.type === 'lesson_complete' && 
            new Date(a.timestamp).toDateString() === today
        ).length;
    }

    initializeChart() {
        const ctx = document.getElementById('learningChart');
        if (!ctx) return;

        const chartData = this.generateChartData();
        
        this.learningChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Learning Hours',
                    data: chartData.data,
                    borderColor: 'var(--primary-blue)',
                    backgroundColor: 'rgba(2, 86, 155, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    generateChartData() {
        const period = document.getElementById('chartPeriod')?.value || 'month';
        const now = new Date();
        let labels = [];
        let data = [];

        if (period === 'week') {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                data.push(Math.floor(Math.random() * 4) + 1); // Mock data
            }
        } else if (period === 'month') {
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                if (i % 5 === 0) {
                    labels.push(date.getDate().toString());
                    data.push(Math.floor(Math.random() * 6) + 2); // Mock data
                }
            }
        } else if (period === 'year') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentMonth = now.getMonth();
            for (let i = 11; i >= 0; i--) {
                const monthIndex = (currentMonth - i + 12) % 12;
                labels.push(months[monthIndex]);
                data.push(Math.floor(Math.random() * 50) + 20); // Mock data
            }
        }

        return { labels, data };
    }

    setupEventListeners() {
        // Chart period change
        const chartPeriod = document.getElementById('chartPeriod');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', () => {
                this.updateChart();
            });
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        // Certificate course selection
        const certCourse = document.getElementById('certCourse');
        if (certCourse) {
            certCourse.addEventListener('change', () => {
                this.updateCertificatePreview();
            });
        }
    }

    updateChart() {
        if (this.learningChart) {
            const chartData = this.generateChartData();
            this.learningChart.data.labels = chartData.labels;
            this.learningChart.data.datasets[0].data = chartData.data;
            this.learningChart.update();
        }
    }

    addActivity(type, description, icon = 'fas fa-info-circle') {
        const activity = {
            type,
            description,
            icon,
            timestamp: new Date().toISOString()
        };
        
        this.userData.activities.push(activity);
        this.saveUserData();
        this.loadRecentActivity();
    }

    updateProgress(language, progress) {
        this.userData.progress[language] = Math.max(this.userData.progress[language] || 0, progress);
        this.saveUserData();
        this.loadProgress();
        this.loadAchievements();
    }

    awardPoints(points, reason) {
        this.userData.totalPoints += points;
        this.addActivity('points_earned', `Earned ${points} points for ${reason}`, 'fas fa-coins');
        this.updateUserStats();
        this.saveUserData();
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return time.toLocaleDateString();
    }

    updateCertificatePreview() {
        const courseSelect = document.getElementById('certCourse');
        const courseName = document.getElementById('certCourseName');
        const recipientName = document.getElementById('certRecipientName');
        const certDate = document.getElementById('certDate');

        if (courseSelect && courseName && recipientName && certDate) {
            const courseNames = {
                python: 'Python Programming',
                javascript: 'JavaScript Fundamentals',
                'html-css': 'HTML & CSS Basics',
                flutter: 'Flutter Development'
            };

            courseName.textContent = courseNames[courseSelect.value] || 'Programming Course';
            recipientName.textContent = this.userData.name;
            certDate.textContent = new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        }
    }
}

// Global functions for HTML onclick handlers
function refreshProgress() {
    if (window.dashboard) {
        window.dashboard.loadProgress();
        showNotification('Progress refreshed!', 'success');
    }
}

function takeQuiz() {
    showNotification('Quiz feature coming soon!', 'info');
    // In real implementation, this would redirect to quiz page
}

function viewProfile() {
    const profileModal = document.getElementById('profileModal');
    const profileForm = document.getElementById('profileForm');
    
    if (profileModal && profileForm && window.dashboard) {
        // Populate form with current data
        document.getElementById('profileName').value = window.dashboard.userData.name;
        document.getElementById('profileEmail').value = window.dashboard.userData.email;
        document.getElementById('profileBio').value = window.dashboard.userData.bio;
        
        profileModal.style.display = 'flex';
    }
}

function closeProfileModal() {
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.style.display = 'none';
    }
}

function saveProfile() {
    if (!window.dashboard) return;

    const formData = new FormData(document.getElementById('profileForm'));
    const goals = Array.from(document.getElementById('profileGoals').selectedOptions).map(opt => opt.value);
    
    window.dashboard.userData.name = formData.get('name') || 'BandhanNova Student';
    window.dashboard.userData.email = formData.get('email') || '';
    window.dashboard.userData.bio = formData.get('bio') || '';
    window.dashboard.userData.goals = goals;
    
    window.dashboard.saveUserData();
    window.dashboard.updateUserStats();
    
    closeProfileModal();
    showNotification('Profile updated successfully!', 'success');
}

function generateCertificate() {
    const certificateModal = document.getElementById('certificateModal');
    if (certificateModal && window.dashboard) {
        window.dashboard.updateCertificatePreview();
        certificateModal.style.display = 'flex';
    }
}

function closeCertificateModal() {
    const certificateModal = document.getElementById('certificateModal');
    if (certificateModal) {
        certificateModal.style.display = 'none';
    }
}

function downloadCertificate() {
    // In a real implementation, this would generate a PDF using jsPDF
    showNotification('Certificate download feature coming soon!', 'info');
    
    // Mock certificate generation
    if (window.dashboard) {
        const courseSelect = document.getElementById('certCourse');
        const courseName = courseSelect.options[courseSelect.selectedIndex].text;
        
        window.dashboard.userData.certificates.push({
            course: courseName,
            date: new Date().toISOString(),
            id: Date.now().toString()
        });
        
        window.dashboard.saveUserData();
        window.dashboard.updateUserStats();
        
        closeCertificateModal();
        showNotification(`Certificate for ${courseName} generated!`, 'success');
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    
    // Mock some initial data for demo
    if (window.dashboard.userData.activities.length === 0) {
        window.dashboard.addActivity('lesson_start', 'Started Python Chapter 1', 'fas fa-play');
        window.dashboard.addActivity('game_play', 'Played Snake Game', 'fas fa-gamepad');
        window.dashboard.addActivity('points_earned', 'Earned 50 points', 'fas fa-trophy');
    }
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const modals = ['profileModal', 'certificateModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Export dashboard for global access
window.Dashboard = Dashboard;
