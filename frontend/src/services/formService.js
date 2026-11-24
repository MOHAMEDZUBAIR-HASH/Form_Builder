import api from './api';

// Create New Form
export const createForm = (formData) => {
  return api.post('/forms', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Get List of Forms (Paginated & Filtered)
export const getForms = (params) => {
  return api.get('/forms', { params });
};

// Get Single Form by ID or Slug
export const getFormById = (identifier) => {
  return api.get(`/forms/${identifier}`);
};

// Update Form Definition
export const updateForm = (id, formData) => {
  return api.put(`/forms/${id}`, formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Delete Form (and cascade-delete submissions)
export const deleteForm = (id) => {
  return api.delete(`/forms/${id}`);
};

// Submit Dynamic Form Response (Public)
export const submitForm = (formIdentifier, data) => {
  return api.post(`/forms/${formIdentifier}/submissions`, { data }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Get Submissions for Form (Admin Paginated)
export const getSubmissions = (formIdentifier, params) => {
  return api.get(`/forms/${formIdentifier}/submissions`, { params });
};

// Get Single Submission Details (Read-Only)
export const getSubmissionById = (submissionId) => {
  return api.get(`/submissions/${submissionId}`);
};

// Delete Submission
export const deleteSubmission = (submissionId) => {
  return api.delete(`/submissions/${submissionId}`);
};

// Upload File or Image (Multipart Form-Data)
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Backward-compatible service bundle
export const formService = {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
  submitForm,
  getSubmissions,
  getSubmissionById,
  deleteSubmission,
  uploadFile,
};

export default formService;
