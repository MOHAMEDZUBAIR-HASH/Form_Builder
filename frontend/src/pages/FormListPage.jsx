import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchForms, deleteForm } from '../redux/slices/formsSlice';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import useDebounce from '../hooks/useDebounce';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  Search,
  Filter,
  Link2,
  X,
} from 'lucide-react';

const FormListPage = () => {
  const dispatch = useDispatch();
  const { list: forms, pagination, status, error } = useSelector((state) => state.forms);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  // ⚡ Debounce search queries by 400ms so typing fast sends only 1 optimized request
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    dispatch(fetchForms({ page, search: debouncedSearch, status: statusFilter }));
  }, [dispatch, page, debouncedSearch, statusFilter]);

  const confirmDelete = async () => {
    if (formToDelete) {
      await dispatch(deleteForm(formToDelete._id));
      setDeleteModalOpen(false);
      setFormToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Form Management Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Build, configure, publish, and search forms with clean human-readable URLs.
          </p>
        </div>
        <Link to="/admin/forms/new">
          <Button variant="primary" icon={Plus} size="lg">
            Create Dynamic Form
          </Button>
        </Link>
      </div>

      {/* Filter and Debounced Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search forms by title or slug (live debounced)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Forms Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {status === 'loading' ? (
          <div className="py-16 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-sm font-medium">Loading forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-base font-bold text-gray-700">
              {debouncedSearch ? `No forms found matching "${debouncedSearch}"` : 'No forms found'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {debouncedSearch
                ? 'Try a different search term.'
                : 'Get started by creating your first dynamic form.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/60 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Form Name</th>

                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Fields</th>
                  <th className="py-3.5 px-6">Submissions</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {forms.map((form) => {
                  const formSlugOrId = form.slug || form._id;
                  return (
                    <tr key={form._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {form.name}
                        {form.description && (
                          <div className="text-xs text-gray-400 font-normal truncate max-w-xs mt-0.5">
                            {form.description}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${form.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                        >
                          {form.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium">
                        {form.fields?.length || 0} fields
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/admin/forms/${formSlugOrId}/submissions`}
                          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          {form.submissionsCount || 0}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/forms/${formSlugOrId}/submissions`}
                            title="View Submissions (Read-Only)"
                            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/forms/${form._id}/edit`}
                            title="Edit Form"
                            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            title="Delete Form"
                            onClick={() => {
                              setFormToDelete(form);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
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
              <span className="font-bold">{pagination.totalPages}</span> ({pagination.totalItems} total)
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Form"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <span className="font-bold text-gray-900">{formToDelete?.name}</span>?
            This will also delete all associated user submissions. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Form
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FormListPage;
