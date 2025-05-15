import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { createComplaint, createAnonymousComplaint } from '../../services/complaintService';
import { getAllBranches } from '../../services/branchService';
import { Branch } from '../../types';

interface ComplaintFormData {
  branchCode: string;
  description: string;
  email?: string;
  phone?: string;
}

export const ComplaintForm: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(!user);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ComplaintFormData>();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchData = await getAllBranches();
        setBranches(branchData);
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast.error('Could not load branches. Please try again later.');
      }
    };
    
    fetchBranches();
  }, []);

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setIsLoading(true);
      
      if (isAnonymous) {
        await createAnonymousComplaint({
          branchCode: data.branchCode,
          description: data.description
        });
      } else {
        await createComplaint({
          branchCode: data.branchCode,
          description: data.description
        });
      }
      
      toast.success('Complaint submitted successfully!');
      reset();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">Submit a Complaint</h2>
        <p className="text-neutral-500 mt-1">
          We value your feedback. Please fill in the details below to submit your complaint.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {user && (
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="anonymous"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-neutral-700">
              Submit anonymously
            </label>
          </div>
        )}

        {isAnonymous && !user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email (Optional)"
              type="email"
              placeholder="your.email@example.com"
              fullWidth
              error={errors.email?.message}
              {...register('email', { 
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email address',
                }
              })}
            />

            <Input
              label="Phone (Optional)"
              placeholder="+1234567890"
              fullWidth
              error={errors.phone?.message}
              {...register('phone', { 
                pattern: {
                  value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: 'Please enter a valid phone number',
                }
              })}
            />
          </div>
        )}

        <Select
          label="Branch"
          options={branches.map(branch => ({ 
            value: branch.branchCode, 
            label: branch.branchName 
          }))}
          fullWidth
          error={errors.branchCode?.message}
          {...register('branchCode', { required: 'Please select a branch' })}
        />

        <TextArea
          label="Description"
          placeholder="Please describe your complaint in detail..."
          rows={6}
          fullWidth
          error={errors.description?.message}
          {...register('description', { 
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters',
            }
          })}
        />
        
        <div className="pt-2">
          <Button 
            type="submit" 
            fullWidth 
            loading={isLoading}
            icon={<Send size={18} />}
          >
            Submit Complaint
          </Button>
        </div>
      </form>
    </div>
  );
};