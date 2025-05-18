import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getSupervisorById, updateSupervisor } from '../../services/supervisorService';
import { BranchSupervisor, User, UserRole } from '../../types';

export const EditSupervisorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [supervisor, setSupervisor] = useState<BranchSupervisor>({
    branchCode: '',
    user: {
      fullName: '',
      email: '',
      phoneNo: '',
      role: 'BRANCH_SUPERVISOR' as UserRole
    }
  });

  useEffect(() => {
    const fetchSupervisor = async () => {
      if (!id) return;
      
      try {
        setFetchLoading(true);
        const data = await getSupervisorById(id);
        setSupervisor(data);
      } catch (error) {
        console.error('Error fetching supervisor details:', error);
        toast.error('Failed to load supervisor details. Please try again later.');
        navigate('/supervisors');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchSupervisor();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'branchCode') {
      setSupervisor(prev => ({
        ...prev,
        branchCode: value
      }));
    } else {
      setSupervisor(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value
        } as User
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!supervisor.branchCode || 
        !supervisor.user.fullName || 
        !supervisor.user.email || 
        !supervisor.user.phoneNo) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setLoading(true);
      if (!id) throw new Error('Supervisor ID is missing');
      
      await updateSupervisor(id, supervisor);
      toast.success('Supervisor updated successfully');
      navigate('/supervisors');
    } catch (error) {
      console.error('Error updating supervisor:', error);
      toast.error('Failed to update supervisor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-neutral-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-500">Loading supervisor details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/supervisors')}
          className="mr-4"
          icon={<ArrowLeft size={18} />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Edit Supervisor</h1>
          <p className="text-neutral-500">Update branch supervisor information</p>
        </div>
      </div>
      
      <Card className="w-100">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="branchCode" className="block text-sm font-medium text-neutral-700 mb-1">
                Branch Code*
              </label>
              <Input
                id="branchCode"
                name="branchCode"
                value={supervisor.branchCode}
                onChange={handleChange}
                placeholder="E.g. BR-001"
                required
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name*
              </label>
              <Input
                id="fullName"
                name="fullName"
                value={supervisor.user.fullName}
                onChange={handleChange}
                placeholder="E.g. John Doe"
                required
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email*
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={supervisor.user.email}
                onChange={handleChange}
                placeholder="E.g. john.doe@example.com"
                required
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="phoneNo" className="block text-sm font-medium text-neutral-700 mb-1">
                Phone Number*
              </label>
              <Input
                id="phoneNo"
                name="phoneNo"
                value={supervisor.user.phoneNo}
                onChange={handleChange}
                placeholder="E.g. +1 (555) 123-4567"
                required
                fullWidth
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/supervisors')}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                icon={loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <UserCircle size={18} />
                )}
              >
                {loading ? 'Updating...' : 'Update Supervisor'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};