import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Building, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getBranchById, updateBranch } from '../../services/branchService';
import { Branch } from '../../types';

export const EditBranchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log("id", id)

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [branch, setBranch] = useState<Branch>({
    branchCode: '',
    branchName: '',
    address: '',
    phoneNo: ''
  });

  useEffect(() => {
    const fetchBranch = async () => {
      if (!id) return;
      
      try {
        setFetchLoading(true);
        const data = await getBranchById(id);
        setBranch(data);
      } catch (error) {
        console.error('Error fetching branch details:', error);
        toast.error('Failed to load branch details. Please try again later.');
        navigate('/branches');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchBranch();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!branch.branchCode || !branch.branchName || !branch.address || !branch.phoneNo) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setLoading(true);
      if (!id) throw new Error('Branch ID is missing');
      
      await updateBranch(id, branch);
      toast.success('Branch updated successfully');
      navigate('/branches');
    } catch (error) {
      console.error('Error updating branch:', error);
      toast.error('Failed to update branch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-neutral-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-500">Loading branch details...</p>
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
          onClick={() => navigate('/branches')}
          className="mr-4"
          icon={<ArrowLeft size={18} />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Edit Branch</h1>
          <p className="text-neutral-500">Update branch information</p>
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
                value={branch.branchCode}
                onChange={handleChange}
                placeholder="E.g. BR-001"
                required
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="branchName" className="block text-sm font-medium text-neutral-700 mb-1">
                Branch Name*
              </label>
              <Input
                id="branchName"
                name="branchName"
                value={branch.branchName}
                onChange={handleChange}
                placeholder="E.g. Downtown Supermarket"
                required
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                Address*
              </label>
              <Input
                id="address"
                name="address"
                value={branch.address}
                onChange={handleChange}
                placeholder="Full address"
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
                value={branch.phoneNo}
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
                onClick={() => navigate('/branches')}
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
                  <Building size={18} />
                )}
              >
                {loading ? 'Updating...' : 'Update Branch'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};
