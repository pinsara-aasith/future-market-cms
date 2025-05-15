import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/landing/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('./pages/authentication/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/authentication/RegisterPage').then(module => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/customer/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ComplaintsPage = lazy(() => import('./pages/complaints/ComplaintsPage').then(module => ({ default: module.ComplaintsPage })));
const NewComplaintPage = lazy(() => import('./pages/complaints/NewComplaintPage').then(module => ({ default: module.NewComplaintPage })));
const BranchesPage = lazy(() => import('./pages/branches/BranchesPage').then(module => ({ default: module.BranchesPage })));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
      <p className="text-primary-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin route wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  return user && user.role === 'admin' ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/complaints" 
            element={
              <ProtectedRoute>
                <ComplaintsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/complaints/new" 
            element={
              <ProtectedRoute>
                <NewComplaintPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/branches" 
            element={
              <AdminRoute>
                <BranchesPage />
              </AdminRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;