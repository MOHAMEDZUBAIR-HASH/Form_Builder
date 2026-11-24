import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formService } from '../services/formService';
import DynamicField from '../components/formRenderer/DynamicField';
import Button from '../components/common/Button';
import { CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const PublicFormPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        const res = await formService.getFormById(formId);
        const data = res.data.data;
        setForm(data);

        // Prepopulate default values if configured
        const initial = {};
        (data.fields || []).forEach((field) => {
          if (field.defaultValue !== null && field.defaultValue !== undefined) {
            initial[field.key] = field.defaultValue;
          } else if (field.type === 'checkbox') {
            initial[field.key] = [];
          } else {
            initial[field.key] = '';
          }
        });
        setFormData(initial);
      } catch (err) {
        setGeneralError(err.customMessage || 'Failed to load form.');
      } finally {
        setLoading(false);
      }
    };

    if (formId) loadForm();
  }, [formId]);

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setGeneralError('');
    setFieldErrors({});

    try {
      await formService.submitForm(formId, formData);
      setSubmitted(true);
    } catch (err) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setGeneralError(err.customMessage || 'Submission failed. Please check the fields below.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
          <p className="text-sm font-semibold text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (generalError && !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Form Not Available</h2>
          <p className="text-sm text-gray-500 mt-2">{generalError}</p>
          <div className="mt-6">
            <Link to="/">
              <Button variant="secondary" icon={ArrowLeft}>
                Back to Public Forms
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Thank You!</h2>
          <p className="text-sm text-gray-600 mt-2">
            Your submission for <span className="font-bold text-gray-800">{form?.name}</span> has been received.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setFormData({});
              }}
            >
              Submit Another Response
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm">
                Return to Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden">
          {/* Header decorative stripe */}
          <div className="h-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600" />

          <div className="p-8 sm:p-10">
            {/* Header: ONLY Form Name & Description (Department, Designation, Role removed) */}
            <div className="border-b border-gray-100 pb-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {form?.name}
              </h1>
              {form?.description && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                  {form.description}
                </p>
              )}
            </div>

            {generalError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {form?.fields && form.fields.length > 0 ? (
                form.fields.map((field) => (
                  <DynamicField
                    key={field.key}
                    field={field}
                    value={formData[field.key]}
                    onChange={handleFieldChange}
                    error={fieldErrors[field.key]}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">
                  This form currently has no input fields configured.
                </p>
              )}

              <div className="pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="w-full"
                  icon={Send}
                >
                  {submitting ? 'Submitting Form...' : 'Submit Response'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-400">
          Powered by DynamicForms Engine
        </div>
      </div>
    </div>
  );
};

export default PublicFormPage;
