import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  GripVertical,
  Type,
  Mail,
  Hash,
  Phone,
  AlignLeft,
  Calendar,
  ListFilter,
  CircleDot,
  CheckSquare,
  UploadCloud,
} from 'lucide-react';

const TYPE_ICONS = {
  text: Type,
  email: Mail,
  number: Hash,
  phone: Phone,
  textarea: AlignLeft,
  date: Calendar,
  select: ListFilter,
  radio: CircleDot,
  checkbox: CheckSquare,
  file: UploadCloud,
};

const FormFieldsList = ({
  fields = [],
  selectedIndex,
  onSelectField,
  onMoveField,
  onDeleteField,
}) => {
  if (fields.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center bg-white flex flex-col items-center justify-center min-h-[420px] shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 ring-8 ring-indigo-50/50">
          <GripVertical className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-black text-gray-900">No Fields Added Yet</h4>
        <p className="text-xs text-gray-500 mt-1.5 max-w-sm leading-relaxed">
          Click any field type from the left panel to add fields to your form. You can easily reorder and customize each field.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fields.map((field, index) => {
        const isSelected = selectedIndex === index;
        const IconComponent = TYPE_ICONS[field.type] || Type;

        return (
          <div
            key={field.key || index}
            onClick={() => onSelectField(index)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white relative ${
              isSelected
                ? 'border-indigo-600 ring-4 ring-indigo-100 shadow-md'
                : 'border-gray-200/90 hover:border-indigo-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {field.label || 'Untitled Field'}
                    </span>
                    {field.required && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>
                      Type: <strong className="uppercase text-gray-700">{field.type}</strong>
                    </span>
                    &bull;
                    <span>
                      Key: <code className="text-indigo-600 font-mono">{field.key}</code>
                    </span>
                    {['select', 'radio', 'checkbox'].includes(field.type) && (
                      <>
                        &bull;
                        <span>
                          {field.options?.length || 0} options
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons: Move up/down, edit, delete */}
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  title="Move Up"
                  disabled={index === 0}
                  onClick={() => onMoveField(index, index - 1)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 disabled:opacity-20 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Move Down"
                  disabled={index === fields.length - 1}
                  onClick={() => onMoveField(index, index + 1)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 disabled:opacity-20 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Edit Field"
                  onClick={() => onSelectField(index)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Delete Field"
                  onClick={() => onDeleteField(index)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormFieldsList;
