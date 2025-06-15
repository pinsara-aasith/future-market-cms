import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Plus, FileText, Filter, Trash } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ComplaintCard } from '../../components/complaints/ComplaintCard';
import { useAuth } from '../../context/AuthContext';
import { getUserComplaints, getBranchComplaints, getAllComplaints } from '../../services/complaintService';
import { getAllBranches } from '../../services/branchService';
import { Complaint, Branch, ComplaintStatus } from '../../types';

export const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        let complaintData: Complaint[] = [];
        
        if (user) {
          if (user.role === 'admin') {
            complaintData = await getAllComplaints();
            
          } else if (user.role === 'branch_supervisor') {
            complaintData = await getBranchComplaints(user.branchCode);
          } else {
            complaintData = await getUserComplaints();
          }
        }
        setComplaints(complaintData);
        
        // Fetch branches for filters
        const branchData = await getAllBranches();
        setBranches(branchData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaints();
  }, [user]);
  
  const handleRefresh = async () => {
    try {
      setLoading(true);
      let complaintData: Complaint[] = [];
      
      if (user) {
        if (user.role === 'admin') {
          complaintData = await getAllComplaints();
        } else if (user.role === 'branch_supervisor') {
          complaintData = await getBranchComplaints(user.branchCode);
        } else {
          complaintData = await getUserComplaints();
        }
      }
      
      setComplaints(complaintData);
    } catch (error) {
      console.error('Error refreshing complaints:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || complaint.branchCode === branchFilter;
    
    return matchesSearch && matchesStatus && matchesBranch;
  });
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setBranchFilter('all');
  };
  
  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Complaints</h1>
          <p className="text-neutral-500">
            Manage and track all complaints
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => window.location.href = '/complaints/new'}
            icon={<Plus size={18} />}
          >
            New Complaint
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-neutral-700">Search and Filter</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter size={16} />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        <Input 
          placeholder="Search complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2"
          >
            <Select
              label="Status"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'rejected', label: 'Rejected' }
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'all')}
              fullWidth
            />
            
            <Select
              label="Branch"
              options={[
                { value: 'all', label: 'All Branches' },
                ...branches.map(branch => ({
                  value: branch.branchCode,
                  label: branch.branchName
                }))
              ]}
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              fullWidth
            />
            
            <div className="flex justify-end md:col-span-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="mr-2"
                icon={<Trash size={16} />}
              >
                Reset Filters
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
      
      {/* Complaints List */}
      <div>
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 mb-4 border-4 rounded-full border-neutral-300 border-t-primary-500 animate-spin"></div>
            <p className="text-neutral-500">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length > 0 ? (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard 
                key={complaint._id} 
                complaint={complaint}
                onUpdate={handleRefresh}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-lg shadow-card">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-100">
              <FileText size={32} className="text-neutral-400" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-neutral-700">No complaints found</h3>
            <p className="max-w-md mx-auto mb-6 text-neutral-500">
              {searchTerm || statusFilter !== 'all' || branchFilter !== 'all'
                ? 'No complaints match your current filters. Try adjusting your search criteria.'
                : 'There are no complaints to display. Create a new complaint to get started.'}
            </p>
            {searchTerm || statusFilter !== 'all' || branchFilter !== 'all' ? (
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = '/complaints/new'}
                icon={<Plus size={18} />}
              >
                Create Complaint
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};