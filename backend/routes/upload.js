const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const { avatar, projectFiles, newsImage, multiple } = require('../middleware/upload');

/**
 * @route   POST /api/uploads/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post('/avatar', auth, avatar, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename || req.file.public_id,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading avatar'
    });
  }
});

/**
 * @route   POST /api/uploads/project-files
 * @desc    Upload project files
 * @access  Private
 */
router.post('/project-files', auth, projectFiles, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename || file.public_id,
      originalName: file.originalname,
      size: file.size
    }));

    res.json({
      success: true,
      message: 'Project files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading project files:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading project files'
    });
  }
});

/**
 * @route   POST /api/uploads/news-image
 * @desc    Upload news article image
 * @access  Private (Admin/Editor)
 */
router.post('/news-image', auth, newsImage, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }

    res.json({
      success: true,
      message: 'News image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename || req.file.public_id,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading news image:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading news image'
    });
  }
});

/**
 * @route   POST /api/uploads/multiple
 * @desc    Upload multiple files
 * @access  Private
 */
router.post('/multiple', auth, multiple('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename || file.public_id,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading files'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Maximum is 5 files.'
    });
  }
  
  if (error.message === 'Invalid file type. Only images, PDFs, and documents are allowed.') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Upload error occurred'
  });
});

module.exports = router;
