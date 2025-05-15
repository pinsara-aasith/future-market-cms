import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="flex w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        {/* Left side - Form */}
        <motion.div 
          className="w-full md:w-1/2 p-8 flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoginForm />
        </motion.div>
        
        {/* Right side - Banner */}
        <motion.div 
          className="hidden md:w-1/2 md:flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-center">SuperMarket CMS</h2>
          <p className="text-center text-white text-opacity-90 mb-8">
            Your voice matters. Log in to view the status of your complaints or submit new ones.
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
              Submit and track your complaints
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
              Get real-time status updates
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
              Manage your supermarket experience
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};