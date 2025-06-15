import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Building, CheckCircle, Menu, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* <svg
              className="w-8 h-8 text-primary-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg> */}
            <img src="/design.png" alt="CustomerPulse Logo" className="w-8 h-8 mr-2" />
            <h1 className="text-xl font-bold text-primary-700">Customer Pulse</h1>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-neutral-600 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-neutral-600 hover:text-primary-600 transition-colors">
              How It Works
            </a>
            <a href="#contact" className="text-neutral-600 hover:text-primary-600 transition-colors">
              Contact
            </a>
            
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-neutral-600 hover:text-primary-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-neutral-600 hover:text-primary-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#contact" 
              className="text-neutral-600 hover:text-primary-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth>Dashboard</Button>
              </Link>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button fullWidth>Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6 leading-tight">
                Your Voice Matters <span className="text-primary-600">To Us</span>
              </h1>
              <p className="text-lg text-neutral-600 mb-8 max-w-md">
                Our complaint management system helps you submit, track, and resolve customer feedback for a better shopping experience.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/complaints/new">
                  <Button variant="outline" size="lg">Submit a Complaint</Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-2 rounded-xl shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="SuperMarket Complaint Management" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              Powerful Features for All Users
            </h2>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto">
              Our system provides tailored features for customers, branch supervisors, and administrators.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-lg shadow-card p-6 border-t-4 border-primary-500"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                Easy Complaint Submission
              </h3>
              <p className="text-neutral-600">
                Submit complaints anonymously or as a registered user with a streamlined, user-friendly form.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-card p-6 border-t-4 border-secondary-500"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                Real-time Status Updates
              </h3>
              <p className="text-neutral-600">
                Track the progress of your complaints with real-time status updates and notifications.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-card p-6 border-t-4 border-accent-500"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <Building size={24} className="text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                Branch Management
              </h3>
              <p className="text-neutral-600">
                Admins can easily manage branches, assign supervisors, and monitor complaint resolution.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-card p-6 border-t-4 border-success-500"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                Role-based Access
              </h3>
              <p className="text-neutral-600">
                Different user roles with appropriate permissions for customers, supervisors, and administrators.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-card p-6 border-t-4 border-warning-500"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                <svg 
                  className="w-6 h-6 text-warning-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                Detailed Reporting
              </h3>
              <p className="text-neutral-600">
                Generate detailed reports on complaint trends, resolution times, and customer satisfaction.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-card p-6 border-t-4 border-error-500"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center mb-4">
                <svg 
                  className="w-6 h-6 text-error-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                Secure Authentication
              </h3>
              <p className="text-neutral-600">
                Robust security with role-based authentication and data privacy protections.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto">
              Our complaint management system follows a simple process to ensure your feedback is heard and addressed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3 mt-3">
                Submit a Complaint
              </h3>
              <p className="text-neutral-600">
                Fill out our simple form with your complaint details. You can submit anonymously or create an account.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3 mt-3">
                Branch Review
              </h3>
              <p className="text-neutral-600">
                Branch supervisors review your complaint and assign it to the appropriate team member.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3 mt-3">
                Resolution Process
              </h3>
              <p className="text-neutral-600">
                We take action to resolve your complaint and document all steps taken in the process.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3 mt-3">
                Feedback & Closure
              </h3>
              <p className="text-neutral-600">
                Once resolved, you'll be notified and given the opportunity to provide feedback on the resolution.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Share Your Feedback?</h2>
          <p className="text-xl text-white text-opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of customers who are helping us improve every day. Your voice matters to us!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white !text-primary-700 hover:bg-neutral-100"
              >
                Create Account
              </Button>
            </Link>
            <Link to="/complaints/new">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:bg-opacity-10"
              >
                Submit Anonymous Complaint
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer id="contact" className="bg-neutral-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-primary-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h2 className="text-xl font-bold">SuperMarket CMS</h2>
              </div>
              <p className="text-neutral-400 mb-4">
                We value your feedback and are committed to improving your shopping experience.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-neutral-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-neutral-400 mr-2 mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  <span>123 Market Street, SuitePaloving City, NL 54321</span>
                </li>
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-neutral-400 mr-2 mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                  <span>support@supermarketcms.com</span>
                </li>
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-neutral-400 mr-2 mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                    />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect with Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.059 10.059 0 01-3.126 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Subscribe to Our Newsletter</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="px-3 py-2 bg-neutral-700 text-white placeholder-neutral-400 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                  />
                  <button className="bg-primary-600 hover:bg-primary-700 transition-colors px-4 rounded-r-md">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-neutral-700 text-center text-neutral-500 text-sm">
            <p>&copy; {new Date().getFullYear()} SuperMarket CMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};