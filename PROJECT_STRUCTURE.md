# BandhanNova Project Structure

## 📁 Complete Folder Architecture

```
bandhannova-website/
├── README.md                    # Project overview and setup guide
├── .gitignore                   # Git ignore patterns
├── PROJECT_STRUCTURE.md         # This file - architecture explanation
├── DEPLOYMENT.md               # Deployment instructions
├── 
├── frontend/                   # React.js Frontend Application
│   ├── public/
│   │   ├── index.html          # Main HTML template
│   │   ├── manifest.json       # PWA manifest
│   │   ├── favicon.ico         # Site favicon
│   │   ├── logo192.png         # PWA icons
│   │   ├── logo512.png
│   │   └── robots.txt          # SEO robots file
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Shared components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── auth/           # Authentication components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── GoogleAuth.jsx
│   │   │   ├── home/           # Home page components
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   └── StatsSection.jsx
│   │   │   ├── services/       # Tech Services components
│   │   │   │   ├── AIToolsGrid.jsx
│   │   │   │   ├── WebToolsList.jsx
│   │   │   │   └── PricingCard.jsx
│   │   │   ├── products/       # Tech Products components
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   └── ProductDetails.jsx
│   │   │   ├── articles/       # Articles & Blog components
│   │   │   │   ├── ArticleCard.jsx
│   │   │   │   ├── ArticleList.jsx
│   │   │   │   └── ArticleReader.jsx
│   │   │   ├── news/           # Tech News components
│   │   │   │   ├── NewsCard.jsx
│   │   │   │   ├── NewsList.jsx
│   │   │   │   └── NewsDetail.jsx
│   │   │   ├── freelance/      # Freelance House components
│   │   │   │   ├── ProjectForm.jsx
│   │   │   │   ├── PriceCalculator.jsx
│   │   │   │   └── InquiryForm.jsx
│   │   │   ├── community/      # Community Hub components
│   │   │   │   ├── PostCard.jsx
│   │   │   │   ├── PostForm.jsx
│   │   │   │   └── CommunityFeed.jsx
│   │   │   └── settings/       # Settings components
│   │   │       ├── ThemeSelector.jsx
│   │   │       ├── LanguageSelector.jsx
│   │   │       └── UserProfile.jsx
│   │   ├── pages/              # Main page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── TechServicesPage.jsx
│   │   │   ├── TechProductsPage.jsx
│   │   │   ├── ArticlesPage.jsx
│   │   │   ├── TechNewsPage.jsx
│   │   │   ├── FreelancePage.jsx
│   │   │   ├── CommunityPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useTranslation.js
│   │   │   ├── useTheme.js
│   │   │   └── useNotification.js
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── LanguageContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── services/           # API service functions
│   │   │   ├── api.js          # Base API configuration
│   │   │   ├── authService.js  # Authentication APIs
│   │   │   ├── userService.js  # User management APIs
│   │   │   ├── contentService.js # Content management APIs
│   │   │   ├── paymentService.js # Payment integration
│   │   │   └── translationService.js # Google Translate API
│   │   ├── utils/              # Utility functions
│   │   │   ├── constants.js    # App constants
│   │   │   ├── helpers.js      # Helper functions
│   │   │   ├── validation.js   # Form validation
│   │   │   └── storage.js      # Local storage utilities
│   │   ├── styles/             # CSS and styling
│   │   │   ├── globals.css     # Global styles
│   │   │   ├── components.css  # Component-specific styles
│   │   │   └── animations.css  # Animation definitions
│   │   ├── assets/             # Static assets
│   │   │   ├── images/         # Image files
│   │   │   ├── icons/          # Icon files
│   │   │   └── fonts/          # Custom fonts
│   │   ├── App.jsx             # Main App component
│   │   ├── App.css             # App-specific styles
│   │   └── index.js            # React entry point
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # TailwindCSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── .env.example            # Environment variables template
│
├── backend/                    # Node.js Backend Application
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── contentController.js
│   │   │   ├── freelanceController.js
│   │   │   ├── communityController.js
│   │   │   ├── paymentController.js
│   │   │   └── adminController.js
│   │   ├── models/             # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── Article.js
│   │   │   ├── TechNews.js
│   │   │   ├── Product.js
│   │   │   ├── AITool.js
│   │   │   ├── FreelanceOrder.js
│   │   │   ├── CommunityPost.js
│   │   │   └── Payment.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── content.js
│   │   │   ├── freelance.js
│   │   │   ├── community.js
│   │   │   ├── payments.js
│   │   │   └── admin.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.js         # JWT authentication
│   │   │   ├── validation.js   # Request validation
│   │   │   ├── rateLimit.js    # Rate limiting
│   │   │   └── errorHandler.js # Error handling
│   │   ├── services/           # Business logic services
│   │   │   ├── authService.js
│   │   │   ├── emailService.js
│   │   │   ├── paymentService.js
│   │   │   ├── translationService.js
│   │   │   ├── notificationService.js
│   │   │   └── fileUploadService.js
│   │   ├── config/             # Configuration files
│   │   │   ├── database.js     # MongoDB connection
│   │   │   ├── jwt.js          # JWT configuration
│   │   │   ├── aws.js          # AWS S3 configuration
│   │   │   └── googleAuth.js   # Google OAuth setup
│   │   ├── utils/              # Utility functions
│   │   │   ├── logger.js       # Logging utility
│   │   │   ├── validators.js   # Data validation
│   │   │   └── helpers.js      # Helper functions
│   │   └── app.js              # Express app setup
│   ├── server.js               # Server entry point
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment variables template
│
├── database/                   # Database related files
│   ├── schemas/                # MongoDB schemas
│   │   ├── user-schema.js
│   │   ├── content-schema.js
│   │   ├── freelance-schema.js
│   │   └── community-schema.js
│   ├── seeders/                # Database seeders
│   │   ├── users.js
│   │   ├── products.js
│   │   └── articles.js
│   └── migrations/             # Database migrations
│       └── initial-setup.js
│
├── docs/                       # Documentation
│   ├── API.md                  # API documentation
│   ├── SETUP.md               # Setup instructions
│   ├── FEATURES.md            # Feature specifications
│   └── DEPLOYMENT.md          # Deployment guide
│
└── scripts/                    # Build and deployment scripts
    ├── build.sh               # Build script
    ├── deploy.sh              # Deployment script
    └── setup.sh               # Initial setup script
```

## 📋 Folder Purpose Explanation

### **Frontend (`/frontend`)**
- **React.js application** with modern component architecture
- **TailwindCSS** for responsive, mobile-first styling
- **Component-based structure** for reusability and maintainability
- **Context API** for state management (auth, theme, language)
- **Custom hooks** for business logic separation
- **Service layer** for API communication

### **Backend (`/backend`)**
- **Node.js + Express.js** RESTful API server
- **MVC architecture** (Models, Views, Controllers)
- **MongoDB integration** with Mongoose ODM
- **JWT authentication** with Google OAuth support
- **Middleware layer** for security and validation
- **Service layer** for business logic

### **Database (`/database`)**
- **MongoDB schemas** and data models
- **Seeders** for initial data population
- **Migration scripts** for database updates

### **Documentation (`/docs`)**
- **Comprehensive guides** for setup and deployment
- **API documentation** for developers
- **Feature specifications** for reference

### **Scripts (`/scripts`)**
- **Automated build** and deployment processes
- **Setup scripts** for quick project initialization

## 🚀 Next Steps
1. Initialize frontend React application
2. Setup backend Express server
3. Configure MongoDB database
4. Implement authentication system
5. Build core pages and components
6. Add multilingual support
7. Integrate payment and notification systems
