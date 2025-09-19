// General Youth Hub Interactive Features

class GeneralYouthHub {
    constructor() {
        this.skillDetails = {
            budgeting: this.getBudgetingContent(),
            investing: this.getInvestingContent(),
            credit: this.getCreditContent(),
            listening: this.getListeningContent(),
            speaking: this.getSpeakingContent(),
            conflict: this.getConflictContent(),
            priorities: this.getPrioritiesContent(),
            planning: this.getPlanningContent(),
            procrastination: this.getProcrastinationContent(),
            'self-awareness': this.getSelfAwarenessContent(),
            empathy: this.getEmpathyContent(),
            stress: this.getStressContent()
        };
        this.init();
    }

    init() {
        this.setupTabSwitching();
        this.setupAnimations();
        this.trackProgress();
    }

    setupTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const panels = document.querySelectorAll('.category-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active tab
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active panel
                panels.forEach(p => p.classList.remove('active'));
                document.getElementById(category).classList.add('active');
            });
        });
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.skill-card, .career-card, .wellness-card').forEach(card => {
            observer.observe(card);
        });
    }

    trackProgress() {
        const skillButtons = document.querySelectorAll('.skill-card .btn');
        skillButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.logSkillInteraction(btn.closest('.skill-card').querySelector('h3').textContent);
            });
        });
    }

    logSkillInteraction(skillName) {
        const interactions = JSON.parse(localStorage.getItem('bandhannova_youth_interactions') || '[]');
        interactions.push({
            skill: skillName,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('bandhannova_youth_interactions', JSON.stringify(interactions));
    }

    getBudgetingContent() {
        return `
            <div class="skill-detail">
                <h3>Budgeting Basics</h3>
                <p>Master the fundamentals of personal budgeting to take control of your finances.</p>
                
                <div class="content-section">
                    <h4>The 50/30/20 Rule</h4>
                    <div class="budget-breakdown">
                        <div class="budget-item">
                            <div class="percentage">50%</div>
                            <div class="category">Needs</div>
                            <div class="description">Rent, utilities, groceries, minimum debt payments</div>
                        </div>
                        <div class="budget-item">
                            <div class="percentage">30%</div>
                            <div class="category">Wants</div>
                            <div class="description">Entertainment, dining out, hobbies, subscriptions</div>
                        </div>
                        <div class="budget-item">
                            <div class="percentage">20%</div>
                            <div class="category">Savings</div>
                            <div class="description">Emergency fund, retirement, debt payoff</div>
                        </div>
                    </div>
                </div>
                
                <div class="content-section">
                    <h4>Getting Started</h4>
                    <ol>
                        <li>Track your income and expenses for one month</li>
                        <li>Categorize your spending</li>
                        <li>Set realistic budget limits</li>
                        <li>Use budgeting apps or spreadsheets</li>
                        <li>Review and adjust monthly</li>
                    </ol>
                </div>
            </div>
        `;
    }

    getInvestingContent() {
        return `
            <div class="skill-detail">
                <h3>Investment Fundamentals</h3>
                <p>Learn the basics of investing to build long-term wealth.</p>
                
                <div class="content-section">
                    <h4>Key Concepts</h4>
                    <ul>
                        <li><strong>Compound Interest:</strong> Earning returns on your returns</li>
                        <li><strong>Diversification:</strong> Don't put all eggs in one basket</li>
                        <li><strong>Risk vs Return:</strong> Higher potential returns come with higher risk</li>
                        <li><strong>Time Horizon:</strong> Longer investment periods reduce risk</li>
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>Investment Options</h4>
                    <div class="investment-types">
                        <div class="investment-type">
                            <h5>Index Funds</h5>
                            <p>Low-cost, diversified, good for beginners</p>
                        </div>
                        <div class="investment-type">
                            <h5>ETFs</h5>
                            <p>Exchange-traded funds, flexible and liquid</p>
                        </div>
                        <div class="investment-type">
                            <h5>Individual Stocks</h5>
                            <p>Higher risk/reward, requires research</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCreditContent() {
        return `
            <div class="skill-detail">
                <h3>Credit & Debt Management</h3>
                <p>Build good credit and manage debt responsibly.</p>
                
                <div class="content-section">
                    <h4>Credit Score Factors</h4>
                    <ul>
                        <li><strong>Payment History (35%):</strong> Pay all bills on time</li>
                        <li><strong>Credit Utilization (30%):</strong> Keep balances low</li>
                        <li><strong>Length of History (15%):</strong> Keep old accounts open</li>
                        <li><strong>Credit Mix (10%):</strong> Different types of credit</li>
                        <li><strong>New Credit (10%):</strong> Don't open too many accounts</li>
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>Debt Payoff Strategies</h4>
                    <div class="strategy-comparison">
                        <div class="strategy">
                            <h5>Debt Snowball</h5>
                            <p>Pay minimums on all debts, extra on smallest balance</p>
                            <p><strong>Pro:</strong> Quick wins, motivation</p>
                        </div>
                        <div class="strategy">
                            <h5>Debt Avalanche</h5>
                            <p>Pay minimums on all debts, extra on highest interest</p>
                            <p><strong>Pro:</strong> Saves more money long-term</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getListeningContent() {
        return `
            <div class="skill-detail">
                <h3>Active Listening</h3>
                <p>Develop the ability to truly hear and understand others.</p>
                
                <div class="content-section">
                    <h4>Active Listening Techniques</h4>
                    <ul>
                        <li><strong>Give Full Attention:</strong> Put away distractions</li>
                        <li><strong>Show You're Listening:</strong> Nod, maintain eye contact</li>
                        <li><strong>Provide Feedback:</strong> "What I hear you saying is..."</li>
                        <li><strong>Defer Judgment:</strong> Don't interrupt or argue</li>
                        <li><strong>Respond Appropriately:</strong> Ask clarifying questions</li>
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>Common Barriers</h4>
                    <ul>
                        <li>Thinking about your response while they're talking</li>
                        <li>Making assumptions about what they mean</li>
                        <li>Getting distracted by emotions</li>
                        <li>Multitasking during conversations</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getSpeakingContent() {
        return `
            <div class="skill-detail">
                <h3>Public Speaking</h3>
                <p>Overcome fear and deliver confident presentations.</p>
                
                <div class="content-section">
                    <h4>Preparation Steps</h4>
                    <ol>
                        <li><strong>Know Your Audience:</strong> Tailor content to their interests</li>
                        <li><strong>Structure Your Message:</strong> Clear beginning, middle, end</li>
                        <li><strong>Practice Out Loud:</strong> Rehearse multiple times</li>
                        <li><strong>Prepare for Questions:</strong> Anticipate what might be asked</li>
                        <li><strong>Have a Backup Plan:</strong> Technical difficulties happen</li>
                    </ol>
                </div>
                
                <div class="content-section">
                    <h4>Managing Nerves</h4>
                    <ul>
                        <li>Practice deep breathing exercises</li>
                        <li>Visualize successful presentation</li>
                        <li>Start with friendly faces in audience</li>
                        <li>Remember: audience wants you to succeed</li>
                        <li>Focus on your message, not your fear</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getConflictContent() {
        return `
            <div class="skill-detail">
                <h3>Conflict Resolution</h3>
                <p>Navigate disagreements and find win-win solutions.</p>
                
                <div class="content-section">
                    <h4>The PEACE Process</h4>
                    <ul>
                        <li><strong>P - Pause:</strong> Take time to cool down</li>
                        <li><strong>E - Empathize:</strong> Try to understand their perspective</li>
                        <li><strong>A - Ask:</strong> Clarify the real issues</li>
                        <li><strong>C - Collaborate:</strong> Work together on solutions</li>
                        <li><strong>E - Evaluate:</strong> Check if the solution works</li>
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>De-escalation Techniques</h4>
                    <ul>
                        <li>Lower your voice and speak slowly</li>
                        <li>Acknowledge their feelings</li>
                        <li>Find common ground</li>
                        <li>Focus on the issue, not the person</li>
                        <li>Take breaks if emotions run high</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getPrioritiesContent() {
        return `
            <div class="skill-detail">
                <h3>Priority Setting</h3>
                <p>Learn to identify and focus on what matters most.</p>
                
                <div class="content-section">
                    <h4>The Eisenhower Matrix</h4>
                    <div class="matrix">
                        <div class="matrix-quadrant urgent-important">
                            <h5>Urgent & Important</h5>
                            <p>Do First - Crises, emergencies</p>
                        </div>
                        <div class="matrix-quadrant important-not-urgent">
                            <h5>Important, Not Urgent</h5>
                            <p>Schedule - Planning, prevention</p>
                        </div>
                        <div class="matrix-quadrant urgent-not-important">
                            <h5>Urgent, Not Important</h5>
                            <p>Delegate - Interruptions, some calls</p>
                        </div>
                        <div class="matrix-quadrant not-urgent-not-important">
                            <h5>Not Urgent, Not Important</h5>
                            <p>Eliminate - Time wasters, some social media</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPlanningContent() {
        return `
            <div class="skill-detail">
                <h3>Planning & Scheduling</h3>
                <p>Create effective schedules and stick to them.</p>
                
                <div class="content-section">
                    <h4>Time Blocking Method</h4>
                    <ol>
                        <li>List all your tasks and commitments</li>
                        <li>Estimate how long each will take</li>
                        <li>Block out time in your calendar</li>
                        <li>Include buffer time between tasks</li>
                        <li>Protect your blocks like appointments</li>
                    </ol>
                </div>
                
                <div class="content-section">
                    <h4>Planning Tips</h4>
                    <ul>
                        <li>Plan your week on Sunday</li>
                        <li>Review and adjust daily</li>
                        <li>Build in flexibility for unexpected tasks</li>
                        <li>Batch similar activities together</li>
                        <li>Schedule your most important work during peak energy</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getProcrastinationContent() {
        return `
            <div class="skill-detail">
                <h3>Avoiding Procrastination</h3>
                <p>Overcome procrastination and build momentum.</p>
                
                <div class="content-section">
                    <h4>The Pomodoro Technique</h4>
                    <ol>
                        <li>Choose a task to work on</li>
                        <li>Set timer for 25 minutes</li>
                        <li>Work on task until timer rings</li>
                        <li>Take a 5-minute break</li>
                        <li>Repeat 3 more times, then take longer break</li>
                    </ol>
                </div>
                
                <div class="content-section">
                    <h4>Common Causes & Solutions</h4>
                    <ul>
                        <li><strong>Overwhelm:</strong> Break tasks into smaller steps</li>
                        <li><strong>Perfectionism:</strong> Aim for "good enough" first draft</li>
                        <li><strong>Lack of motivation:</strong> Connect task to bigger goals</li>
                        <li><strong>Distractions:</strong> Remove or minimize them</li>
                        <li><strong>Fear of failure:</strong> Focus on learning, not perfection</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getSelfAwarenessContent() {
        return `
            <div class="skill-detail">
                <h3>Self-Awareness</h3>
                <p>Understand your emotions, triggers, and patterns.</p>
                
                <div class="content-section">
                    <h4>Building Self-Awareness</h4>
                    <ul>
                        <li><strong>Mindfulness Practice:</strong> Regular meditation or reflection</li>
                        <li><strong>Journaling:</strong> Write about your thoughts and feelings</li>
                        <li><strong>Feedback:</strong> Ask others for honest input</li>
                        <li><strong>Values Clarification:</strong> Identify what's truly important</li>
                        <li><strong>Personality Assessments:</strong> Tools like Myers-Briggs, Big Five</li>
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>Self-Reflection Questions</h4>
                    <ul>
                        <li>What situations trigger strong emotions in me?</li>
                        <li>What are my core values and beliefs?</li>
                        <li>What patterns do I notice in my behavior?</li>
                        <li>How do others perceive me?</li>
                        <li>What are my strengths and growth areas?</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getEmpathyContent() {
        return `
            <div class="skill-detail">
                <h3>Empathy & Social Skills</h3>
                <p>Build stronger relationships through understanding.</p>
                
                <div class="content-section">
                    <h4>Developing Empathy</h4>
                    <ul>
                        <li><strong>Active Listening:</strong> Really hear what others are saying</li>
                        <li><strong>Perspective Taking:</strong> Try to see from their viewpoint</li>
                        <li><strong>Emotional Recognition:</strong> Notice others' emotional cues</li>
                        <li><strong>Suspend Judgment:</strong> Don't immediately evaluate or criticize</li>
                        <li><strong>Ask Questions:</strong> Show genuine interest in their experience</li>
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>Building Rapport</h4>
                    <ul>
                        <li>Find common interests or experiences</li>
                        <li>Mirror their communication style subtly</li>
                        <li>Show genuine interest in their life</li>
                        <li>Remember details they've shared</li>
                        <li>Be authentic and vulnerable when appropriate</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getStressContent() {
        return `
            <div class="skill-detail">
                <h3>Stress Management</h3>
                <p>Develop healthy coping strategies for life's challenges.</p>
                
                <div class="content-section">
                    <h4>Stress Management Techniques</h4>
                    <ul>
                        <li><strong>Deep Breathing:</strong> 4-7-8 breathing technique</li>
                        <li><strong>Progressive Muscle Relaxation:</strong> Tense and release muscle groups</li>
                        <li><strong>Mindfulness:</strong> Focus on present moment</li>
                        <li><strong>Exercise:</strong> Physical activity reduces stress hormones</li>
                        <li><strong>Time Management:</strong> Better planning reduces overwhelm</li>
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>Building Resilience</h4>
                    <ul>
                        <li>Develop a strong support network</li>
                        <li>Practice gratitude daily</li>
                        <li>Learn from setbacks and failures</li>
                        <li>Maintain perspective on problems</li>
                        <li>Take care of your physical health</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// Global functions
function openSkillDetail(skillId) {
    const hub = window.generalYouthHub;
    if (!hub || !hub.skillDetails[skillId]) return;

    const modal = document.getElementById('skillModal');
    const title = document.getElementById('skillModalTitle');
    const content = document.getElementById('skillContent');

    title.textContent = hub.skillDetails[skillId].match(/<h3>(.*?)<\/h3>/)[1];
    content.innerHTML = hub.skillDetails[skillId];
    modal.style.display = 'flex';
}

function closeSkillModal() {
    document.getElementById('skillModal').style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.generalYouthHub = new GeneralYouthHub();
});

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('skillModal');
    if (e.target === modal) {
        closeSkillModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSkillModal();
    }
});
