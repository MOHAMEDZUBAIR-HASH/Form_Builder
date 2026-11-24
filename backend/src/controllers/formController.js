const mongoose = require('mongoose');
const Form = require('../models/Form');
const Submission = require('../models/Submission');

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * @desc    Create new dynamic form
 * @route   POST /api/forms
 * @access  Private (Admin / Manager)
 */
exports.createForm = async (req, res, next) => {
  try {
    const {
      name,
      email,
      gender,
      mobile,
      description,
      department,
      designation,
      role,
      status,
      fields,
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Form name is required.',
      });
    }

    const baseSlug = generateSlug(name) || 'form';
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await Form.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count += 1;
    }

    const formattedFields = (fields || []).map((f, index) => ({
      ...f,
      key: f.key ? f.key.trim() : `field_${index}_${Date.now()}`,
      order: f.order !== undefined ? f.order : index,
    }));

    const form = await Form.create({
      name,
      slug: uniqueSlug,
      email,
      gender,
      mobile,
      description,
      department,
      designation,
      role,
      status: status || 'draft',
      fields: formattedFields,
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: 'Form created successfully.',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all forms with search, filter, pagination
 * @route   GET /api/forms
 * @access  Public (or filtered for admin)
 */
exports.getForms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    const query = {};

    if (status && ['draft', 'published'].includes(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Form.countDocuments(query);
    const forms = await Form.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: forms.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single form by ID OR SLUG
 * @route   GET /api/forms/:identifier
 * @access  Public
 */
exports.getFormById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Search by ObjectId if valid 24-character hex string, otherwise search by slug
    let form = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      form = await Form.findById(id);
    }
    
    if (!form) {
      form = await Form.findOne({ slug: id.toLowerCase() });
    }

    if (!form) {
      return res.status(404).json({
        success: false,
        message: `Form not found with identifier: ${id}`,
      });
    }

    // Auto-backfill slug for legacy forms if missing
    if (!form.slug) {
      form.slug = generateSlug(form.name) || `form-${form._id}`;
      await form.save();
    }

    const formObj = form.toObject();
    if (formObj.fields) {
      formObj.fields.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    res.status(200).json({
      success: true,
      data: formObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update form definition
 * @route   PUT /api/forms/:id
 * @access  Private (Admin / Manager)
 */
exports.updateForm = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      email,
      gender,
      mobile,
      description,
      department,
      designation,
      role,
      status,
      fields,
    } = req.body;

    let form = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      form = await Form.findById(req.params.id);
    }
    if (!form) {
      form = await Form.findOne({ slug: req.params.id.toLowerCase() });
    }

    if (!form) {
      return res.status(404).json({
        success: false,
        message: `Form not found with id: ${req.params.id}`,
      });
    }

    const updateData = {};
    if (name !== undefined) {
      updateData.name = name;
      // Refresh slug if name changed or if custom slug provided
      const targetSlug = slug ? generateSlug(slug) : generateSlug(name);
      let uniqueSlug = targetSlug;
      let count = 1;
      while (await Form.findOne({ slug: uniqueSlug, _id: { $ne: form._id } })) {
        uniqueSlug = `${targetSlug}-${count}`;
        count += 1;
      }
      updateData.slug = uniqueSlug;
    }

    if (email !== undefined) updateData.email = email;
    if (gender !== undefined) updateData.gender = gender;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (description !== undefined) updateData.description = description;
    if (department !== undefined) updateData.department = department;
    if (designation !== undefined) updateData.designation = designation;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;

    if (fields !== undefined) {
      updateData.fields = fields.map((f, index) => ({
        ...f,
        key: f.key ? f.key.trim() : `field_${index}_${Date.now()}`,
        order: f.order !== undefined ? f.order : index,
      }));
    }

    form = await Form.findByIdAndUpdate(form._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Form updated successfully.',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete form and its submissions
 * @route   DELETE /api/forms/:id
 * @access  Private (Admin)
 */
exports.deleteForm = async (req, res, next) => {
  try {
    let form = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      form = await Form.findById(req.params.id);
    }
    if (!form) {
      form = await Form.findOne({ slug: req.params.id.toLowerCase() });
    }

    if (!form) {
      return res.status(404).json({
        success: false,
        message: `Form not found with id: ${req.params.id}`,
      });
    }

    await Form.findByIdAndDelete(form._id);
    await Submission.deleteMany({ formId: form._id });

    res.status(200).json({
      success: true,
      message: 'Form and related submissions deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
