// Copy Protection System for BandhanNova
class CopyProtection {
    constructor() {
        this.init();
    }

    init() {
        this.disableTextSelection();
        this.disableRightClick();
        this.disableKeyboardShortcuts();
        this.disableDeveloperTools();
        this.addCopyProtectionClasses();
    }

    disableTextSelection() {
        // Add CSS classes to prevent text selection
        document.body.classList.add('copy-protected');
        
        // Disable text selection events
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });

        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
    }

    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showProtectionMessage('Right-click is disabled to protect content');
            return false;
        });
    }

    disableKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Disable common copy shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.keyCode) {
                    case 65: // Ctrl+A (Select All)
                    case 67: // Ctrl+C (Copy)
                    case 86: // Ctrl+V (Paste)
                    case 88: // Ctrl+X (Cut)
                    case 83: // Ctrl+S (Save)
                    case 85: // Ctrl+U (View Source)
                        e.preventDefault();
                        this.showProtectionMessage('Keyboard shortcuts are disabled to protect content');
                        return false;
                }
            }

            // Disable F12 (Developer Tools)
            if (e.keyCode === 123) {
                e.preventDefault();
                this.showProtectionMessage('Developer tools access is restricted');
                return false;
            }

            // Disable Ctrl+Shift+I (Developer Tools)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                this.showProtectionMessage('Developer tools access is restricted');
                return false;
            }

            // Disable Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                this.showProtectionMessage('Console access is restricted');
                return false;
            }

            // Disable Ctrl+Shift+C (Element Inspector)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                this.showProtectionMessage('Element inspector is restricted');
                return false;
            }
        });
    }

    disableDeveloperTools() {
        // Detect if developer tools are open
        let devtools = {
            open: false,
            orientation: null
        };

        const threshold = 160;

        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.handleDevToolsOpen();
                }
            } else {
                devtools.open = false;
            }
        }, 500);

        // Disable console methods
        if (typeof console !== 'undefined') {
            console.log = () => {};
            console.warn = () => {};
            console.error = () => {};
            console.info = () => {};
            console.debug = () => {};
            console.clear = () => {};
        }
    }

    handleDevToolsOpen() {
        // Blur the page content
        document.body.style.filter = 'blur(5px)';
        
        // Show warning message
        this.showDevToolsWarning();
        
        // Optional: Redirect after a delay
        setTimeout(() => {
            if (confirm('Developer tools detected. This page will reload to protect content.')) {
                window.location.reload();
            }
        }, 3000);
    }

    showDevToolsWarning() {
        const warning = document.createElement('div');
        warning.id = 'devtools-warning';
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            text-align: center;
        `;
        
        warning.innerHTML = `
            <div style="padding: 40px; max-width: 500px;">
                <h2 style="color: #EF4444; margin-bottom: 20px;">⚠️ Content Protection Active</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    Developer tools have been detected. This content is protected by BandhanNova's 
                    copy protection system to preserve intellectual property.
                </p>
                <p style="margin-bottom: 30px; opacity: 0.8;">
                    Please close developer tools to continue learning.
                </p>
                <button onclick="window.location.reload()" style="
                    background: #1E3A8A;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                ">Reload Page</button>
            </div>
        `;
        
        document.body.appendChild(warning);
    }

    addCopyProtectionClasses() {
        // Add copy protection to specific content areas
        const protectedSelectors = [
            '.lesson-content',
            '.code-example',
            '.quiz-question',
            '.course-material',
            '.chapter-content',
            '.learning-content'
        ];

        protectedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('copy-protected');
            });
        });
    }

    showProtectionMessage(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #EF4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Method to temporarily disable protection for legitimate use
    temporaryDisable(duration = 30000) {
        const originalSelectStart = document.onselectstart;
        const originalContextMenu = document.oncontextmenu;
        
        document.onselectstart = null;
        document.oncontextmenu = null;
        document.body.classList.remove('copy-protected');
        
        setTimeout(() => {
            document.onselectstart = originalSelectStart;
            document.oncontextmenu = originalContextMenu;
            document.body.classList.add('copy-protected');
        }, duration);
        
        this.showProtectionMessage('Copy protection temporarily disabled for 30 seconds');
    }

    // Method to check if content is being copied programmatically
    detectProgrammaticCopy() {
        let copyAttempts = 0;
        const maxAttempts = 3;
        
        document.addEventListener('copy', (e) => {
            copyAttempts++;
            
            if (copyAttempts > maxAttempts) {
                e.preventDefault();
                this.showProtectionMessage('Multiple copy attempts detected - content protection active');
                
                // Reset counter after delay
                setTimeout(() => {
                    copyAttempts = 0;
                }, 60000);
            }
        });
    }

    // Watermark text content
    addWatermark() {
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48px;
            color: rgba(30, 58, 138, 0.1);
            pointer-events: none;
            z-index: 1000;
            font-weight: bold;
            user-select: none;
        `;
        watermark.textContent = 'BandhanNova';
        document.body.appendChild(watermark);
    }
}

// Initialize copy protection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.copyProtection = new CopyProtection();
    
    // Add watermark to learning pages
    if (window.location.pathname.includes('/pages/')) {
        window.copyProtection.addWatermark();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CopyProtection;
}
