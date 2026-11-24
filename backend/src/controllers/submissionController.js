const mongoose = require('mongoose');
const Form = require('../models/Form');
const Submission = require('../models/Submission');
const { validateSubmissionData } = require('../validations/dynamicValidator');

/**
 * @desc    Submit data for a dynamic form (by ID or Slug)
 * @route   POST /api/forms/:formId/submissions
 * @access  Public
 */
exports.submitForm = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const submittedData = req.body.data || req.body;

    // Resolve form by ObjectId or Slug
    let form = null;
    if (mongoose.Types.ObjectId.isValid(formId)) {
      form = await Form.findById(formId);
    }
    if (!form) {
      form = await Form.findOne({ slug: formId.toLowerCase() });
    }

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found.',
      });
    }

    if (form.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot submit to an unpublished or draft form.',
      });
    }

    // Strict Backend Validation against the Form's dynamic fields
    const { isValid, errors, cleanedData } = validateSubmissionData(
      form.fields,
      submittedData
    );

    if (!isValid) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed for one or more fields.',
        errors,
      });
    }

    // Capture metadata for audits and security
    const metadata = {
      ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'unknown',
      submittedAt: new Date(),
    };

    const submission = await Submission.create({
      formId: form._id,
      data: cleanedData,
      metadata,
    });

    // Increment submissions count atomically on form
    await Form.findByIdAndUpdate(form._id, { $inc: { submissionsCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully.',
      data: {
        _id: submission._id,
        formId: submission.formId,
        formSlug: form.slug,
        data: submission.data,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get paginated submissions for a specific form (or all forms)
 * @route   GET /api/forms/:formId/submissions
 * @access  Private (Admin)
 */
exports.getSubmissions = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Resolve form ID if slug was passed
    let resolvedFormId = formId;
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      const form = await Form.findOne({ slug: formId.toLowerCase() });
      if (form) {
        resolvedFormId = form._id;
      }
    }

    const query = { formId: resolvedFormId };

    const total = await Submission.countDocuments(query);
    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: submissions.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single submission by ID
 * @route   GET /api/submissions/:id
 * @access  Private (Admin)
 */
exports.getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('formId', 'name slug status');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: `Submission not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete single submission
 * @route   DELETE /api/submissions/:id
 * @access  Private (Admin)
 */
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: `Submission not found with id: ${req.params.id}`,
      });
    }

    await Submission.findByIdAndDelete(req.params.id);

    // Decrement form counter safely
    await Form.findByIdAndUpdate(submission.formId, {
      $inc: { submissionsCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
