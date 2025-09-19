// AI Chatbot and Recommendation System for BandhanNova
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userProgress = this.loadUserProgress();
        this.recommendations = [];
        this.init();
    }

    init() {
        this.createChatWidget();
        this.generateRecommendations();
        this.bindEvents();
    }

    createChatWidget() {
        // Create chat widget HTML
        const chatWidget = document.createElement('div');
        chatWidget.id = 'ai-chatbot';
        chatWidget.innerHTML = `
            <div class="chat-toggle" id="chatToggle">
                <i class="fas fa-robot"></i>
                <span class="chat-badge" id="chatBadge">AI</span>
            </div>
            
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <div class="chat-title">
                        <i class="fas fa-robot"></i>
                        <span>BandhanNova AI Assistant</span>
                    </div>
                    <button class="chat-close" id="chatClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>Hi! I'm your BandhanNova AI Assistant. I can help you with:</p>
                            <ul>
                                <li>Course recommendations</li>
                                <li>Learning path guidance</li>
                                <li>Progress tracking</li>
                                <li>Technical questions</li>
                            </ul>
                            <p>How can I assist you today?</p>
                        </div>
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <div class="quick-actions">
                        <button class="quick-action" data-action="recommend">Recommend Courses</button>
                        <button class="quick-action" data-action="progress">My Progress</button>
                        <button class="quick-action" data-action="help">Get Help</button>
                    </div>
                    <div class="chat-input-wrapper">
                        <input type="text" id="chatInput" placeholder="Type your message..." maxlength="500">
                        <button id="chatSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(chatWidget);
    }

    bindEvents() {
        const chatToggle = document.getElementById('chatToggle');
        const chatClose = document.getElementById('chatClose');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');
        const quickActions = document.querySelectorAll('.quick-action');

        chatToggle.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        quickActions.forEach(action => {
            action.addEventListener('click', () => {
                this.handleQuickAction(action.dataset.action);
            });
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatWindow');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.classList.add('open');
            document.getElementById('chatInput').focus();
        } else {
            chatWindow.classList.remove('open');
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chatWindow').classList.remove('open');
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ content, sender, timestamp: Date.now() });
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Course-related queries
        if (lowerMessage.includes('course') || lowerMessage.includes('learn')) {
            return this.getCourseRecommendation(lowerMessage);
        }
        
        // Progress queries
        if (lowerMessage.includes('progress') || lowerMessage.includes('status')) {
            return this.getProgressInfo();
        }
        
        // Help queries
        if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
            return this.getHelpResponse(lowerMessage);
        }
        
        // Certificate queries
        if (lowerMessage.includes('certificate') || lowerMessage.includes('completion')) {
            return "You can generate certificates after completing any course! Just finish all chapters and quizzes, then visit your dashboard to download your BandhanNova certificate.";
        }
        
        // General programming questions
        if (lowerMessage.includes('python') || lowerMessage.includes('javascript') || lowerMessage.includes('html') || lowerMessage.includes('css')) {
            return "I'd be happy to help with programming questions! For detailed coding help, I recommend checking out our interactive code playgrounds in each course where you can practice and get instant feedback.";
        }
        
        // Default responses
        const defaultResponses = [
            "That's an interesting question! For specific technical topics, I recommend exploring our course materials. Is there a particular subject you'd like to learn about?",
            "I'm here to help with your learning journey! You can ask me about courses, progress tracking, or general guidance. What would you like to know?",
            "Great question! While I'm still learning, I can help you navigate BandhanNova's features and recommend learning paths. What are you most interested in?",
            "I'd love to help you with that! For the most accurate information, you might also want to check our course content or contact our support team."
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    getCourseRecommendation(message) {
        const recommendations = [];
        
        if (message.includes('beginner') || message.includes('start')) {
            recommendations.push("For beginners, I recommend starting with our HTML & CSS course to learn web fundamentals, then moving to JavaScript for interactivity!");
        } else if (message.includes('mobile') || message.includes('app')) {
            recommendations.push("For mobile development, check out our Flutter course! It covers cross-platform app development with a single codebase.");
        } else if (message.includes('web') || message.includes('website')) {
            recommendations.push("For web development, try our HTML & CSS course, followed by JavaScript, and then explore our Ruby course for backend development!");
        } else if (message.includes('data') || message.includes('database')) {
            recommendations.push("For data management, our SQL course is perfect! Learn database design, queries, and data manipulation.");
        } else {
            recommendations.push("Based on your interests, I recommend exploring our Tech Learning Hub! We have courses in Python, JavaScript, HTML/CSS, Flutter, SQL, Ruby, and C++.");
        }
        
        return recommendations[0] + " Would you like me to show you the course details?";
    }

    getProgressInfo() {
        const progress = this.userProgress;
        if (!progress || Object.keys(progress).length === 0) {
            return "It looks like you haven't started any courses yet! Visit our Tech Learning Hub to begin your learning journey. All courses are free and include certificates upon completion.";
        }
        
        const completedCourses = Object.values(progress).filter(course => course.completed).length;
        const totalCourses = Object.keys(progress).length;
        
        return `You've made great progress! You've completed ${completedCourses} out of ${totalCourses} courses you've started. Keep up the excellent work! 🎉`;
    }

    getHelpResponse(message) {
        if (message.includes('navigate') || message.includes('use')) {
            return "To navigate BandhanNova: Use the main menu to access different hubs (Tech, Mind, Youth), click on any course to start learning, and track your progress in the dashboard. All features are free!";
        } else if (message.includes('certificate')) {
            return "To get certificates: Complete all chapters and quizzes in a course, then visit your dashboard to generate and download your personalized BandhanNova certificate!";
        } else {
            return "I'm here to help! You can ask me about courses, navigation, certificates, or your learning progress. For technical support, you can also contact our team through the Contact page.";
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'recommend':
                this.addMessage("What courses do you recommend for me?", 'user');
                setTimeout(() => {
                    const recommendations = this.getPersonalizedRecommendations();
                    this.addMessage(recommendations, 'bot');
                }, 800);
                break;
                
            case 'progress':
                this.addMessage("Show me my learning progress", 'user');
                setTimeout(() => {
                    const progress = this.getProgressInfo();
                    this.addMessage(progress, 'bot');
                }, 800);
                break;
                
            case 'help':
                this.addMessage("I need help getting started", 'user');
                setTimeout(() => {
                    const help = "Welcome to BandhanNova! Here's how to get started:\n\n1. 📚 Visit the Tech Learning Hub for programming courses\n2. 🧠 Explore the Mind Hub for psychology content\n3. 🚀 Check out the Youth Hub for life skills\n4. 📊 Track your progress in the Dashboard\n5. 🏆 Earn certificates as you complete courses\n\nAll content is completely free! What interests you most?";
                    this.addMessage(help, 'bot');
                }, 800);
                break;
        }
    }

    getPersonalizedRecommendations() {
        const userProgress = this.userProgress;
        const completedCourses = Object.keys(userProgress || {}).filter(course => userProgress[course]?.completed);
        
        if (completedCourses.length === 0) {
            return "Since you're just getting started, I recommend:\n\n🌟 **HTML & CSS** - Perfect for beginners to web development\n💻 **Python** - Great first programming language\n🧠 **Mind Hub** - Develop psychological insights\n\nAll courses include interactive examples and certificates!";
        }
        
        if (completedCourses.includes('html-css') && !completedCourses.includes('javascript')) {
            return "Great job completing HTML & CSS! Next, I recommend:\n\n⚡ **JavaScript** - Add interactivity to your websites\n🎯 **General Youth Hub** - Develop professional skills\n\nYou're building a solid foundation! 🚀";
        }
        
        if (completedCourses.includes('python')) {
            return "Excellent work with Python! Consider these next:\n\n🗄️ **SQL** - Learn database management\n📱 **Flutter** - Build mobile apps\n💎 **Ruby** - Explore web development with Rails\n\nYou're becoming a well-rounded developer! 💪";
        }
        
        return "Based on your progress, here are some great next steps:\n\n🔥 Continue with any incomplete courses\n🎯 Explore our Mind Hub for psychological insights\n🚀 Check out the Youth Hub for career development\n\nKeep up the amazing work! 🌟";
    }

    generateRecommendations() {
        // Generate personalized recommendations based on user behavior
        const currentPage = window.location.pathname;
        const userProgress = this.userProgress;
        
        this.recommendations = [
            {
                type: 'course',
                title: 'Continue Learning',
                description: 'Pick up where you left off',
                action: 'resume'
            },
            {
                type: 'skill',
                title: 'Skill Assessment',
                description: 'Test your knowledge',
                action: 'quiz'
            },
            {
                type: 'career',
                title: 'Career Path',
                description: 'Explore career opportunities',
                action: 'explore'
            }
        ];
    }

    loadUserProgress() {
        try {
            return JSON.parse(localStorage.getItem('userProgress')) || {};
        } catch (error) {
            return {};
        }
    }

    // Show notification for new recommendations
    showRecommendationNotification() {
        const notification = document.createElement('div');
        notification.className = 'recommendation-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-lightbulb"></i>
                <span>New course recommendations available!</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
    
    // Show welcome notification after a delay
    setTimeout(() => {
        if (!localStorage.getItem('aiWelcomeShown')) {
            window.aiAssistant.showRecommendationNotification();
            localStorage.setItem('aiWelcomeShown', 'true');
        }
    }, 3000);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
}
