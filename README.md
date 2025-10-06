# BandhanNova - Professional Tech Company Website

A modern, responsive website for BandhanNova built with HTML, CSS, and vanilla JavaScript, featuring Firebase authentication and Firestore database integration.

## 🚀 Features

- **Modern Design**: Dark theme with neon accents and futuristic aesthetics
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **Firebase Integration**: Authentication (Email/Password + Google Sign-In) and Firestore database
- **Smooth Animations**: CSS animations and JavaScript interactions
- **Contact Form**: Firebase-powered contact form with real-time submission
- **SEO Optimized**: Semantic HTML and meta tags for better search visibility
- **Performance Optimized**: Lazy loading, optimized assets, and efficient code

## 📁 Project Structure

```
BanddhanNova-Main/
├── index.html              # Main homepage
├── auth.html              # Authentication page (login/signup)
├── css/
│   ├── styles.css         # Main styles and variables
│   ├── sections.css       # Section-specific styles
│   ├── forms.css          # Form styles and validation
│   ├── auth.css           # Authentication page styles
│   └── animations.css     # Animations and transitions
├── js/
│   ├── firebase-config.js # Firebase configuration and initialization
│   ├── main.js           # Main website functionality
│   └── auth.js           # Authentication logic
├── netlify.toml          # Netlify deployment configuration
├── _redirects            # URL redirects for Netlify
└── README.md             # This file
```

## 🛠️ Setup Instructions

### 1. Firebase Configuration

Before deploying, you need to set up Firebase:

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication and Firestore Database

2. **Get Firebase Configuration**:
   - In your Firebase project, go to Project Settings
   - Scroll down to "Your apps" and click "Web app"
   - Copy the configuration object

3. **Update Firebase Config**:
   - Open `js/firebase-config.js`
   - Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### 2. Firebase Authentication Setup

1. **Enable Authentication Methods**:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" and configure OAuth consent screen

2. **Firestore Database Setup**:
   - Go to Firestore Database in Firebase Console
   - Create database in production mode
   - Copy the security rules from `firestore.rules` file to Firebase Console

3. **Deploy Firestore Rules**:
   ```bash
   # If using Firebase CLI
   firebase deploy --only firestore:rules
   ```

### 3. Local Development

1. **Clone/Download the project**
2. **Open in a local server** (required for Firebase to work):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have live-server installed)
   npx live-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Open** `http://localhost:8000` in your browser

### 4. Netlify Deployment

1. **Connect Repository**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Connect your repository to Netlify

2. **Deploy Settings**:
   - Build command: `echo 'No build needed'` (or leave empty)
   - Publish directory: `.` (root directory)
   - The `netlify.toml` file will handle the rest

3. **Environment Variables** (if needed):
   - Add any sensitive configuration in Netlify's environment variables

## 🎨 Customization

### Colors and Theming

The website uses CSS custom properties for easy theming. Main colors are defined in `css/styles.css`:

```css
:root {
  --primary-color: #00f5ff;      /* Cyan blue */
  --secondary-color: #ff006e;     /* Hot pink */
  --accent-color: #7c3aed;        /* Purple */
  --bg-primary: #0a0a0a;         /* Dark background */
  /* ... more variables */
}
```

### Content Updates

1. **Company Information**: Update text content in `index.html`
2. **Services**: Modify the services section with your actual offerings
3. **Projects**: Replace placeholder projects with real ones
4. **Contact Information**: Update contact details in the contact section

### Adding Images

When you have actual images:

1. Create an `images/` or `assets/` folder
2. Add your images (logo, project screenshots, team photos)
3. Update the HTML to reference your images
4. Replace placeholder icons with actual images

## 🔧 Firebase Collections Structure

The website creates these Firestore collections:

### Users Collection (`users`)
```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  provider: "email" | "google",
  createdAt: timestamp,
  lastLoginAt: timestamp,
  emailVerified: boolean
}
```

### Contacts Collection (`contacts`)
```javascript
{
  name: "Contact Name",
  email: "contact@example.com",
  phone: "+1234567890",
  service: "ai" | "software" | "game" | "cloud" | "mobile" | "security",
  message: "Contact message",
  timestamp: timestamp,
  status: "new" | "read" | "responded"
}
```

## 🚀 Performance Features

- **Lazy Loading**: Images and content load as needed
- **Optimized Assets**: Minified CSS and optimized images
- **Caching**: Browser caching for static assets
- **Responsive Images**: Different sizes for different screen sizes
- **Preloading**: Critical resources are preloaded

## 🔒 Security Features

- **Firebase Security Rules**: Secure database access
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Content Security Policy headers
- **HTTPS**: Enforced secure connections
- **Authentication**: Secure user authentication with Firebase

## 📱 Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 88+
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔗 Links

- **Live Website**: [bandhannova.netlify.app](https://bandhannova.netlify.app)
- **GitHub Repository**: [github.com/bandhannova07/BandhanNova](https://github.com/bandhannova07/BandhanNova)
- **Firebase Project**: bandhannova-main

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Email**: hello@bandhannova.com
- **GitHub Issues**: [Create an issue](https://github.com/bandhannova07/BandhanNova/issues)
- **Documentation**: Check the comprehensive guides in this repository

## 🔄 Updates and Maintenance

Regular updates include:
- Security patches
- Performance improvements
- New features
- Bug fixes
- Browser compatibility updates

---

**Built with ❤️ by the BandhanNova Team**
