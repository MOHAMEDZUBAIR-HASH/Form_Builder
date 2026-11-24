import React, { useState } from 'react';
import Input from '../common/Input';
import api from '../../services/api';
import { UploadCloud, CheckCircle2, FileText, Image, Loader2, X } from 'lucide-react';

const DynamicField = ({ field, value, onChange, error }) => {
  const { key, label, type, required, placeholder, options = [], validation = {} } = field;
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleInputChange = (e) => {
    onChange(key, e.target.value);
  };

  const handleCheckboxChange = (optValue, checked) => {
    const currentValues = Array.isArray(value) ? [...value] : [];
    if (checked) {
      if (!currentValues.includes(optValue)) {
        currentValues.push(optValue);
      }
    } else {
      const idx = currentValues.indexOf(optValue);
      if (idx !== -1) {
        currentValues.splice(idx, 1);
      }
    }
    onChange(key, currentValues);
  };

  // Handle uploading file to backend /api/upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Save relative path e.g. "uploads/myphoto-179543.png"
      const storedPath = response.data.data.path;
      onChange(key, storedPath);
    } catch (err) {
      setUploadError(err.customMessage || 'Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    onChange(key, '');
  };

  // Compute base backend URL e.g. "http://localhost:5000"
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const backendBaseUrl = apiBase.replace(/\/api\/?$/, '');

  switch (type) {
    case 'text':
    case 'email':
    case 'number':
    case 'phone':
    case 'date':
      return (
        <Input
          label={label}
          name={key}
          type={type === 'phone' ? 'tel' : type}
          value={value ?? ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          error={error}
        />
      );

    case 'textarea':
      return (
        <div className="w-full">
          {label && (
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              {label}
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          <textarea
            name={key}
            rows={4}
            value={value ?? ''}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-3.5 py-2 text-sm text-gray-900 bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        </div>
      );

    case 'select':
      return (
        <div className="w-full">
          {label && (
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              {label}
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          <select
            name={key}
            value={value ?? ''}
            onChange={handleInputChange}
            required={required}
            className={`w-full px-3.5 py-2 text-sm text-gray-900 bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          >
            <option value="">{placeholder || '-- Select an option --'}</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        </div>
      );

    case 'radio':
      return (
        <div className="w-full">
          {label && (
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              {label}
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          <div className="space-y-2 mt-1">
            {options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center gap-2.5 text-sm text-gray-800 cursor-pointer"
              >
                <input
                  type="radio"
                  name={key}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(key, opt)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        </div>
      );

    case 'checkbox':
      const currentValues = Array.isArray(value) ? value : [];
      return (
        <div className="w-full">
          {label && (
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              {label}
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          <div className="space-y-2 mt-1">
            {options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center gap-2.5 text-sm text-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={`${key}_${i}`}
                  value={opt}
                  checked={currentValues.includes(opt)}
                  onChange={(e) => handleCheckboxChange(opt, e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded-sm focus:ring-indigo-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        </div>
      );

    // Industrial File & Image Upload Field
    case 'file':
      const hasUploadedFile = Boolean(value);
      const isImage =
        hasUploadedFile &&
        (value.endsWith('.png') ||
          value.endsWith('.jpg') ||
          value.endsWith('.jpeg') ||
          value.endsWith('.webp') ||
          value.endsWith('.gif') ||
          value.endsWith('.svg'));

      const fullFileUrl = hasUploadedFile ? `${backendBaseUrl}/${value}` : '';

      return (
        <div className="w-full">
          {label && (
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              {label}
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}

          {!hasUploadedFile ? (
            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-gray-50/50 hover:bg-indigo-50/30 rounded-2xl cursor-pointer transition-all">
              <div className="flex flex-col items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-indigo-600 transition-colors" />
                )}
                <p className="text-xs font-bold text-gray-700">
                  {uploading ? 'Uploading to server...' : 'Click to upload whatever file you want'}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {validation.allowedExtensions || 'Images, Documents, PDFs, Archives up to 10MB'}
                </p>
              </div>
              <input
                type="file"
                name={key}
                accept={validation.allowedExtensions || '*'}
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          ) : (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isImage ? (
                  <img
                    src={fullFileUrl}
                    alt="Uploaded preview"
                    className="w-14 h-14 object-cover rounded-xl border border-emerald-200 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    File Uploaded Successfully
                  </div>
                  <div className="text-[11px] font-mono text-gray-600 mt-0.5 truncate max-w-xs">
                    {value}
                  </div>
                  <a
                    href={fullFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-indigo-600 hover:underline inline-block mt-0.5"
                  >
                    View file ({fullFileUrl})
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {(uploadError || error) && (
            <p className="mt-1 text-xs text-rose-600 font-medium">
              {uploadError || error}
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default DynamicField;
