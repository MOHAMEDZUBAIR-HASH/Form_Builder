import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFormForEdit,
  saveForm,
  resetFormBuilder,
  setFormMeta,
  addField,
  updateField,
  deleteField,
  reorderFields,
  selectField,
  clearSaveSuccess,
} from '../redux/slices/formBuilderSlice';

import AddFieldMenu from '../components/formBuilder/AddFieldMenu';
import FormFieldsList from '../components/formBuilder/FormFieldsList';
import EditFieldPanel from '../components/formBuilder/EditFieldPanel';
import Button from '../components/common/Button';
import {
  Save,
  ArrowLeft,
  Send,
  Sparkles,
  Layers,
  Settings2,
  SlidersHorizontal,
  ExternalLink,
  Eye,
} from 'lucide-react';

const FormBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentForm,
    selectedFieldIndex,
    saveStatus,
    saveSuccess,
    error,
  } = useSelector((state) => state.formBuilder);

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchFormForEdit(id));
    } else {
      dispatch(resetFormBuilder());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (saveSuccess) {
      dispatch(clearSaveSuccess());
      navigate('/admin/forms');
    }
  }, [saveSuccess, dispatch, navigate]);

  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormMeta({ [name]: value }));
  };

  const handleSave = (statusToSet = currentForm.status) => {
    if (!currentForm.name || currentForm.name.trim() === '') {
      setValidationError('Please enter a Form Title before saving.');
      return;
    }
    setValidationError('');

    const payload = {
      ...currentForm,
      status: statusToSet,
    };

    dispatch(saveForm({ formId: id, formData: payload }));
  };

  const formSlugPreview = currentForm.name
    ? currentForm.name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    : 'your-form-url';

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Application Header Bar */}
      <div className="bg-white/95 backdrop-blur-md sticky top-16 z-30 p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/forms')}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                {id ? 'Form Studio & Builder' : 'Create New Form'}
              </h1>
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentForm.status === 'published'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
              >
                {currentForm.status}
              </span>
            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {id && currentForm.status === 'published' && (
            <a
              href={`/forms/${currentForm.slug || currentForm._id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              Preview Live
            </a>
          )}
          <Button
            variant="secondary"
            onClick={() => handleSave('draft')}
            disabled={saveStatus === 'loading'}
            icon={Save}
            size="md"
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave('published')}
            disabled={saveStatus === 'loading'}
            icon={Send}
            size="md"
          >
            {saveStatus === 'loading' ? 'Publishing...' : 'Publish Form'}
          </Button>
        </div>
      </div>

      {(validationError || error) && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          {validationError || error}
        </div>
      )}

      {/* Main Studio 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Details & Field Library */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Card: Form Name & Description */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Settings2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Form Details</h3>
                <p className="text-[11px] text-gray-500">Name and intro description</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Form Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={currentForm.name}
                onChange={handleMetaChange}
                placeholder="e.g. Job Application 2026"
                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-semibold text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Form Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={currentForm.description || ''}
                onChange={handleMetaChange}
                placeholder="Write instructions for the respondents..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-700"
              />
            </div>
          </div>

          {/* Field Selection Menu */}
          <AddFieldMenu onAddField={(type) => dispatch(addField(type))} />
        </div>

        {/* Center Column: Form Builder Fields */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Form Fields ({currentForm.fields?.length || 0})
                </h3>
                <p className="text-[11px] text-gray-500">
                  Form Builder &bull; Click any field to edit properties or reorder
                </p>
              </div>
            </div>
          </div>

          <FormFieldsList
            fields={currentForm.fields}
            selectedIndex={selectedFieldIndex}
            onSelectField={(index) => dispatch(selectField(index))}
            onMoveField={(from, to) => dispatch(reorderFields({ fromIndex: from, toIndex: to }))}
            onDeleteField={(index) => dispatch(deleteField(index))}
          />
        </div>
        {/* Right Column: Active Field Inspector */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Field Properties</h3>
                <p className="text-[11px] text-gray-500">Live customization inspector</p>
              </div>
            </div>

            <EditFieldPanel
              field={
                selectedFieldIndex !== null ? currentForm.fields[selectedFieldIndex] : null
              }
              index={selectedFieldIndex}
              onChange={(idx, updatedProps) =>
                dispatch(updateField({ index: idx, field: updatedProps }))
              }
              onDelete={(idx) => dispatch(deleteField(idx))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
