import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserCircle, Plus, Edit, Trash, Phone, Building, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { getAllSupervisors, deleteSupervisor } from '../../services/supervisorService';
import { BranchSupervisor } from '../../types';

export const SupervisorsPage: React.FC = () => {
  const { user } = useAuth();
  const [supervisors, setSupervisors] = useState<BranchSupervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        setLoading(true);
        const data = await getAllSupervisors();
        setSupervisors(data);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
        toast.error('Failed to load supervisors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSupervisors();
  }, []);
  
  const handleDeleteSupervisor = async (id: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this supervisor?')) {
        await deleteSupervisor(id);
        setSupervisors(supervisors.filter(supervisor => supervisor._id !== id));
        toast.success('Supervisor deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting supervisor:', error);
      toast.error('Failed to delete supervisor. Please try again.');
    }
  };
  
  const filteredSupervisors = supervisors.filter(supervisor => {
    return (
      supervisor.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.user.phoneNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Branch Supervisors</h1>
          <p className="text-neutral-500">
            Manage all supermarket branch supervisors
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => window.location.href = '/supervisors/new'}
              icon={<Plus size={18} />}
            >
              Add Supervisor
            </Button>
          </div>
        )}
      </div>
      
      {/* Search */}
      <Card className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <Input 
            placeholder="Search supervisors by name, email, phone or branch code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            fullWidth
          />
        </div>
      </Card>
      
      {/* Supervisors List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-neutral-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-500">Loading supervisors...</p>
        </div>
      ) : filteredSupervisors.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredSupervisors.map((supervisor) => (
            <motion.div key={supervisor._id} variants={item}>
              <Card className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary-100 p-3 rounded-md">
                      <UserCircle size={20} className="text-primary-600" />
                    </div>
                    <div className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {supervisor.branchCode}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {supervisor.user.fullName}
                  </h3>
                  
                  <div className="flex items-center text-sm text-neutral-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
                      <polyline points="15,9 18,9 18,11" />
                      <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0" />
                      <line x1="6" x2="7" y1="10" y2="10" />
                    </svg>
                    <span>{supervisor.user.email}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-neutral-500 mb-2">
                    <Phone size={16} className="mr-2" />
                    <span>{supervisor.user.phoneNo}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <Building size={16} className="mr-2" />
                    <span>Branch Code: {supervisor.branchCode}</span>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 flex">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2 flex-1"
                      onClick={() => window.location.href = `/supervisors/${supervisor._id}/edit`}
                      icon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeleteSupervisor(supervisor._id!)}
                      icon={<Trash size={16} />}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-card p-12 text-center">
          <div className="w-20 h-20 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <UserCircle size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-xl font-medium text-neutral-700 mb-2">No supervisors found</h3>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            {searchTerm
              ? `No supervisors match "${searchTerm}". Try adjusting your search.`
              : 'There are no supervisors to display. Add a new supervisor to get started.'}
          </p>
          {isAdmin && (
            <Button 
              onClick={() => window.location.href = '/supervisors/new'}
              icon={<Plus size={18} />}
            >
              Add Supervisor
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};