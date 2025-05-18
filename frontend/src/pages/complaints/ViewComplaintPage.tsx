import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { getComplaintById } from '../../services/complaintService';
import { Badge } from '../../components/ui/Badge';
import { format } from 'date-fns';
import { Complaint, ComplaintStatus } from '../../types';

export const ViewComplaintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        if (id) {
          const complaintData = await getComplaintById(id);
          setComplaint(complaintData);
        }
      } catch (err) {
        setError('Failed to load complaint details');
        console.error('Error fetching complaint:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="text-2xl font-bold text-neutral-800">View Complaint</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse">Loading complaint details...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">{error}</div>
      ) : complaint ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-semibold">Complaint #{complaint._id?.substring(0, 8)}</h2>
              <p className="text-sm text-gray-500">
                Created on {format(new Date(complaint.createdAt), 'PPP')}
              </p>
            </div>
            <Badge className={getStatusColor(complaint.status)}>
              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' ')}
            </Badge>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Branch Code</h3>
            <p>{complaint.branchCode}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="whitespace-pre-wrap">{complaint.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Actions Taken</h3>
            {complaint.actionsTaken && complaint.actionsTaken.length > 0 ? (
              <div className="space-y-4">
                {complaint.actionsTaken.map((action, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-1">{action.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(action.createdAt), 'PPP')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No actions have been taken yet</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
          Complaint not found
        </div>
      )}
    </DashboardLayout>
  );
};