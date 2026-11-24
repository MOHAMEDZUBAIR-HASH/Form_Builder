/**
 * dynamicValidator.js
 * Validates dynamic submission payloads strictly against form field definitions.
 */

const validateSubmissionData = (fields = [], submittedData = {}) => {
  const errors = {};
  const cleanedData = {};

  const input = submittedData || {};

  fields.forEach((field) => {
    const { key, label, type, required, options = [], validation = {} } = field;
    const value = input[key];

    // Check required constraint
    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);

    if (required && isEmpty) {
      errors[key] = `${label || key} is required.`;
      return;
    }

    if (isEmpty) {
      cleanedData[key] = type === 'checkbox' ? [] : null;
      return;
    }

    switch (type) {
      case 'text':
      case 'textarea': {
        if (typeof value !== 'string') {
          errors[key] = `${label || key} must be a valid text string.`;
          break;
        }
        const trimmed = value.trim();
        if (validation.minLength && trimmed.length < validation.minLength) {
          errors[key] = `${label || key} must be at least ${validation.minLength} characters.`;
        }
        if (validation.maxLength && trimmed.length > validation.maxLength) {
          errors[key] = `${label || key} cannot exceed ${validation.maxLength} characters.`;
        }
        cleanedData[key] = trimmed;
        break;
      }

      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value !== 'string' || !emailRegex.test(value.trim())) {
          errors[key] = `Please provide a valid email address for ${label || key}.`;
        } else {
          cleanedData[key] = value.trim().toLowerCase();
        }
        break;
      }

      case 'number': {
        const num = Number(value);
        if (isNaN(num)) {
          errors[key] = `${label || key} must be a valid number.`;
        } else {
          if (validation.min !== null && validation.min !== undefined && num < validation.min) {
            errors[key] = `${label || key} must be at least ${validation.min}.`;
          }
          if (validation.max !== null && validation.max !== undefined && num > validation.max) {
            errors[key] = `${label || key} must not exceed ${validation.max}.`;
          }
          cleanedData[key] = num;
        }
        break;
      }

      case 'phone': {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        const cleanedPhone = String(value).trim();
        if (!phoneRegex.test(cleanedPhone) && cleanedPhone.replace(/\D/g, '').length < 7) {
          errors[key] = `Please provide a valid phone number for ${label || key}.`;
        } else {
          cleanedData[key] = cleanedPhone;
        }
        break;
      }

      case 'date': {
        const dateVal = new Date(value);
        if (isNaN(dateVal.getTime())) {
          errors[key] = `${label || key} must be a valid date.`;
        } else {
          cleanedData[key] = value;
        }
        break;
      }

      case 'select':
      case 'radio': {
        const strVal = String(value).trim();
        if (options && options.length > 0 && !options.includes(strVal)) {
          errors[key] = `Selected value for ${label || key} is not a valid option.`;
        } else {
          cleanedData[key] = strVal;
        }
        break;
      }

      case 'checkbox': {
        let selectedArr = [];
        if (Array.isArray(value)) {
          selectedArr = value;
        } else if (typeof value === 'string') {
          selectedArr = [value];
        } else {
          errors[key] = `${label || key} must be a selection list.`;
          break;
        }

        if (options && options.length > 0) {
          const invalidItem = selectedArr.find((item) => !options.includes(item));
          if (invalidItem) {
            errors[key] = `Invalid option '${invalidItem}' selected for ${label || key}.`;
            break;
          }
        }
        cleanedData[key] = selectedArr;
        break;
      }

      // Store file path like "uploads/image.png"
      case 'file': {
        if (typeof value !== 'string' || !value.startsWith('uploads/')) {
          errors[key] = `Invalid file upload path for ${label || key}.`;
        } else {
          cleanedData[key] = value;
        }
        break;
      }

      default:
        cleanedData[key] = value;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanedData,
  };
};

module.exports = {
  validateSubmissionData,
};
