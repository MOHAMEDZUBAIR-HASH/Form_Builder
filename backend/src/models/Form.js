const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Field key is required'],
      trim: true,
    },
    label: {
      type: String,
      required: [true, 'Field label is required'],
      trim: true,
      maxlength: 150,
    },
    type: {
      type: String,
      required: [true, 'Field type is required'],
      enum: [
        'text',
        'email',
        'number',
        'phone',
        'textarea',
        'date',
        'select',
        'radio',
        'checkbox',
        'file',
      ],
      lowercase: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
      trim: true,
    },
    defaultValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    options: {
      type: [String],
      default: [],
    },
    validation: {
      minLength: { type: Number, default: null },
      maxLength: { type: Number, default: null },
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      pattern: { type: String, default: null },
      allowedExtensions: { type: String, default: '' }, // e.g. "image/*, .pdf, .docx"
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Form name is required'],
      trim: true,
      maxlength: 200,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    fields: [fieldSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    submissionsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

formSchema.pre('save', async function () {
  if (this.isModified('name') || !this.slug) {
    const baseSlug = generateSlug(this.name) || 'form';
    let uniqueSlug = baseSlug;
    let count = 1;

    const FormModel = this.constructor;
    while (await FormModel.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count += 1;
    }
    this.slug = uniqueSlug;
  }
});

formSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Form', formSchema);
