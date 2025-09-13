const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder = 'bandhannova/general';
    
    // Determine folder based on field name or route
    if (file.fieldname === 'avatar' || req.path.includes('/avatar')) {
      folder = 'bandhannova/avatars';
    } else if (file.fieldname === 'projectFiles' || req.path.includes('/project')) {
      folder = 'bandhannova/projects';
    } else if (file.fieldname === 'newsImage' || req.path.includes('/news')) {
      folder = 'bandhannova/news';
    }
    
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'txt'],
      public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
      resource_type: 'auto' // Automatically detect file type
    };
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
    'text/plain': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  }
});

// Export different upload configurations
module.exports = {
  // Single file upload
  single: (fieldName) => upload.single(fieldName),
  
  // Multiple files upload
  multiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  
  // Multiple fields upload
  fields: (fields) => upload.fields(fields),
  
  // Avatar upload (single image)
  avatar: upload.single('avatar'),
  
  // Project files upload (multiple files)
  projectFiles: upload.array('projectFiles', 5),
  
  // News image upload (single image)
  newsImage: upload.single('newsImage'),
  
  // Any files upload
  any: upload.any(),
  
  // Raw multer instance
  upload
};
