import React from 'react';
import {
  Type,
  Mail,
  Hash,
  Phone,
  AlignLeft,
  Calendar,
  ListFilter,
  CheckSquare,
  CircleDot,
  UploadCloud,
  Plus,
  Sparkles,
} from 'lucide-react';

const FIELD_TYPES = [
  { type: 'text', label: 'Single Line Text', icon: Type, description: 'Short names, titles, inputs' },
  { type: 'email', label: 'Email Address', icon: Mail, description: 'Validated email field' },
  { type: 'number', label: 'Number / Age', icon: Hash, description: 'Numeric quantities or values' },
  { type: 'phone', label: 'Phone Number', icon: Phone, description: 'Formatted mobile phone' },
  { type: 'textarea', label: 'Long Text Area', icon: AlignLeft, description: 'Multi-line descriptions' },
  { type: 'date', label: 'Date Picker', icon: Calendar, description: 'Birthdays, appointments' },
  { type: 'select', label: 'Dropdown Menu', icon: ListFilter, description: 'Single choice dropdown' },
  { type: 'radio', label: 'Radio Choices', icon: CircleDot, description: 'One-choice radio list' },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, description: 'Multi-select options' },
  { type: 'file', label: 'Upload File / Image', icon: UploadCloud, description: 'Resume, photos, documents' },
];

const AddFieldMenu = ({ onAddField }) => {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Add Dynamic Fields</h3>
          <p className="text-[11px] text-gray-400">Click to add to form builder</p>
        </div>
        <Sparkles className="w-4 h-4 text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {FIELD_TYPES.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.type}
              type="button"
              onClick={() => onAddField(f.type)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/40 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white text-gray-600 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800 group-hover:text-indigo-900">
                    {f.label}
                  </div>
                  <div className="text-[11px] text-gray-400 group-hover:text-gray-600">
                    {f.description}
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-md bg-gray-100 group-hover:bg-indigo-100 text-gray-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AddFieldMenu;
