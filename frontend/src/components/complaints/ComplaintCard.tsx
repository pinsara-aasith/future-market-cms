import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { Complaint, ComplaintStatus } from '../../types';
import { updateComplaintStatus, addComplaintAction } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate?: () => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onUpdate }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [actionText, setActionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canManageComplaint = user && (
    user.role === 'admin' || 
    (user.role === 'branch_supervisor' && user._id === complaint.branchCode)
  );
  
  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="accent">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };
  
  const handleStatusChange = async (newStatus: ComplaintStatus) => {
    try {
      setIsSubmitting(true);
      await updateComplaintStatus(complaint._id!, newStatus);
      toast.success(`Complaint status updated to ${newStatus.replace('_', ' ')}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddAction = async () => {
    if (!actionText.trim()) return;
    
    try {
      setIsSubmitting(true);
      await addComplaintAction(complaint._id!, actionText);
      toast.success('Action added successfully');
      setActionText('');
      setIsAddingAction(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding action:', error);
      toast.error('Failed to add action. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="overflow-hidden mb-4">
      <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-sm text-neutral-500">
              {format(new Date(complaint.createdAt), 'MMM dd, yyyy - h:mm a')}
            </span>
          </div>
          <div>
            {getStatusBadge(complaint.status)}
          </div>
        </div>
        
        <div className="mb-3 line-clamp-2">
          {complaint.description}
        </div>
        
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <div className="flex items-center">
            <MessageCircle size={16} className="mr-1" />
            {complaint.actionsTaken.length} actions
          </div>
          <span className="underline">
            {isExpanded ? 'Show less' : 'Show more'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 pt-4 border-t border-neutral-200"
        >
          <p className="mb-4">{complaint.description}</p>
          
          {complaint.actionsTaken.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Actions Taken:</h4>
              <ul className="space-y-3">
                {complaint.actionsTaken.map((action, index) => (
                  <li key={index} className="bg-neutral-50 p-3 rounded-md text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-neutral-500">
                        {format(new Date(action.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-neutral-700">{action.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {canManageComplaint && (
            <div className="mt-4 space-y-4">
              {!isAddingAction ? (
                <div className="flex flex-wrap gap-2">
                  {complaint.status !== 'in_progress' && (
                    <Button 
                      size="sm" 
                      variant="accent" 
                      onClick={() => handleStatusChange('in_progress')}
                      loading={isSubmitting}
                    >
                      Mark In Progress
                    </Button>
                  )}
                  
                  {complaint.status !== 'resolved' && (
                    <Button 
                      size="sm" 
                      variant="success" 
                      onClick={() => handleStatusChange('resolved')}
                      loading={isSubmitting}
                    >
                      Mark Resolved
                    </Button>
                  )}
                  
                  {complaint.status !== 'rejected' && (
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={() => handleStatusChange('rejected')}
                      loading={isSubmitting}
                    >
                      Reject
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsAddingAction(true)}
                  >
                    Add Action
                  </Button>
                </div>
              ) : (
                <div>
                  <TextArea
                    placeholder="Describe the action taken..."
                    value={actionText}
                    onChange={(e) => setActionText(e.target.value)}
                    fullWidth
                  />
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      onClick={handleAddAction}
                      loading={isSubmitting}
                    >
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsAddingAction(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </Card>
  );
};