import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './redux/slices/authSlice';
import Navbar from './components/Navbar';
import UserPortalPage from './pages/UserPortalPage';
import FormListPage from './pages/FormListPage';
import FormBuilderPage from './pages/FormBuilderPage';
import PublicFormPage from './pages/PublicFormPage';
import SubmissionsPage from './pages/SubmissionsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user has an active HttpOnly cookie session
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* 1. PUBLIC VISITOR ROUTES - Zero Login Required */}
          {/* Home / Domain root: Shows all published forms for any visitor */}
          <Route path="/" element={<UserPortalPage />} />
          
          {/* Public user direct form filling route */}
          <Route path="/forms/:formId" element={<PublicFormPage />} />

          {/* 2. ADMIN AUTH ROUTE */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />

          {/* 3. PROTECTED ADMIN ROUTES - Require Admin JWT Cookie */}
          <Route
            path="/admin/forms"
            element={
              <ProtectedRoute>
                <FormListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forms/new"
            element={
              <ProtectedRoute>
                <FormBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forms/:id/edit"
            element={
              <ProtectedRoute>
                <FormBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forms/:formId/submissions"
            element={
              <ProtectedRoute>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Public Portal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
