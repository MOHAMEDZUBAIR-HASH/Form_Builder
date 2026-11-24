import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formService } from '../services/formService';
import Button from '../components/common/Button';
import useDebounce from '../hooks/useDebounce';
import { ArrowRight, Search, FileText, CheckCircle2, Link2, X } from 'lucide-react';

const UserPortalPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // ⚡ Debounce the search input by 400ms to avoid firing on every keystroke
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    loadPublishedForms();
  }, [debouncedSearch]);

  const loadPublishedForms = async () => {
    try {
      setLoading(true);
      // Calls API with debouncedSearch query
      const res = await formService.getForms({
        status: 'published',
        limit: 50,
        search: debouncedSearch.trim() || undefined,
      });
      setForms(res.data.data || []);
    } catch (err) {
      console.error('Failed to load published forms', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">


      {/* Optimized Debounced Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search available forms by name, slug, or keywords (live debounced)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-10 py-3 bg-white rounded-2xl border border-gray-200 shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3.5 top-3.5 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Forms Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Available Forms ({forms.length})
          </h2>
          {debouncedSearch && (
            <span className="text-xs text-gray-500">
              Filtered by: <strong className="text-indigo-600 font-semibold">"{debouncedSearch}"</strong>
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-sm font-medium">Fetching forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 shadow-xs">
            <p className="text-base font-bold text-gray-800">
              {debouncedSearch ? `No forms found matching "${debouncedSearch}"` : 'No active forms available'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {debouncedSearch
                ? 'Try searching with a different keyword or clear the search.'
                : 'Check back later or contact an administrator to publish forms.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => {
              const formSlugOrId = form.slug || form._id;
              return (
                <div
                  key={form._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all p-6 flex flex-col justify-between"
                >
                  <div>


                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {form.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {form.description || 'Fill out the requested details.'}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-end">
                    <Link to={`/forms/${formSlugOrId}`}>
                      <Button variant="primary" size="sm" icon={ArrowRight}>
                        Fill Form
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPortalPage;
