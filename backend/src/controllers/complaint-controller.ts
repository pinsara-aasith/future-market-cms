import { Request, Response } from 'express';
import Complaint, { ComplaintStatus } from '../models/complaint-model';
import Branch from '../models/branch-model';
import BranchSupervisor from '../models/branch-supervisor-model';
import User from '../models/user-model';
import { UserRole } from '../models/user-model';
import { sendMail } from '../utils/mailer';
import fs from 'fs';
import { format } from 'date-fns';

/**
 * Create a complaint as an authenticated user
 */
export const createComplaint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, branchCode } = req.body;
    
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Verify branch exists
    const branch = await Branch.findOne({ branchCode });
    if (!branch) {
      res.status(400).json({ message: 'Branch not found' });
      return;
    }

    const complaint = new Complaint({
      description,
      branchCode,
      createdBy: req.user._id, 
      isAnonymous: false,
      status: ComplaintStatus.PENDING
    });

    await complaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: {
        id: complaint._id,
        description: complaint.description,
        branchCode: complaint.branchCode,
        status: complaint.status,
        createdAt: complaint.createdAt
      }
    });

    // Send notification email to the supervisor of the branch
    const supervisors = await BranchSupervisor.find({ branchCode: complaint.branchCode });
    console.log('Supervisors found:', supervisors);
    if (supervisors.length > 0) { 
      let htmlContent = fs.readFileSync('./src/utils/email-templates/notify-complaint-email.html', 'utf8');
      htmlContent = htmlContent
        .replace('{complaintId}', (complaint._id as any).toString())
        .replace('{customerName}', req.user.fullName || 'Anonymous Customer')
        .replace('{complaintDescription}', complaint.description)
        .replace('{complaintDate}', format(complaint.createdAt, 'PPPpp'));

      for (const supervisor of supervisors) {
        const user = await User.findById(supervisor.user);
        if (user && user.email) {
          sendMail(
            user.email,
            'New Complaint Submitted',
            htmlContent
          );
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error submitting complaint', error });
  }
};

/**
 * Create an anonymous complaint
 */
export const createAnonymousComplaint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, branchCode } = req.body;

    // Verify branch exists
    const branch = await Branch.findOne({ branchCode });
    if (!branch) {
      res.status(400).json({ message: 'Branch not found' });
      return;
    }

    const complaint = new Complaint({
      description,
      branchCode,
      createdBy: null, 
      isAnonymous: true,
      status: ComplaintStatus.PENDING
    });

    await complaint.save();

    res.status(201).json({
      message: 'Anonymous complaint submitted successfully',
      complaintId: complaint._id, // Only return ID for anonymous complaints
      status: complaint.status
    });

    // Send notification email to the supervisor of the branch
    const supervisors = await BranchSupervisor.find({ branchCode: complaint.branchCode });
    if (supervisors.length > 0) { 
      let htmlContent = fs.readFileSync('./src/utils/email-templates/notify-complaint-email.html', 'utf8');
      htmlContent = htmlContent
        .replace('{complaintId}', (complaint._id as any).toString())
        .replace('{customerName}', 'Anonymous Customer')
        .replace('{complaintDescription}', complaint.description)
        .replace('{complaintDate}', format(complaint.createdAt, 'PPPpp'));

      for (const supervisor of supervisors) {
        const user = await User.findById(supervisor.user);
        if (user && user.email) {
          sendMail(
            user.email,
            'New Complaint Submitted',
            htmlContent
          );
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error submitting anonymous complaint', error });
  }
};

/**
 * Get all complaints (admin only)
 */
export const getAllComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, branchCode } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (branchCode) filter.branchCode = branchCode;
    
    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'fullName email phoneNo')
      .sort('-createdAt');
    
    res.json({
      count: complaints.length,
      complaints
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error });
  }
};

/**
 * Get complaints for a specific branch (branch supervisor or admin)
 */
export const getBranchComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { branchCode } = req.params;
    const { status } = req.query;
    
    const filter: any = { branchCode };
    if (status) filter.status = status;
    
    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'fullName email phoneNo')
      .sort('-createdAt');
    
    res.json({
      count: complaints.length,
      complaints
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branch complaints', error });
  }
};

/**
 * Get complaints for the authenticated user
 */
export const getUserComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const complaints = await Complaint.find({ 
      createdBy: req.user._id,
      isAnonymous: false
    }).sort('-createdAt');
    
    res.json({
      count: complaints.length,
      complaints
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user complaints', error });
  }
};

/**
 * Get complaint by ID (for status checking)
 */
export const getComplaintById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      res.status(404).json({ message: 'Complaint not found' });
      return;
    }
    
    // For anonymous complaints, only return limited information
    if (complaint.isAnonymous) {
      res.json({
        id: complaint._id,
        status: complaint.status,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt
      });
      return;
    }
    
    res.json({ complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaint', error });
  }
};

/**
 * Update complaint status (branch supervisor or admin)
 */
export const updateComplaintStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!Object.values(ComplaintStatus).includes(status as ComplaintStatus)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }
    
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      res.status(404).json({ message: 'Complaint not found' });
      return;
    }
    
    // If branch supervisor, check if they have access to this complaint's branch
    if (req.user?.role === UserRole.BRANCH_SUPERVISOR) {
      const supervisor = await BranchSupervisor.findOne({ 
        user: req.user._id,
        branchCode: complaint.branchCode
      });
      
      if (!supervisor) {
        res.status(403).json({ message: 'You do not have permission to update this complaint' });
        return;
      }
    }
    
    complaint.status = status as ComplaintStatus;
    await complaint.save();
    
    res.json({
      message: 'Complaint status updated successfully',
      status: complaint.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint status', error });
  }
};

/**
 * Add action to complaint (branch supervisor or admin)
 */
export const addActionToComplaint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let action = req.body;

    action = {...action, createdAt: new Date()}
    
    if (!action?.description || typeof action?.description !== 'string') {
      res.status(400).json({ message: 'Action text is required' });
      return;
    }
    
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      res.status(404).json({ message: 'Complaint not found' });
      return;
    }
    
    // If branch supervisor, check if they have access to this complaint's branch
    if (req.user?.role === UserRole.BRANCH_SUPERVISOR) {
      const supervisor = await BranchSupervisor.findOne({ 
        user: req.user._id,
        branchCode: complaint.branchCode
      });
      
      if (!supervisor) {
        res.status(403).json({ message: 'You do not have permission to update this complaint' });
        return;
      }
    }
    
    complaint.actionsTaken.push(action);
    await complaint.save();
    
    res.json({
      message: 'Action added to complaint successfully',
      actionsTaken: complaint.actionsTaken
    });

    // Send notification to the user if they are not anonymous
    if (!complaint.isAnonymous && complaint.createdBy) {
      let htmlContent = fs.readFileSync('./src/utils/email-templates/notify-action-email.html', 'utf8');
      const user = await User.findById(complaint.createdBy);
      
      htmlContent = htmlContent
        .replace('{customerName}', user?.fullName || 'Customer')
        .replace('{complaintId}', (complaint._id as any).toString())
        .replace('{complaintDescription}', complaint.description)
        .replace('{complaintDate}', format(complaint.createdAt, 'PPPpp'))
        .replace('{actionTaken}', complaint.actionsTaken.map((action: any) => action.description).join(', '))
        .replace('{complaintStatus}', complaint.status)
        .replace('{actionDate}', format(complaint.updatedAt, 'PPPpp'));

      if (user && user.email) {
        sendMail(
          user.email,
          'Action Taken on Your Complaint',
          htmlContent
        );
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding action to complaint', error });
  }
};


