# BandhanNova - Full Stack Tech Company Platform

## 🚀 Vision
"BandhanNova will be a world-top tech company by 2030, covering everything in tech – from freelance services to apps, games, AI tools, and global community."

## 📱 Tech Stack
- **Frontend:** React.js + TailwindCSS + Framer Motion
- **Backend:** Node.js + Express.js + MongoDB
- **Authentication:** JWT + Google OAuth
- **File Storage:** Cloudinary CDN
- **Payment:** Google Pay Integration
- **Hosting:** Netlify (Frontend) + Render (Backend)

## 🏗️ Project Structure
```
bandhannova-website/
├── frontend/          # React.js application
├── backend/           # Node.js API server
├── database/          # MongoDB schemas
└── docs/             # Documentation
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🌐 API Endpoints
- **Authentication:** `/api/auth/*`
- **Users:** `/api/users/*`
- **File Uploads:** `/api/uploads/*`
- **Freelance:** `/api/freelance/*`
- **AI Tools:** `/api/ai-tools/*`
- **Community:** `/api/community/*`
- **Tech News:** `/api/news/*`
- **Payments:** `/api/payments/*`
- **Notifications:** `/api/notifications/*`
- **Analytics:** `/api/analytics/*`

## 🔧 Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=your_mongodb_atlas_uri

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS
FRONTEND_URL=https://your-frontend-domain.netlify.app
```

## 🚀 Deployment

### Render (Backend)
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables

### Netlify (Frontend)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

## 🔔 Core Features
- **User Authentication** with JWT and Google OAuth
- **File Upload System** with Cloudinary integration
- **Freelance Project Management**
- **AI Tools Marketplace**
- **Community Posts & Interactions**
- **Tech News & Articles**
- **Payment Processing**
- **Real-time Notifications**
- **Admin Analytics Dashboard**

## 📊 Expected Scale
- **Daily Users:** 1K-10K
- **Mobile Traffic:** 80%
- **Performance:** Optimized for speed and scalability
