const express = require('express');
const router = express.Router();
const {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
} = require('../controllers/formController');
const {
  submitForm,
  getSubmissions,
} = require('../controllers/submissionController');
const { protect } = require('../middlewares/auth');

// Form CRUD
router.route('/')
  .post(protect, createForm)
  .get(getForms);

router.route('/:id')
  .get(getFormById)
  .put(protect, updateForm)
  .delete(protect, deleteForm);

// Form Submissions
router.route('/:formId/submissions')
  .post(submitForm)
  .get(protect, getSubmissions);

module.exports = router;
