#!/bin/bash

# Git Setup Script for BandhanNova
echo "🚀 Setting up Git repository for BandhanNova..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the BandhanNova project root directory"
    exit 1
fi

# Initialize Git repository
print_status "Initializing Git repository..."
git init

# Add remote origin
print_status "Adding remote origin..."
git remote add origin https://github.com/bandhannova07/BandhanNova.git

# Create main branch
print_status "Creating main branch..."
git branch -M main

# Add all files
print_status "Adding files to Git..."
git add .

# Create initial commit
print_status "Creating initial commit..."
git commit -m "🎉 Initial commit: BandhanNova website

✨ Features:
- Modern responsive design with dark/neon theme
- Firebase authentication (Email/Password + Google Sign-In)
- Firestore database integration
- Professional company website sections
- Complete user management system
- SEO optimized and performance ready
- Netlify deployment configuration

🚀 Ready for production deployment!"

# Push to GitHub
print_status "Pushing to GitHub..."
git push -u origin main

print_success "🎉 Git repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Visit: https://github.com/bandhannova07/BandhanNova"
echo "2. Set up Firebase (see FIREBASE_SETUP.md)"
echo "3. Deploy to Netlify"
echo "4. Configure custom domain (optional)"
echo ""
print_success "Repository is now live on GitHub! 🚀"
