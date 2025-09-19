// Dark Mind Hub Interactive Features

class DarkMindHub {
    constructor() {
        this.topics = {
            persuasion: {
                title: 'Persuasion Techniques',
                content: this.getPersuasionContent()
            },
            manipulation: {
                title: 'Manipulation Awareness',
                content: this.getManipulationContent()
            },
            'body-language': {
                title: 'Body Language Mastery',
                content: this.getBodyLanguageContent()
            },
            negotiation: {
                title: 'Advanced Negotiation',
                content: this.getNegotiationContent()
            }
        };
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupScrollEffects();
        this.trackUserEngagement();
    }

    setupAnimations() {
        // Animate rule cards on scroll
        const ruleCards = document.querySelectorAll('.rule-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in-up');
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });

        ruleCards.forEach(card => observer.observe(card));
    }

    setupScrollEffects() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-background');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    trackUserEngagement() {
        // Track which topics users are most interested in
        const psychologyCards = document.querySelectorAll('.psychology-card');
        psychologyCards.forEach(card => {
            card.addEventListener('click', () => {
                const topic = card.dataset.topic;
                this.logEngagement('topic_interest', topic);
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) {
                    this.logEngagement('scroll_depth', maxScroll);
                }
            }
        });
    }

    logEngagement(type, data) {
        const engagement = JSON.parse(localStorage.getItem('bandhannova_dark_mind_engagement') || '[]');
        engagement.push({
            type,
            data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('bandhannova_dark_mind_engagement', JSON.stringify(engagement));
    }

    getPersuasionContent() {
        return `
            <div class="topic-content-detailed">
                <h3>The 6 Principles of Influence</h3>
                <p>Based on Robert Cialdini's groundbreaking research, these principles govern human decision-making:</p>
                
                <div class="principle-list">
                    <div class="principle-item">
                        <h4><i class="fas fa-gift"></i> 1. Reciprocity</h4>
                        <p>People feel obligated to return favors. When you give something first, others feel compelled to reciprocate.</p>
                        <div class="example-box">
                            <strong>Application:</strong> Offer valuable insights or help before asking for something in return.
                        </div>
                    </div>
                    
                    <div class="principle-item">
                        <h4><i class="fas fa-crown"></i> 2. Authority</h4>
                        <p>People defer to experts and authority figures. Establish your credibility and expertise.</p>
                        <div class="example-box">
                            <strong>Application:</strong> Display credentials, testimonials, and demonstrate deep knowledge.
                        </div>
                    </div>
                    
                    <div class="principle-item">
                        <h4><i class="fas fa-users"></i> 3. Social Proof</h4>
                        <p>People follow the crowd. Show that others are already doing what you want them to do.</p>
                        <div class="example-box">
                            <strong>Application:</strong> Use testimonials, case studies, and popularity indicators.
                        </div>
                    </div>
                    
                    <div class="principle-item">
                        <h4><i class="fas fa-heart"></i> 4. Liking</h4>
                        <p>People say yes to those they like. Build rapport and find common ground.</p>
                        <div class="example-box">
                            <strong>Application:</strong> Mirror body language, find shared interests, give genuine compliments.
                        </div>
                    </div>
                    
                    <div class="principle-item">
                        <h4><i class="fas fa-handshake"></i> 5. Commitment & Consistency</h4>
                        <p>People want to be consistent with their previous commitments and statements.</p>
                        <div class="example-box">
                            <strong>Application:</strong> Get small commitments first, then build to larger ones.
                        </div>
                    </div>
                    
                    <div class="principle-item">
                        <h4><i class="fas fa-clock"></i> 6. Scarcity</h4>
                        <p>People value things more when they're rare or limited in availability.</p>
                        <div class="example-box">
                            <strong>Application:</strong> Highlight limited time offers or exclusive opportunities.
                        </div>
                    </div>
                </div>
                
                <div class="warning-box">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p><strong>Ethical Note:</strong> These techniques should be used to create win-win situations, not to manipulate or harm others.</p>
                </div>
            </div>
        `;
    }

    getManipulationContent() {
        return `
            <div class="topic-content-detailed">
                <h3>Recognizing Manipulation Tactics</h3>
                <p>Understanding these tactics helps you defend against them and avoid using them unethically:</p>
                
                <div class="tactic-list">
                    <div class="tactic-item">
                        <h4><i class="fas fa-fire"></i> Gaslighting</h4>
                        <p>Making someone question their own reality, memory, or perceptions.</p>
                        <div class="warning-signs">
                            <strong>Warning Signs:</strong>
                            <ul>
                                <li>Constantly questioning your memory</li>
                                <li>Denying things they clearly said or did</li>
                                <li>Making you feel "crazy" or oversensitive</li>
                            </ul>
                        </div>
                        <div class="defense-strategy">
                            <strong>Defense:</strong> Keep records, trust your instincts, seek outside perspective.
                        </div>
                    </div>
                    
                    <div class="tactic-item">
                        <h4><i class="fas fa-heart-broken"></i> Love Bombing</h4>
                        <p>Overwhelming someone with excessive attention and affection to gain control.</p>
                        <div class="warning-signs">
                            <strong>Warning Signs:</strong>
                            <ul>
                                <li>Excessive gifts and attention early in relationship</li>
                                <li>Pushing for quick commitment</li>
                                <li>Making you feel "special" and "chosen"</li>
                            </ul>
                        </div>
                        <div class="defense-strategy">
                            <strong>Defense:</strong> Take relationships slow, maintain independence, trust your gut.
                        </div>
                    </div>
                    
                    <div class="tactic-item">
                        <h4><i class="fas fa-shapes"></i> Triangulation</h4>
                        <p>Bringing a third party into a conflict to manipulate the situation.</p>
                        <div class="warning-signs">
                            <strong>Warning Signs:</strong>
                            <ul>
                                <li>Comparing you to others constantly</li>
                                <li>Using others to validate their position</li>
                                <li>Creating competition between people</li>
                            </ul>
                        </div>
                        <div class="defense-strategy">
                            <strong>Defense:</strong> Address issues directly, don't engage in comparisons, set boundaries.
                        </div>
                    </div>
                </div>
                
                <div class="protection-tips">
                    <h4>General Protection Strategies</h4>
                    <ul>
                        <li>Trust your instincts and emotional responses</li>
                        <li>Maintain your support network and outside perspectives</li>
                        <li>Set and enforce clear boundaries</li>
                        <li>Don't make important decisions when emotionally charged</li>
                        <li>Keep records of important conversations</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getBodyLanguageContent() {
        return `
            <div class="topic-content-detailed">
                <h3>Reading and Projecting Body Language</h3>
                <p>Master non-verbal communication to understand others and project confidence:</p>
                
                <div class="body-language-sections">
                    <div class="bl-section">
                        <h4><i class="fas fa-eye"></i> Facial Expressions & Eye Contact</h4>
                        <div class="bl-grid">
                            <div class="bl-item">
                                <strong>Genuine Smile:</strong> Engages both mouth and eyes (crow's feet)
                            </div>
                            <div class="bl-item">
                                <strong>Micro-expressions:</strong> Brief, involuntary facial expressions revealing true emotions
                            </div>
                            <div class="bl-item">
                                <strong>Eye Contact:</strong> 60-70% during conversation shows confidence and interest
                            </div>
                            <div class="bl-item">
                                <strong>Pupil Dilation:</strong> Indicates interest, excitement, or cognitive load
                            </div>
                        </div>
                    </div>
                    
                    <div class="bl-section">
                        <h4><i class="fas fa-hand-paper"></i> Gestures & Posture</h4>
                        <div class="bl-grid">
                            <div class="bl-item">
                                <strong>Open Posture:</strong> Uncrossed arms, facing toward person shows openness
                            </div>
                            <div class="bl-item">
                                <strong>Mirroring:</strong> Subtly copying others' posture builds rapport
                            </div>
                            <div class="bl-item">
                                <strong>Power Poses:</strong> Expansive postures increase confidence hormones
                            </div>
                            <div class="bl-item">
                                <strong>Hand Gestures:</strong> Palm-up gestures appear more trustworthy
                            </div>
                        </div>
                    </div>
                    
                    <div class="bl-section">
                        <h4><i class="fas fa-walking"></i> Movement & Space</h4>
                        <div class="bl-grid">
                            <div class="bl-item">
                                <strong>Personal Space:</strong> Respecting boundaries shows social awareness
                            </div>
                            <div class="bl-item">
                                <strong>Walking Pace:</strong> Confident people walk with purpose and steady rhythm
                            </div>
                            <div class="bl-item">
                                <strong>Sitting Position:</strong> Upright posture conveys alertness and respect
                            </div>
                            <div class="bl-item">
                                <strong>Fidgeting:</strong> Excessive movement can signal nervousness or deception
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="confidence-tips">
                    <h4>Projecting Confidence Through Body Language</h4>
                    <ol>
                        <li><strong>Stand Tall:</strong> Keep shoulders back, spine straight</li>
                        <li><strong>Make Eye Contact:</strong> Look people in the eye when speaking</li>
                        <li><strong>Use Purposeful Gestures:</strong> Avoid fidgeting, use deliberate hand movements</li>
                        <li><strong>Control Your Voice:</strong> Speak slowly and clearly, avoid uptalk</li>
                        <li><strong>Take Up Space:</strong> Don't shrink into yourself, claim your space</li>
                    </ol>
                </div>
            </div>
        `;
    }

    getNegotiationContent() {
        return `
            <div class="topic-content-detailed">
                <h3>Advanced Negotiation Strategies</h3>
                <p>Master the psychological aspects of negotiation for better outcomes:</p>
                
                <div class="negotiation-phases">
                    <div class="phase">
                        <h4><i class="fas fa-search"></i> Phase 1: Preparation</h4>
                        <ul>
                            <li><strong>Research:</strong> Know the other party's needs, constraints, and alternatives</li>
                            <li><strong>Set Objectives:</strong> Define your ideal, acceptable, and walk-away points</li>
                            <li><strong>Anticipate Objections:</strong> Prepare responses to likely concerns</li>
                            <li><strong>Choose Environment:</strong> Neutral territory often works best</li>
                        </ul>
                    </div>
                    
                    <div class="phase">
                        <h4><i class="fas fa-handshake"></i> Phase 2: Opening</h4>
                        <ul>
                            <li><strong>Build Rapport:</strong> Start with small talk and find common ground</li>
                            <li><strong>Set Agenda:</strong> Agree on what will be discussed and in what order</li>
                            <li><strong>Establish Rules:</strong> How decisions will be made, time limits, etc.</li>
                            <li><strong>Listen First:</strong> Let them present their position before revealing yours</li>
                        </ul>
                    </div>
                    
                    <div class="phase">
                        <h4><i class="fas fa-balance-scale"></i> Phase 3: Bargaining</h4>
                        <ul>
                            <li><strong>Anchoring:</strong> First offer sets the reference point for negotiation</li>
                            <li><strong>Concession Strategy:</strong> Make smaller concessions as you progress</li>
                            <li><strong>Package Deals:</strong> Bundle items to create more value</li>
                            <li><strong>Time Pressure:</strong> Use deadlines strategically, but don't rush</li>
                        </ul>
                    </div>
                    
                    <div class="phase">
                        <h4><i class="fas fa-check"></i> Phase 4: Closing</h4>
                        <ul>
                            <li><strong>Summarize Agreement:</strong> Confirm all points clearly</li>
                            <li><strong>Address Implementation:</strong> Who does what, when, and how</li>
                            <li><strong>Document Terms:</strong> Put agreements in writing</li>
                            <li><strong>Plan Follow-up:</strong> Schedule check-ins if needed</li>
                        </ul>
                    </div>
                </div>
                
                <div class="psychological-tactics">
                    <h4>Key Psychological Tactics</h4>
                    <div class="tactic-grid">
                        <div class="tactic">
                            <strong>Mirroring:</strong> Subtly copy their body language and speech patterns
                        </div>
                        <div class="tactic">
                            <strong>Silence:</strong> Use pauses to create pressure and encourage responses
                        </div>
                        <div class="tactic">
                            <strong>Reframing:</strong> Present the same information from a different perspective
                        </div>
                        <div class="tactic">
                            <strong>Emotional Labeling:</strong> Acknowledge their emotions to build trust
                        </div>
                    </div>
                </div>
                
                <div class="win-win-approach">
                    <h4>Creating Win-Win Outcomes</h4>
                    <p>The best negotiations create value for both parties:</p>
                    <ul>
                        <li>Focus on interests, not positions</li>
                        <li>Look for creative solutions that benefit both sides</li>
                        <li>Separate the people from the problem</li>
                        <li>Use objective criteria for decisions</li>
                        <li>Build long-term relationships, not just short-term wins</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// Global functions for HTML onclick handlers
function openTopic(topicId) {
    const hub = window.darkMindHub;
    if (!hub || !hub.topics[topicId]) return;

    const modal = document.getElementById('topicModal');
    const title = document.getElementById('topicModalTitle');
    const content = document.getElementById('topicContent');

    title.textContent = hub.topics[topicId].title;
    content.innerHTML = hub.topics[topicId].content;
    modal.style.display = 'flex';

    // Track topic opening
    hub.logEngagement('topic_opened', topicId);
}

function closeTopicModal() {
    const modal = document.getElementById('topicModal');
    modal.style.display = 'none';
}

// Initialize Dark Mind Hub
document.addEventListener('DOMContentLoaded', () => {
    window.darkMindHub = new DarkMindHub();
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('topicModal');
    if (e.target === modal) {
        closeTopicModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTopicModal();
    }
});
