#!/bin/bash

# BandhanNova Website Deployment Script
# This script helps prepare and deploy the website to Netlify

echo "🚀 BandhanNova Website Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "package.json" ]; then
    print_error "Please run this script from the BandhanNova project root directory"
    exit 1
fi

print_status "Starting deployment preparation..."

# Step 1: Check Firebase Configuration
print_status "Checking Firebase configuration..."

if grep -q "your-api-key-here" js/firebase-config.js; then
    print_error "Firebase configuration not updated!"
    print_warning "Please update js/firebase-config.js with your actual Firebase config"
    echo "See FIREBASE_SETUP.md for detailed instructions"
    exit 1
else
    print_success "Firebase configuration appears to be updated"
fi

# Step 2: Validate HTML files
print_status "Validating HTML files..."

for file in *.html; do
    if [ -f "$file" ]; then
        if grep -q "<!DOCTYPE html>" "$file"; then
            print_success "✓ $file is valid"
        else
            print_warning "⚠ $file might have issues"
        fi
    fi
done

# Step 3: Check CSS files
print_status "Checking CSS files..."

if [ -d "css" ]; then
    css_files=$(find css -name "*.css" | wc -l)
    print_success "Found $css_files CSS files"
else
    print_error "CSS directory not found!"
    exit 1
fi

# Step 4: Check JavaScript files
print_status "Checking JavaScript files..."

if [ -d "js" ]; then
    js_files=$(find js -name "*.js" | wc -l)
    print_success "Found $js_files JavaScript files"
else
    print_error "JavaScript directory not found!"
    exit 1
fi

# Step 5: Check for required files
print_status "Checking required deployment files..."

required_files=("netlify.toml" "_redirects" "favicon.ico")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_warning "⚠ $file is missing"
    fi
done

# Step 6: Check logo files
print_status "Checking logo files..."

if [ -d "images/logos" ]; then
    logo_files=$(find images/logos -name "*.svg" | wc -l)
    if [ $logo_files -gt 0 ]; then
        print_success "Found $logo_files logo files"
    else
        print_warning "No logo files found in images/logos/"
    fi
else
    print_warning "Logo directory not found"
fi

# Step 7: Minify CSS (optional)
print_status "Checking for CSS optimization..."

if command -v cssnano &> /dev/null; then
    print_status "CSS optimization available"
    read -p "Do you want to minify CSS files? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for file in css/*.css; do
            if [ -f "$file" ]; then
                cssnano "$file" "${file%.css}.min.css"
                print_success "Minified $file"
            fi
        done
    fi
else
    print_warning "CSS minification not available (install cssnano for optimization)"
fi

# Step 8: Check file sizes
print_status "Checking file sizes..."

large_files=$(find . -name "*.css" -o -name "*.js" -o -name "*.html" | xargs ls -la | awk '$5 > 100000 {print $9, $5}')

if [ -n "$large_files" ]; then
    print_warning "Large files detected (>100KB):"
    echo "$large_files"
    print_warning "Consider optimizing these files for better performance"
else
    print_success "All files are reasonably sized"
fi

# Step 9: Generate sitemap
print_status "Generating sitemap..."

cat > sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bandhannova.netlify.app/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bandhannova.netlify.app/auth.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
EOF

print_success "Sitemap generated"

# Step 10: Create robots.txt
print_status "Creating robots.txt..."

cat > robots.txt << EOF
User-agent: *
Allow: /

# Sitemap
Sitemap: https://bandhannova.netlify.app/sitemap.xml

# Disallow auth pages from search engines
Disallow: /auth.html
Disallow: /login
Disallow: /signup
EOF

print_success "robots.txt created"

# Step 11: Final deployment check
print_status "Running final deployment checks..."

# Check for console.log statements (should be removed in production)
log_statements=$(grep -r "console\.log" js/ | wc -l)
if [ $log_statements -gt 0 ]; then
    print_warning "Found $log_statements console.log statements in JavaScript files"
    print_warning "Consider removing them for production"
fi

# Check for TODO comments
todo_comments=$(grep -r "TODO\|FIXME\|HACK" . --exclude-dir=node_modules --exclude-dir=.git | wc -l)
if [ $todo_comments -gt 0 ]; then
    print_warning "Found $todo_comments TODO/FIXME comments"
fi

print_success "Deployment preparation complete!"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Update Firebase configuration if not done already"
echo "2. Test the website locally: python -m http.server 8000"
echo "3. Deploy to Netlify:"
echo "   - Option A: Connect Git repository to Netlify"
echo "   - Option B: Drag and drop files to Netlify dashboard"
echo "4. Configure custom domain (optional)"
echo "5. Set up SSL certificate (automatic on Netlify)"
echo ""

# Option to deploy via Netlify CLI
if command -v netlify &> /dev/null; then
    echo "📡 Netlify CLI detected!"
    read -p "Do you want to deploy now using Netlify CLI? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deploying to Netlify..."
        netlify deploy --prod --dir=.
        print_success "Deployment initiated!"
    fi
else
    print_warning "Netlify CLI not installed. Install with: npm install -g netlify-cli"
fi

echo ""
print_success "🎉 BandhanNova website is ready for deployment!"
echo "Visit your deployed site and test all features thoroughly."
echo ""
