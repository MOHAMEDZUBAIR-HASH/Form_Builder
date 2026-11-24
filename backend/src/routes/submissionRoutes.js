const express = require('express');
const router = express.Router();
const {
  getSubmissionById,
  deleteSubmission,
} = require('../controllers/submissionController');
const { protect } = require('../middlewares/auth');

router.route('/:id')
  .get(protect, getSubmissionById)
  .delete(protect, deleteSubmission);

module.exports = router;
