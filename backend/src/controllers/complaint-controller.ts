// src/controllers/complaint-controller.ts
import { Request, Response } from 'express';
import Complaint, { ComplaintStatus } from '../models/complaint-model';
import Branch from '../models/branch-model';
import BranchSupervisor from '../models/branch-supervisor-model';

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
  } catch (error) {
    res.status(500).json({ message: 'Error submitting anonymous complaint', error });
  }
};

/**
 * Get all complaints (admin only)
 */
export const getAllComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query parameters for filtering
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
    
    // Full complaint details
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
    
    // Add the action to the actionsTaken array
    complaint.actionsTaken.push(action);
    await complaint.save();
    
    res.json({
      message: 'Action added to complaint successfully',
      actionsTaken: complaint.actionsTaken
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding action to complaint', error });
  }
};

// Import at the top of the file
import { UserRole } from '../models/user-model';
