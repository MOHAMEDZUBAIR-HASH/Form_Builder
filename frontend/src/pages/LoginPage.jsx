import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, clearAuthError } from '../redux/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ShieldCheck, Lock, ShieldAlert } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: 'admin@dynamicforms.com',
    password: 'password123',
    role: 'admin',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      const result = await dispatch(registerUser(formData));
      if (!result.error) {
        navigate('/admin/forms');
      }
    } else {
      const result = await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );
      if (!result.error) {
        navigate('/admin/forms');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-100 mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
          {isRegister ? 'Register Admin Account' : 'Admin Portal Login'}
        </h2>

      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Admin Name"
                required
              />
            )}

            <Input
              label="Admin Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@dynamicforms.com"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              disabled={status === 'loading'}
              icon={Lock}
            >
              {status === 'loading'
                ? 'Authenticating & Setting Cookie...'
                : isRegister
                  ? 'Create Admin & Sign In'
                  : 'Sign In to Admin Dashboard'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                dispatch(clearAuthError());
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
