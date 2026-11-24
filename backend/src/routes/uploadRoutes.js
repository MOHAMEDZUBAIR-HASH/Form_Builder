const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

/**
 * @desc    Upload any single file or image
 * @route   POST /api/upload
 * @access  Public
 */
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded.',
    });
  }

  // Returns standardized relative path "uploads/filename.ext"
  const relativePath = `uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: relativePath, // e.g. "uploads/resume-179543-123.pdf"
      url: `/${relativePath}`, // URL path accessible via static server
    },
  });
});

module.exports = router;
