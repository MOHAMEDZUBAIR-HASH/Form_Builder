import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldCheck } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useSelector((state) => state.auth);

  // If cookie verification is still in progress on page refresh, show smooth spinner
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-3 animate-pulse">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-gray-500">Verifying secure admin session...</p>
      </div>
    );
  }

  // If verified and no active session cookie found, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
