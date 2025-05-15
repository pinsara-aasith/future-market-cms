import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ComplaintForm } from '../../components/complaints/ComplaintForm';
import { Button } from '../../components/ui/Button';

export const NewComplaintPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => window.history.back()}
            icon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-neutral-800">New Complaint</h1>
        </div>
        <p className="text-neutral-500">
          Fill in the form below to submit a new complaint
        </p>
      </div>
      
      <ComplaintForm />
    </DashboardLayout>
  );
};