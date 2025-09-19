// Entertainment Hub Interactive Features

class EntertainmentHub {
    constructor() {
        this.games = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupSearch();
        this.setupGameCards();
        this.loadGamesData();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                this.currentFilter = e.target.dataset.filter;
                this.filterGames();
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('gameSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterGames();
            });
        }
    }

    setupGameCards() {
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                if (window.animationController) {
                    window.animationController.addHoverEffect(card, 'lift');
                }
            });

            // Add click tracking
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.game-actions')) {
                    const gameTitle = card.querySelector('.game-title').textContent;
                    this.trackGameView(gameTitle);
                }
            });
        });
    }

    filterGames() {
        const gameCards = document.querySelectorAll('.game-card');
        let visibleCount = 0;

        gameCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('.game-title').textContent.toLowerCase();
            const description = card.querySelector('.game-description').textContent.toLowerCase();
            
            const matchesFilter = this.currentFilter === 'all' || category === this.currentFilter;
            const matchesSearch = this.searchQuery === '' || 
                                title.includes(this.searchQuery) || 
                                description.includes(this.searchQuery);

            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                card.classList.add('fade-in-up');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in-up');
            }
        });

        // Show no results message if needed
        this.showNoResultsMessage(visibleCount === 0);
    }

    showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No games found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            document.getElementById('gamesGrid').appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    loadGamesData() {
        // In a real implementation, this would fetch from an API
        this.games = [
            {
                id: 'snake',
                title: 'Snake Game',
                category: 'arcade',
                rating: 4.9,
                plays: 2100,
                tech: ['JavaScript', 'Canvas', 'CSS3']
            },
            {
                id: 'tictactoe',
                title: 'Tic Tac Toe AI',
                category: 'strategy',
                rating: 4.7,
                plays: 1800,
                tech: ['React', 'AI Algorithm', 'CSS Grid']
            },
            {
                id: 'memory',
                title: 'Memory Match',
                category: 'puzzle',
                rating: 4.6,
                plays: 1500,
                tech: ['Vue.js', 'CSS Animations', 'Local Storage']
            },
            {
                id: 'calculator',
                title: 'Scientific Calculator',
                category: 'educational',
                rating: 4.8,
                plays: 3200,
                tech: ['JavaScript', 'Math.js', 'Responsive']
            },
            {
                id: 'quiz',
                title: 'Programming Quiz',
                category: 'educational',
                rating: 4.5,
                plays: 2800,
                tech: ['React', 'JSON API', 'Progress Tracking']
            }
        ];
    }

    trackGameView(gameTitle) {
        // Track game views for analytics
        const views = JSON.parse(localStorage.getItem('bandhannova_game_views') || '{}');
        views[gameTitle] = (views[gameTitle] || 0) + 1;
        localStorage.setItem('bandhannova_game_views', JSON.stringify(views));
    }

    trackGamePlay(gameId) {
        // Track game plays
        const plays = JSON.parse(localStorage.getItem('bandhannova_game_plays') || '{}');
        plays[gameId] = (plays[gameId] || 0) + 1;
        localStorage.setItem('bandhannova_game_plays', JSON.stringify(plays));
        
        // Award points for playing games
        if (window.BandhanNova) {
            window.BandhanNova.progress.totalPoints = (window.BandhanNova.progress.totalPoints || 0) + 10;
            showNotification('+10 points for playing a game!', 'success');
        }
    }
}

// Game Functions
function playGame(gameId) {
    const hub = window.entertainmentHub;
    if (hub) {
        hub.trackGamePlay(gameId);
    }

    const gameModal = document.getElementById('gameModal');
    const gameModalTitle = document.getElementById('gameModalTitle');
    const gameContainer = document.getElementById('gameContainer');

    // Set game title
    const gameData = {
        snake: { title: 'Snake Game', content: createSnakeGame() },
        tictactoe: { title: 'Tic Tac Toe AI', content: createTicTacToeGame() },
        memory: { title: 'Memory Match', content: createMemoryGame() },
        calculator: { title: 'Scientific Calculator', content: createCalculator() },
        quiz: { title: 'Programming Quiz', content: createQuizGame() }
    };

    const game = gameData[gameId];
    if (game) {
        gameModalTitle.textContent = game.title;
        gameContainer.innerHTML = game.content;
        gameModal.style.display = 'flex';
        
        // Initialize game-specific logic
        if (window[`init${gameId.charAt(0).toUpperCase() + gameId.slice(1)}Game`]) {
            window[`init${gameId.charAt(0).toUpperCase() + gameId.slice(1)}Game`]();
        }
    }
}

function viewCode(gameId) {
    // Open code view modal or redirect to GitHub
    showNotification('Code viewing feature coming soon!', 'info');
    
    // In a real implementation, this would show the actual source code
    const codeUrls = {
        snake: 'https://github.com/bandhannova/snake-game',
        tictactoe: 'https://github.com/bandhannova/tictactoe-ai',
        memory: 'https://github.com/bandhannova/memory-game',
        calculator: 'https://github.com/bandhannova/calculator',
        quiz: 'https://github.com/bandhannova/quiz-app'
    };
    
    // For now, just show a notification
    setTimeout(() => {
        showNotification(`Code for ${gameId} will be available on GitHub soon!`, 'info');
    }, 1000);
}

function closeGameModal() {
    const gameModal = document.getElementById('gameModal');
    const gameContainer = document.getElementById('gameContainer');
    
    gameModal.style.display = 'none';
    gameContainer.innerHTML = '';
}

