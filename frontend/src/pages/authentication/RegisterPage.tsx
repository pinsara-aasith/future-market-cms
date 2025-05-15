import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="flex w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        {/* Left side - Banner */}
        <motion.div 
          className="hidden md:w-1/2 md:flex flex-col items-center justify-center bg-gradient-to-br from-secondary-600 to-secondary-800 text-white p-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-12 h-12"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-center">Create Account</h2>
          <p className="text-center text-white text-opacity-90 mb-8">
            Join our community and help us improve with your valuable feedback.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              Create and manage your complaints
            </li>
            <li className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              Receive notifications about updates
            </li>
            <li className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              Link your e-card for enhanced features
            </li>
          </ul>
        </motion.div>
        
        {/* Right side - Form */}
        <motion.div 
          className="w-full md:w-1/2 p-8 flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RegisterForm />
        </motion.div>
      </div>
    </div>
  );
};