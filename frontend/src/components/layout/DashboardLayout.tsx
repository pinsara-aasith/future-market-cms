import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Users, LogOut, Menu, X, 
  LayoutDashboard, UserCircle, Building, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary-100 text-primary-900 font-medium' 
          : 'text-neutral-600 hover:bg-neutral-100'
      }`
    }
    onClick={onClick}
  >
    <span className="w-5 h-5 mr-3">{icon}</span>
    {label}
  </NavLink>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  const adminLinks = user.role === 'admin' && (
    <>
      <SidebarLink 
        to="/branches" 
        icon={<Building size={18} />} 
        label="Branches" 
        onClick={closeMobileMenu}
      />
      <SidebarLink 
        to="/supervisors" 
        icon={<Users size={18} />} 
        label="Supervisors" 
        onClick={closeMobileMenu}
      />
      <SidebarLink 
        to="/customers" 
        icon={<ShoppingBag size={18} />} 
        label="Customers" 
        onClick={closeMobileMenu}
      />
    </>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between lg:hidden">
        <h1 className="text-xl font-bold text-primary-800">SuperMarket CMS</h1>
        <button onClick={toggleMobileMenu} className="text-neutral-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white shadow-sm border-r border-neutral-200 p-4">
          <div className="mb-8 px-4 py-2">
            <h1 className="text-xl font-bold text-primary-800">SuperMarket CMS</h1>
          </div>
          <nav className="flex-1 space-y-2">
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarLink to="/complaints" icon={<MessageSquare size={18} />} label="Complaints" />
            {adminLinks}
            <SidebarLink to="/profile" icon={<UserCircle size={18} />} label="Profile" />
          </nav>
          <div className="pt-6 border-t border-neutral-200 mt-6">
            <Button 
              variant="ghost" 
              fullWidth 
              className="justify-start"
              onClick={handleLogout}
              icon={<LogOut size={18} />}
            >
              Logout
            </Button>
          </div>
        </aside>
        
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                onClick={closeMobileMenu}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'tween' }}
                className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-30 p-4 lg:hidden"
              >
                <div className="flex justify-between items-center mb-8 px-4 py-2">
                  <h1 className="text-xl font-bold text-primary-800">SuperMarket CMS</h1>
                  <button onClick={closeMobileMenu} className="text-neutral-600">
                    <X size={20} />
                  </button>
                </div>
                <nav className="flex-1 space-y-2">
                  <SidebarLink 
                    to="/dashboard" 
                    icon={<LayoutDashboard size={18} />} 
                    label="Dashboard" 
                    onClick={closeMobileMenu}
                  />
                  <SidebarLink 
                    to="/complaints" 
                    icon={<MessageSquare size={18} />} 
                    label="Complaints" 
                    onClick={closeMobileMenu}
                  />
                  {adminLinks}
                  <SidebarLink 
                    to="/profile" 
                    icon={<UserCircle size={18} />} 
                    label="Profile" 
                    onClick={closeMobileMenu}
                  />
                </nav>
                <div className="pt-6 border-t border-neutral-200 mt-6">
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    className="justify-start"
                    onClick={handleLogout}
                    icon={<LogOut size={18} />}
                  >
                    Logout
                  </Button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};