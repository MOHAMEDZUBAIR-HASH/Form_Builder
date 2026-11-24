import React from 'react';
import Input from '../common/Input';
import { Plus, Trash2 } from 'lucide-react';

const EditFieldPanel = ({ field, index, onChange, onDelete }) => {
  if (!field) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
        Select a field from the form builder to edit its properties, or add a new field from the left panel.
      </div>
    );
  }

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onChange(index, { [name]: checked });
  };

  const handleValidationChange = (e) => {
    const { name, value } = e.target;
    onChange(index, {
      validation: {
        ...(field.validation || {}),
        [name]: value,
      },
    });
  };

  const hasOptions = ['select', 'radio', 'checkbox'].includes(field.type);
  const options = Array.isArray(field.options) ? field.options : [];

  const handleAddOption = () => {
    const newOptionNumber = options.length + 1;
    const newOption = `Option ${newOptionNumber}`;
    onChange(index, { options: [...options, newOption] });
  };

  const handleOptionChange = (optIdx, newValue) => {
    const updatedOptions = [...options];
    updatedOptions[optIdx] = newValue;
    onChange(index, { options: updatedOptions });
  };

  const handleRemoveOption = (optIdx) => {
    const updatedOptions = options.filter((_, idx) => idx !== optIdx);
    onChange(index, { options: updatedOptions });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Field Configuration</h4>
          <p className="text-xs text-gray-500">
            Type: <span className="font-semibold uppercase text-indigo-600">{field.type}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
        >
          Remove Field
        </button>
      </div>

      <div className="space-y-3">
        <Input
          label="Field Label"
          name="label"
          value={field.label}
          onChange={handleTextChange}
          placeholder="e.g. Upload Resume or Photo"
          required
        />

        <Input
          label="Field Key / Identifier"
          name="key"
          value={field.key}
          onChange={handleTextChange}
          placeholder="e.g. avatar or resume"
          required
          helperText="Identifier used in database storage"
        />

        {field.type !== 'file' && (
          <Input
            label="Placeholder Text"
            name="placeholder"
            value={field.placeholder || ''}
            onChange={handleTextChange}
            placeholder="e.g. Enter value..."
          />
        )}

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id={`required-${index}`}
            name="required"
            checked={Boolean(field.required)}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded-sm focus:ring-indigo-500 cursor-pointer"
          />
          <label
            htmlFor={`required-${index}`}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Required field (User cannot submit form without this)
          </label>
        </div>

        {/* File Specific Configuration */}
        {field.type === 'file' && (
          <div className="pt-2">
            <Input
              label="Allowed File Types (Optional)"
              name="allowedExtensions"
              value={field.validation?.allowedExtensions || ''}
              onChange={handleValidationChange}
              placeholder="e.g. image/*, .pdf, .docx, .png, .jpg"
              helperText="Comma-separated mime-types or file extensions"
            />
          </div>
        )}

        {/* Options Builder for Radio, Select, Checkbox */}
        {hasOptions && (
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                  {field.type.toUpperCase()} Options ({options.length})
                </label>
                <p className="text-[11px] text-gray-500">
                  Add, edit, or delete options
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Option
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {options.length === 0 ? (
                <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center text-xs text-gray-500">
                  Click <strong>"+ Add Option"</strong> above to add options.
                </div>
              ) : (
                options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className="flex items-center gap-2 bg-gray-50/70 p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <span className="text-[11px] font-bold text-gray-400 w-5 text-center">
                      #{optIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                      placeholder={`Option ${optIdx + 1}`}
                      className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-800 font-medium"
                    />
                    <button
                      type="button"
                      title="Delete Option"
                      onClick={() => handleRemoveOption(optIdx)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditFieldPanel;
