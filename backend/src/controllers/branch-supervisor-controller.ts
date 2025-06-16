import { Request, Response } from 'express';
import User, { UserRole } from '../models/user-model';
import BranchSupervisor from '../models/branch-supervisor-model';
import Branch from '../models/branch-model';

/**
 * Create a new branch supervisor (admin only)
 */
export const createBranchSupervisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user:u, branchCode } = req.body;

    const { fullName, email, password, phoneNo } = u;

    // Check if branch exists
    const branch = await Branch.findOne({ branchCode });
    if (!branch) {
      res.status(400).json({ message: 'Branch not found' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create new user with branch supervisor role
    const user = new User({
      fullName,
      email,
      password,
      phoneNo,
      role: UserRole.BRANCH_SUPERVISOR
    });

    await user.save();

    // Create branch supervisor profile
    const branchSupervisor = new BranchSupervisor({
      user: user._id,
      branchCode
    });

    await branchSupervisor.save();

    res.status(201).json({
      message: 'Branch supervisor created successfully',
      branchSupervisor: {
        _id: branchSupervisor._id,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNo: user.phoneNo,
          role: user.role
        },
        branchCode: branchSupervisor.branchCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating branch supervisor', error });
  }
};

/**
 * Get all branch supervisors (admin only)
 */
export const getAllBranchSupervisors = async (req: Request, res: Response): Promise<void> => {
  try {
    const supervisors = await BranchSupervisor.find()
      .populate('user', 'fullName email phoneNo role')
      .sort('branchCode');
    
    res.json({
      count: supervisors.length,
      supervisors
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branch supervisors', error });
  }
};

/**
 * Get branch supervisor by ID (admin only)
 */
export const getBranchSupervisorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const supervisor = await BranchSupervisor.findById(id)
      .populate('user', 'fullName email phoneNo role');
    
    if (!supervisor) {
      res.status(404).json({ message: 'Branch supervisor not found' });
      return;
    }
    
    res.json({ supervisor });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branch supervisor', error });
  }
};

/**
 * Update branch supervisor (admin only)
 */
export const updateBranchSupervisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { branchCode, user: userUpdates } = req.body;

    // Find the branch supervisor
    const branchSupervisor = await BranchSupervisor.findById(id);
    if (!branchSupervisor) {
      res.status(404).json({ message: 'Branch supervisor not found' });
      return;
    }

    // If branchCode is provided, validate and update
    if (branchCode) {
      const branch = await Branch.findOne({ branchCode });
      if (!branch) {
        res.status(400).json({ message: 'Branch not found' });
        return;
      }
      branchSupervisor.branchCode = branchCode;
    }

    // If user fields are provided, update the user document
    if (userUpdates && typeof userUpdates === 'object') {
      const user = await User.findById(branchSupervisor.user);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const allowedFields = ['fullName', 'email', 'phoneNo', 'role'];
      for (const key of allowedFields) {
        if (userUpdates[key] !== undefined) {
          (user as any)[key] = userUpdates[key];
        }
      }

      await user.save();
    }

    await branchSupervisor.save();
    const populatedSupervisor = await BranchSupervisor.findById(id).populate('user', 'fullName email phoneNo role');

    res.json({
      message: 'Branch supervisor updated successfully',
      supervisor: populatedSupervisor
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating branch supervisor', error });
  }
};

/**
 * Delete branch supervisor (admin only)
 */
export const deleteBranchSupervisor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Find the supervisor first to get user ID
    const supervisor = await BranchSupervisor.findById(id);
    
    if (!supervisor) {
      res.status(404).json({ message: 'Branch supervisor not found' });
      return;
    }
    
    // Delete the supervisor
    await BranchSupervisor.findByIdAndDelete(id);
    
    // Delete associated user
    await User.findByIdAndDelete(supervisor.user);
    
    res.json({
      message: 'Branch supervisor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting branch supervisor', error });
  }
};
