import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { LayoutDashboard, PlusCircle, FormInput, LogOut, ShieldCheck, Globe } from 'lucide-react';
import Button from './common/Button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/admin/login');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <FormInput className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                  DynamicForms
                </span>
                <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Public & Admin Portal
                </span>
              </div>
            </Link>

            {/* Navigation links for Public vs Admin */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-indigo-600 bg-indigo-50 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  Public Forms Directory
                </div>
              </Link>

              {user && (
                <>
                  <Link
                    to="/admin/forms"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/admin/forms'
                        ? 'text-indigo-600 bg-indigo-50 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </div>
                  </Link>

                  <Link
                    to="/admin/forms/new"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/admin/forms/new'
                        ? 'text-indigo-600 bg-indigo-50 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4" />
                      Create Form
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {user.name} ({user.role})
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/admin/login">
                <Button variant="secondary" size="sm" icon={ShieldCheck}>
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
