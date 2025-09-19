// SQL Course Interactive Features

class SQLCourse {
    constructor() {
        this.currentChapter = 1;
        this.totalChapters = 12;
        this.currentQuestion = 1;
        this.totalQuestions = 4;
        this.quizAnswers = {};
        this.correctAnswers = {
            q1: 'b', // Structured Query Language
            q2: 'b', // SELECT
            q3: 'a', // A unique identifier for each row
            q4: 'a'  // Relational Database
        };
        this.userProgress = this.loadProgress();
        this.sampleData = this.initializeSampleData();
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

    initializeSampleData() {
        return {
            employees: [
                { id: 1, name: 'John Smith', email: 'john@company.com', position: 'Software Engineer', department: 'Engineering', salary: 85000, hire_date: '2023-01-15' },
                { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', position: 'Product Manager', department: 'Product', salary: 95000, hire_date: '2022-08-20' },
                { id: 3, name: 'Mike Davis', email: 'mike@company.com', position: 'Senior Developer', department: 'Engineering', salary: 105000, hire_date: '2021-03-10' },
                { id: 4, name: 'Emily Brown', email: 'emily@company.com', position: 'UX Designer', department: 'Design', salary: 75000, hire_date: '2023-05-01' },
                { id: 5, name: 'David Wilson', email: 'david@company.com', position: 'Data Analyst', department: 'Analytics', salary: 70000, hire_date: '2022-11-12' },
                { id: 6, name: 'Lisa Garcia', email: 'lisa@company.com', position: 'Marketing Manager', department: 'Marketing', salary: 80000, hire_date: '2023-02-28' },
                { id: 7, name: 'Tom Anderson', email: 'tom@company.com', position: 'DevOps Engineer', department: 'Engineering', salary: 90000, hire_date: '2022-06-15' },
                { id: 8, name: 'Anna Martinez', email: 'anna@company.com', position: 'HR Specialist', department: 'HR', salary: 65000, hire_date: '2023-04-10' }
            ],
            departments: [
                { id: 1, name: 'Engineering', manager_id: 3, budget: 500000 },
                { id: 2, name: 'Product', manager_id: 2, budget: 300000 },
                { id: 3, name: 'Design', manager_id: 4, budget: 200000 },
                { id: 4, name: 'Analytics', manager_id: 5, budget: 150000 },
                { id: 5, name: 'Marketing', manager_id: 6, budget: 250000 },
                { id: 6, name: 'HR', manager_id: 8, budget: 100000 }
            ]
        };
    }

    setupCodePlayground() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const sqlCode = document.getElementById('sqlCode');

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
                                    document.getElementById(`${tab}-result`) || 
                                    document.getElementById(`${tab}-schema`);
                
                if (targetElement) {
                    targetElement.classList.add('active');
                }

                if (tab === 'result') {
                    this.runSQLQuery();
                }
            });
        });

        // Auto-run on code change
        sqlCode.addEventListener('input', () => {
            clearTimeout(this.codeTimeout);
            this.codeTimeout = setTimeout(() => {
                if (document.querySelector('[data-tab="result"]').classList.contains('active')) {
                    this.runSQLQuery();
                }
            }, 2000);
        });
    }

    runSQLQuery() {
        const sqlCode = document.getElementById('sqlCode').value;
        const resultContent = document.getElementById('sqlResultContent');
        
        try {
            const result = this.executeSQLQuery(sqlCode);
            this.displayQueryResult(result, resultContent);
            
        } catch (error) {
            resultContent.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>SQL Error: ${error.message}</span>
                </div>
            `;
        }
        
        // Track code execution
        this.trackActivity('sql_query_execution', {
            chapter: this.currentChapter,
            queryLength: sqlCode.length
        });
    }

    executeSQLQuery(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        // Simple SQL parser for educational purposes
        if (normalizedQuery.includes('select * from employees')) {
            return {
                columns: ['id', 'name', 'email', 'position', 'department', 'salary', 'hire_date'],
                rows: this.sampleData.employees,
                rowCount: this.sampleData.employees.length
            };
        }
        
        if (normalizedQuery.includes('select name, position, salary') && normalizedQuery.includes('engineering')) {
            const engineeringEmployees = this.sampleData.employees.filter(emp => 
                emp.department.toLowerCase() === 'engineering'
            );
            return {
                columns: ['name', 'position', 'salary'],
                rows: engineeringEmployees.map(emp => ({
                    name: emp.name,
                    position: emp.position,
                    salary: emp.salary
                })),
                rowCount: engineeringEmployees.length
            };
        }
        
        if (normalizedQuery.includes('count(*)') && normalizedQuery.includes('group by department')) {
            const departmentCounts = {};
            this.sampleData.employees.forEach(emp => {
                departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
            });
            
            const rows = Object.entries(departmentCounts).map(([dept, count]) => ({
                department: dept,
                employee_count: count
            }));
            
            return {
                columns: ['department', 'employee_count'],
                rows: rows,
                rowCount: rows.length
            };
        }
        
        if (normalizedQuery.includes('order by salary desc') && normalizedQuery.includes('limit 5')) {
            const sortedEmployees = [...this.sampleData.employees]
                .sort((a, b) => b.salary - a.salary)
                .slice(0, 5);
            
            return {
                columns: ['name', 'salary', 'department'],
                rows: sortedEmployees.map(emp => ({
                    name: emp.name,
                    salary: emp.salary,
                    department: emp.department
                })),
                rowCount: sortedEmployees.length
            };
        }
        
        // Default response for unrecognized queries
        return {
            columns: ['message'],
            rows: [{ message: 'Query executed successfully. Try the sample queries above for interactive results!' }],
            rowCount: 1
        };
    }

    displayQueryResult(result, container) {
        if (!result.rows || result.rows.length === 0) {
            container.innerHTML = '<div class="no-results">No results found.</div>';
            return;
        }

        let html = `
            <div class="result-info">
                <span><i class="fas fa-table"></i> ${result.rowCount} row(s) returned</span>
            </div>
            <div class="result-table-container">
                <table class="result-table">
                    <thead>
                        <tr>
        `;
        
        result.columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        
        html += '</tr></thead><tbody>';
        
        result.rows.forEach(row => {
            html += '<tr>';
            result.columns.forEach(col => {
                const value = row[col] !== undefined ? row[col] : '';
                html += `<td>${value}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        
        container.innerHTML = html;
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
            this.awardPoints(80);
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
            feedback = 'Excellent! You have a solid understanding of database fundamentals. Ready for advanced SQL concepts!';
        } else if (percentage >= 75) {
            feedback = 'Great work! You understand the core database concepts. Keep practicing SQL queries!';
        } else if (percentage >= 50) {
            feedback = 'Good start! Review the database concepts and try the SQL examples to improve your understanding.';
        } else {
            feedback = 'Keep learning! Databases take practice. Review the fundamentals and try again.';
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
    }

    getChapterData(chapterNum) {
        const chapters = {
            1: { title: 'Chapter 1: Introduction to Databases', duration: '80 minutes' },
            2: { title: 'Chapter 2: SQL Fundamentals', duration: '100 minutes' },
            3: { title: 'Chapter 3: Creating Tables & Data Types', duration: '90 minutes' },
            4: { title: 'Chapter 4: Inserting & Updating Data', duration: '85 minutes' },
            5: { title: 'Chapter 5: Querying Data with SELECT', duration: '110 minutes' },
            6: { title: 'Chapter 6: Filtering & Sorting Data', duration: '95 minutes' },
            7: { title: 'Chapter 7: Joins and Relationships', duration: '120 minutes' },
            8: { title: 'Chapter 8: Aggregate Functions', duration: '100 minutes' },
            9: { title: 'Chapter 9: Subqueries & Advanced Queries', duration: '115 minutes' },
            10: { title: 'Chapter 10: Indexes & Performance', duration: '105 minutes' },
            11: { title: 'Chapter 11: Stored Procedures & Functions', duration: '90 minutes' },
            12: { title: 'Chapter 12: Final Project: E-commerce DB', duration: '150 minutes' }
        };
        
        return chapters[chapterNum] || chapters[1];
    }

    completeChapter(chapterNum) {
        const chapterItem = document.querySelector(`[data-chapter="${chapterNum}"]`);
        chapterItem.classList.add('completed');
        chapterItem.classList.remove('active');
        chapterItem.querySelector('.chapter-status i').className = 'fas fa-check';

        this.unlockNextChapter();
        this.awardPoints(120);
        
        this.userProgress.completedChapters.push(chapterNum);
        this.saveProgress();
        this.updateProgress();

        this.showNotification('Chapter completed! +120 points earned', 'success');

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
            courseName: 'SQL Database Mastery',
            studentName: this.getUserName(),
            completionDate: new Date().toLocaleDateString(),
            courseHours: '20 Hours',
            grade: 'A+',
            skills: ['SQL Queries', 'Database Design', 'Data Analysis', 'Performance Optimization', 'Stored Procedures']
        });

        this.awardPoints(800);
        this.awardBadge('SQL Expert');
        this.awardBadge('Database Administrator');
        this.awardBadge('Data Analyst');

        this.showNotification('🎉 Congratulations! SQL course completed. Certificate generated!', 'success');
        
        this.trackActivity('course_completed', {
            course: 'sql',
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
        const saved = localStorage.getItem('bandhannova_sql_progress');
        return saved ? JSON.parse(saved) : {
            completedChapters: [],
            points: 0,
            badges: [],
            startDate: new Date().toISOString()
        };
    }

    saveProgress() {
        localStorage.setItem('bandhannova_sql_progress', JSON.stringify(this.userProgress));
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
            course: 'sql'
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
function runSQLQuery() {
    window.sqlCourse.runSQLQuery();
}

function nextQuestion() {
    window.sqlCourse.nextQuestion();
}

function previousQuestion() {
    window.sqlCourse.previousQuestion();
}

function submitQuiz() {
    window.sqlCourse.submitQuiz();
}

function completeChapter(chapterNum) {
    window.sqlCourse.completeChapter(chapterNum);
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
    window.sqlCourse = new SQLCourse();
});

// Copy protection
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
    }
});
