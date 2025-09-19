// Python Course Interactive Features

class PythonCourse {
    constructor() {
        this.currentChapter = 1;
        this.currentQuestion = 1;
        this.totalQuestions = 3;
        this.score = 0;
        this.userProgress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupCodePlayground();
        this.setupQuizSystem();
        this.updateProgress();
        this.setupChapterNavigation();
    }

    setupCodePlayground() {
        const codeEditor = document.getElementById('codeEditor');
        const codeOutput = document.getElementById('codeOutput');

        if (codeEditor) {
            // Add syntax highlighting and auto-indentation
            codeEditor.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = codeEditor.selectionStart;
                    const end = codeEditor.selectionEnd;
                    codeEditor.value = codeEditor.value.substring(0, start) + '    ' + codeEditor.value.substring(end);
                    codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
                }
            });

            // Auto-save code
            codeEditor.addEventListener('input', () => {
                this.saveCode(codeEditor.value);
            });

            // Load saved code
            const savedCode = this.loadCode();
            if (savedCode) {
                codeEditor.value = savedCode;
            }
        }
    }

    setupQuizSystem() {
        this.quizData = [
            {
                question: "What symbol is used for single-line comments in Python?",
                options: ["//", "#", "/*", "--"],
                correct: 1,
                explanation: "Python uses # for single-line comments, unlike languages like JavaScript or C++ that use //"
            },
            {
                question: "Which of the following is a valid Python variable name?",
                options: ["2variable", "my-variable", "my_variable", "class"],
                correct: 2,
                explanation: "Variable names can contain letters, numbers, and underscores, but cannot start with a number or use hyphens"
            },
            {
                question: "What will print('Hello', 'World') output?",
                options: ["HelloWorld", "Hello World", "Hello,World", "Error"],
                correct: 1,
                explanation: "The print() function automatically adds spaces between multiple arguments"
            }
        ];
    }

    setupChapterNavigation() {
        const chapterItems = document.querySelectorAll('.chapter-item');
        chapterItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('locked')) {
                    this.loadChapter(index + 1);
                }
            });
        });
    }

    runCode() {
        const codeEditor = document.getElementById('codeEditor');
        const codeOutput = document.getElementById('codeOutput');
        const code = codeEditor.value;

        // Show loading
        codeOutput.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> Running code...';

        // Simulate code execution (in real implementation, this would use a Python interpreter)
        setTimeout(() => {
            try {
                const output = this.simulatePythonExecution(code);
                codeOutput.innerHTML = output;
                
                // Award points for running code
                this.awardPoints(5, 'Code Execution');
            } catch (error) {
                codeOutput.innerHTML = `<span style="color: var(--error-red);">Error: ${error.message}</span>`;
            }
        }, 1000);
    }

    simulatePythonExecution(code) {
        // Simple Python code simulator for basic examples
        const lines = code.split('\n');
        let output = '';

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('#') || line === '') continue;

            if (line.startsWith('print(')) {
                const match = line.match(/print\((.*)\)/);
                if (match) {
                    let content = match[1];
                    
                    // Handle f-strings
                    if (content.startsWith('f"') || content.startsWith("f'")) {
                        content = content.substring(2, content.length - 1);
                        // Simple variable substitution
                        content = content.replace(/\{(\w+)\}/g, (match, varName) => {
                            if (varName === 'name') return 'BandhanNova Student';
                            return match;
                        });
                    } else {
                        // Remove quotes
                        content = content.replace(/^["']|["']$/g, '');
                    }
                    
                    output += content + '\n';
                }
            } else if (line.includes('=') && !line.includes('==')) {
                // Variable assignment (just acknowledge it)
                const varName = line.split('=')[0].trim();
                output += `# Variable '${varName}' assigned\n`;
            }
        }

        return output || 'Code executed successfully!';
    }

    resetCode() {
        const codeEditor = document.getElementById('codeEditor');
        const codeOutput = document.getElementById('codeOutput');
        
        codeEditor.value = `print("Hello, World!")
print("Welcome to Python programming!")

# This is a comment
name = "BandhanNova Student"
print(f"Hello, {name}!")`;
        
        codeOutput.innerHTML = 'Click "Run" to execute the code...';
    }

    selectOption(element, isCorrect) {
        // Remove previous selections
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });

        // Mark selected option
        element.classList.add('selected');
        
        // Show correct/incorrect after a delay
        setTimeout(() => {
            if (isCorrect) {
                element.classList.add('correct');
                this.score++;
                this.awardPoints(10, 'Correct Answer');
                showNotification('Correct! Well done!', 'success');
            } else {
                element.classList.add('incorrect');
                // Show correct answer
                const correctOption = document.querySelectorAll('.quiz-option')[this.quizData[this.currentQuestion - 1].correct];
                correctOption.classList.add('correct');
                showNotification('Incorrect. The correct answer is highlighted.', 'error');
            }

            // Enable next button
            const nextBtn = document.querySelector('.quiz-actions .btn-primary');
            nextBtn.disabled = false;

            // Update score display
            document.querySelector('.quiz-score').textContent = `Score: ${this.score}/${this.totalQuestions}`;
        }, 500);
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.loadQuestion();
        } else {
            this.completeQuiz();
        }
    }

    loadQuestion() {
        const questionData = this.quizData[this.currentQuestion - 1];
        const questionElement = document.querySelector('.quiz-question h4');
        const optionsContainer = document.querySelector('.quiz-options');
        const progressBar = document.querySelector('.quiz-progress-fill');
        const questionCounter = document.querySelector('.quiz-header p');

        // Update question
        questionElement.textContent = questionData.question;

        // Update options
        optionsContainer.innerHTML = '';
        questionData.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.onclick = () => this.selectOption(optionElement, index === questionData.correct);
            optionElement.innerHTML = `
                <span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span>
                <span>${option}</span>
            `;
            optionsContainer.appendChild(optionElement);
        });

        // Update progress
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
        questionCounter.textContent = `Question ${this.currentQuestion} of ${this.totalQuestions}`;

        // Disable next button
        document.querySelector('.quiz-actions .btn-primary').disabled = true;
    }

    completeQuiz() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        let message = '';
        let type = 'info';

        if (percentage >= 80) {
            message = `Excellent! You scored ${percentage}%`;
            type = 'success';
            this.awardPoints(50, 'Quiz Mastery');
        } else if (percentage >= 60) {
            message = `Good job! You scored ${percentage}%`;
            type = 'success';
            this.awardPoints(30, 'Quiz Completion');
        } else {
            message = `You scored ${percentage}%. Consider reviewing the material.`;
            type = 'warning';
            this.awardPoints(10, 'Quiz Attempt');
        }

        showNotification(message, type);

        // Replace quiz with completion message
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.innerHTML = `
            <div class="quiz-completion">
                <div class="completion-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Quiz Completed!</h3>
                <p>Your Score: ${this.score}/${this.totalQuestions} (${percentage}%)</p>
                <button class="btn btn-secondary" onclick="pythonCourse.retakeQuiz()">
                    <i class="fas fa-redo"></i>
                    Retake Quiz
                </button>
            </div>
        `;
    }

    retakeQuiz() {
        this.currentQuestion = 1;
        this.score = 0;
        this.setupQuizSystem();
        
        // Reload quiz HTML
        location.reload();
    }

    completeChapter(chapterNumber) {
        // Mark chapter as completed
        this.userProgress.completedChapters.push(chapterNumber);
        this.userProgress.currentChapter = chapterNumber + 1;
        
        // Award completion points
        this.awardPoints(100, `Chapter ${chapterNumber} Completion`);
        
        // Update progress
        this.updateProgress();
        this.saveProgress();
        
        // Show achievement
        if (window.animationController) {
            window.animationController.showAchievement(
                'Chapter Completed!',
                `You've successfully completed Chapter ${chapterNumber}`,
                'fas fa-trophy'
            );
        }
        
        // Unlock next chapter
        const nextChapter = document.querySelector(`[data-chapter="${chapterNumber + 1}"]`);
        if (nextChapter) {
            nextChapter.classList.remove('locked');
            nextChapter.classList.add('current');
            nextChapter.querySelector('.chapter-status i').className = 'fas fa-play-circle';
        }
        
        // Mark current chapter as completed
        const currentChapter = document.querySelector(`[data-chapter="${chapterNumber}"]`);
        if (currentChapter) {
            currentChapter.classList.remove('current');
            currentChapter.classList.add('completed');
            currentChapter.querySelector('.chapter-status i').className = 'fas fa-check-circle';
        }
        
        showNotification('Chapter completed! Next chapter unlocked.', 'success');
    }

    loadChapter(chapterNumber) {
        // This would load different chapter content
        // For now, we'll just update the current chapter
        this.currentChapter = chapterNumber;
        
        // Update chapter selection in sidebar
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.classList.remove('current');
        });
        
        const selectedChapter = document.querySelector(`[data-chapter="${chapterNumber}"]`);
        if (selectedChapter && !selectedChapter.classList.contains('locked')) {
            selectedChapter.classList.add('current');
        }
    }

    updateProgress() {
        const completedCount = this.userProgress.completedChapters.length;
        const totalChapters = 15;
        const percentage = Math.round((completedCount / totalChapters) * 100);
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = document.querySelector('.progress-percentage');
        const progressStats = document.querySelector('.progress-stats');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${percentage}%`;
        }
        
        if (progressStats) {
            progressStats.innerHTML = `
                <span>${completedCount} of ${totalChapters} chapters completed</span>
                <span>${this.userProgress.totalPoints} points earned</span>
            `;
        }
    }

    awardPoints(points, reason) {
        this.userProgress.totalPoints += points;
        this.saveProgress();
        
        // Show points notification
        showNotification(`+${points} points for ${reason}!`, 'success');
        
        // Update points display
        const progressStats = document.querySelector('.progress-stats');
        if (progressStats) {
            const pointsSpan = progressStats.querySelector('span:last-child');
            if (pointsSpan) {
                pointsSpan.textContent = `${this.userProgress.totalPoints} points earned`;
            }
        }
    }

    saveProgress() {
        localStorage.setItem('bandhannova_python_progress', JSON.stringify(this.userProgress));
    }

    loadProgress() {
        const saved = localStorage.getItem('bandhannova_python_progress');
        return saved ? JSON.parse(saved) : {
            completedChapters: [],
            currentChapter: 1,
            totalPoints: 0,
            quizScores: {}
        };
    }

    saveCode(code) {
        localStorage.setItem('bandhannova_python_code', code);
    }

    loadCode() {
        return localStorage.getItem('bandhannova_python_code');
    }
}

// Global functions for HTML onclick handlers
function runCode() {
    pythonCourse.runCode();
}

function resetCode() {
    pythonCourse.resetCode();
}

function selectOption(element, isCorrect) {
    pythonCourse.selectOption(element, isCorrect);
}

function nextQuestion() {
    pythonCourse.nextQuestion();
}

function completeChapter(chapterNumber) {
    pythonCourse.completeChapter(chapterNumber);
}

function startFirstChapter() {
    pythonCourse.loadChapter(1);
    document.querySelector('.lesson-content').scrollIntoView({ behavior: 'smooth' });
}

// Initialize course when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pythonCourse = new PythonCourse();
});
