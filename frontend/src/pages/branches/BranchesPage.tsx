import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Building, Plus, Edit, Trash, Phone, MapPin, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { getAllBranches, deleteBranch } from '../../services/branchService';
import { Branch } from '../../types';

export const BranchesPage: React.FC = () => {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const data = await getAllBranches();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast.error('Failed to load branches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBranches();
  }, []);
  
  const handleDeleteBranch = async (id: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this branch?')) {
        await deleteBranch(id);
        setBranches(branches.filter(branch => branch._id !== id));
        toast.success('Branch deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch. Please try again.');
    }
  };
  
  const filteredBranches = branches.filter(branch => {
    return (
      branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-neutral-800">Branches</h1>
          <p className="text-neutral-500">
            Manage all supermarket branches
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => window.location.href = '/branches/new'}
              icon={<Plus size={18} />}
            >
              Add Branch
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
            placeholder="Search branches by name, code or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            fullWidth
          />
        </div>
      </Card>
      
      {/* Branches List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-neutral-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-500">Loading branches...</p>
        </div>
      ) : filteredBranches.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
        {filteredBranches.map((branch) => (
            <motion.div key={branch._id} variants={item}>
              <Card className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary-100 p-3 rounded-md">
                      <Building size={20} className="text-primary-600" />
                    </div>
                    <div className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {branch.branchCode}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {branch.branchName}
                  </h3>
                  
                  <div className="flex items-center text-sm text-neutral-500 mb-2">
                    <MapPin size={16} className="mr-2" />
                    <span>{branch.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <Phone size={16} className="mr-2" />
                    <span>{branch.phoneNo}</span>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 flex">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2 flex-1"
                      onClick={() => window.location.href = `/branches/${branch._id}/edit`}
                      icon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeleteBranch(branch._id!)}
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
            <Building size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-xl font-medium text-neutral-700 mb-2">No branches found</h3>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            {searchTerm
              ? `No branches match "${searchTerm}". Try adjusting your search.`
              : 'There are no branches to display. Add a new branch to get started.'}
          </p>
          {isAdmin && (
            <Button 
              onClick={() => window.location.href = '/branches/new'}
              icon={<Plus size={18} />}
            >
              Add Branch
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};