// Simple Game Implementations
function createSnakeGame() {
    return `
        <div class="snake-game">
            <div class="game-header">
                <div class="score">Score: <span id="snakeScore">0</span></div>
                <div class="high-score">High Score: <span id="snakeHighScore">0</span></div>
            </div>
            <canvas id="snakeCanvas" width="400" height="400"></canvas>
            <div class="game-controls">
                <button class="btn btn-primary" onclick="startSnakeGame()">Start Game</button>
                <button class="btn btn-secondary" onclick="pauseSnakeGame()">Pause</button>
            </div>
            <div class="game-instructions">
                <p>Use arrow keys or WASD to control the snake. Eat food to grow and increase your score!</p>
            </div>
        </div>
    `;
}

function createTicTacToeGame() {
    return `
        <div class="tictactoe-game">
            <div class="game-header">
                <div class="players">
                    <div class="player active" id="playerX">Player X</div>
                    <div class="player" id="playerO">AI (O)</div>
                </div>
            </div>
            <div class="tictactoe-board" id="tictactoeBoard">
                ${Array(9).fill(0).map((_, i) => `<div class="cell" data-index="${i}" onclick="makeMove(${i})"></div>`).join('')}
            </div>
            <div class="game-controls">
                <button class="btn btn-primary" onclick="resetTicTacToe()">New Game</button>
                <div class="difficulty">
                    <label>Difficulty:</label>
                    <select id="aiDifficulty">
                        <option value="easy">Easy</option>
                        <option value="medium" selected>Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>
        </div>
    `;
}

function createMemoryGame() {
    return `
        <div class="memory-game">
            <div class="game-header">
                <div class="stats">
                    <div class="stat">Moves: <span id="memoryMoves">0</span></div>
                    <div class="stat">Time: <span id="memoryTime">00:00</span></div>
                    <div class="stat">Pairs: <span id="memoryPairs">0/8</span></div>
                </div>
            </div>
            <div class="memory-board" id="memoryBoard">
                <!-- Cards will be generated by JavaScript -->
            </div>
            <div class="game-controls">
                <button class="btn btn-primary" onclick="startMemoryGame()">New Game</button>
                <select id="memoryDifficulty">
                    <option value="easy">Easy (4x2)</option>
                    <option value="medium" selected>Medium (4x4)</option>
                    <option value="hard">Hard (6x4)</option>
                </select>
            </div>
        </div>
    `;
}

function createCalculator() {
    return `
        <div class="calculator">
            <div class="calculator-display">
                <div class="display-history" id="calcHistory"></div>
                <div class="display-current" id="calcDisplay">0</div>
            </div>
            <div class="calculator-buttons">
                <button class="btn calc-btn clear" onclick="clearCalculator()">C</button>
                <button class="btn calc-btn clear" onclick="clearEntry()">CE</button>
                <button class="btn calc-btn operator" onclick="inputOperator('/')">/</button>
                <button class="btn calc-btn operator" onclick="inputOperator('*')">×</button>
                
                <button class="btn calc-btn number" onclick="inputNumber('7')">7</button>
                <button class="btn calc-btn number" onclick="inputNumber('8')">8</button>
                <button class="btn calc-btn number" onclick="inputNumber('9')">9</button>
                <button class="btn calc-btn operator" onclick="inputOperator('-')">-</button>
                
                <button class="btn calc-btn number" onclick="inputNumber('4')">4</button>
                <button class="btn calc-btn number" onclick="inputNumber('5')">5</button>
                <button class="btn calc-btn number" onclick="inputNumber('6')">6</button>
                <button class="btn calc-btn operator" onclick="inputOperator('+')">+</button>
                
                <button class="btn calc-btn number" onclick="inputNumber('1')">1</button>
                <button class="btn calc-btn number" onclick="inputNumber('2')">2</button>
                <button class="btn calc-btn number" onclick="inputNumber('3')">3</button>
                <button class="btn calc-btn equals" onclick="calculate()" rowspan="2">=</button>
                
                <button class="btn calc-btn number zero" onclick="inputNumber('0')">0</button>
                <button class="btn calc-btn number" onclick="inputNumber('.')">.</button>
            </div>
        </div>
    `;
}

function createQuizGame() {
    return `
        <div class="quiz-game">
            <div class="quiz-header">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="quizProgress" style="width: 0%"></div>
                    </div>
                    <span id="quizQuestionCount">Question 1 of 10</span>
                </div>
                <div class="quiz-score">Score: <span id="quizScore">0</span></div>
            </div>
            
            <div class="quiz-question-container">
                <h3 id="quizQuestion">Loading question...</h3>
                <div class="quiz-options" id="quizOptions">
                    <!-- Options will be loaded here -->
                </div>
            </div>
            
            <div class="quiz-controls">
                <button class="btn btn-secondary" onclick="previousQuestion()" id="prevBtn" disabled>Previous</button>
                <button class="btn btn-primary" onclick="nextQuestion()" id="nextBtn" disabled>Next</button>
            </div>
        </div>
    `;
}

// Initialize Entertainment Hub
document.addEventListener('DOMContentLoaded', () => {
    window.entertainmentHub = new EntertainmentHub();
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const gameModal = document.getElementById('gameModal');
    if (e.target === gameModal) {
        closeGameModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeGameModal();
    }
});
