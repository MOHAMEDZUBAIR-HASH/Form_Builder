import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSubmissions,
  deleteSubmission,
  fetchSubmissionById,
  clearSelectedSubmission,
} from '../redux/slices/submissionsSlice';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import {
  ArrowLeft,
  Trash2,
  Eye,
  FileSpreadsheet,
  Download,
  Lock,
  ExternalLink,
  FileText,
} from 'lucide-react';

const SubmissionsPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();

  const {
    list: submissions,
    selectedSubmission,
    pagination,
    status,
    detailStatus,
    error,
  } = useSelector((state) => state.submissions);

  const [page, setPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const backendBaseUrl = apiBase.replace(/\/api\/?$/, '');

  useEffect(() => {
    if (formId) {
      dispatch(fetchSubmissions({ formId, params: { page } }));
    }
  }, [formId, page, dispatch]);

  const handleView = async (subId) => {
    await dispatch(fetchSubmissionById(subId));
    setViewModalOpen(true);
  };

  const confirmDelete = async () => {
    if (submissionToDelete) {
      await dispatch(deleteSubmission(submissionToDelete._id));
      setDeleteModalOpen(false);
      setSubmissionToDelete(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `submissions_${formId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isUploadedFilePath = (val) => {
    return typeof val === 'string' && val.startsWith('uploads/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/forms"
            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Form Submissions</h1>

            </div>
          </div>
        </div>


      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {status === 'loading' ? (
          <div className="py-16 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-sm font-medium">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-bold text-gray-700">No submissions yet</p>
            <p className="text-xs text-gray-400 mt-1">
              User submissions will appear here automatically when respondents submit the form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/60 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Submitted Response Preview</th>
                  <th className="py-3.5 px-6">Submission Time</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {submissions.map((sub) => {
                  const dataEntries = Object.entries(sub.data || {});
                  return (
                    <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="max-w-md truncate text-xs text-gray-700 font-mono">
                          {dataEntries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(' | ')}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            title="Inspect User Submission (Read-Only)"
                            onClick={() => handleView(sub._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            type="button"
                            title="Delete Submission"
                            onClick={() => {
                              setSubmissionToDelete(sub);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <span className="text-xs text-gray-500 font-medium">
              Showing page <span className="font-bold">{pagination.page}</span> of{' '}
              <span className="font-bold">{pagination.totalPages}</span> ({pagination.totalItems} total submissions)
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Single Submission Modal (Strictly Read-Only with File Previews) */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          dispatch(clearSelectedSubmission());
        }}
        title="User Submission Details (Read-Only)"
      >
        {detailStatus === 'loading' ? (
          <div className="py-8 text-center text-gray-500">Loading details...</div>
        ) : selectedSubmission ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <Lock className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>Read-Only Audit Record:</strong> Data cannot be modified by admins to preserve authenticity.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <span className="text-gray-400 block">Submitted At:</span>
                <span className="font-medium text-gray-800">{new Date(selectedSubmission.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 block">User Agent / Device:</span>
                <span className="font-medium text-gray-800 truncate block">{selectedSubmission.metadata?.userAgent || 'Browser'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                User's Form Responses
              </h4>
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden bg-white">
                {Object.entries(selectedSubmission.data || {}).map(([key, value]) => {
                  const isFile = isUploadedFilePath(value);
                  const fullUrl = isFile ? `${backendBaseUrl}/${value}` : '';
                  const isImg =
                    isFile &&
                    (value.endsWith('.png') ||
                      value.endsWith('.jpg') ||
                      value.endsWith('.jpeg') ||
                      value.endsWith('.webp') ||
                      value.endsWith('.gif'));

                  return (
                    <div key={key} className="px-4 py-3 flex items-start justify-between text-sm">
                      <span className="font-bold text-gray-700 font-mono text-xs mt-1">{key}</span>
                      <div className="max-w-md text-right">
                        {isFile ? (
                          <div className="flex items-center gap-3 justify-end bg-gray-50 p-2 rounded-xl border border-gray-200">
                            {isImg && (
                              <img
                                src={fullUrl}
                                alt="Uploaded"
                                className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                              />
                            )}
                            <div className="text-left">
                              <span className="block text-xs font-mono font-bold text-gray-800 truncate max-w-xs">
                                {value}
                              </span>
                              <a
                                href={fullUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline mt-0.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {fullUrl}
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-900 font-semibold bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 inline-block">
                            {Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setViewModalOpen(false);
                  dispatch(clearSelectedSubmission());
                }}
              >
                Close Viewer
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Delete Single Submission Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Submission"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete submission{' '}
            <code className="font-bold text-gray-900">{submissionToDelete?._id}</code>?
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Submission
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubmissionsPage;
