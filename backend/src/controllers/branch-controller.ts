// src/controllers/branch-controller.ts
import { Request, Response } from 'express';
import Branch, { IBranch } from '../models/branch-model';

/**
 * Create a new branch (admin only)
 */
export const createBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { branchCode, branchName, address, phoneNo } = req.body;

    // Check if branch with same code already exists
    const existingBranch = await Branch.findOne({ branchCode });
    if (existingBranch) {
      res.status(400).json({ message: 'Branch with this code already exists' });
      return;
    }

    // Create new branch
    const branch = new Branch({
      branchCode,
      branchName,
      address,
      phoneNo
    });

    await branch.save();

    res.status(201).json({
      message: 'Branch created successfully',
      branch
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating branch', error });
  }
};

/**
 * Get all branches (public)
 */
export const getAllBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const branches = await Branch.find().sort('branchName');
    
    res.json({
      count: branches.length,
      branches
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branches', error });
  }
};

/**
 * Get branch by ID (public)
 */
export const getBranchById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const branch = await Branch.findById(id);
    
    if (!branch) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }
    
    res.json({ branch });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branch', error });
  }
};

/**
 * Update branch (admin only)
 */
export const updateBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { branchName, address, phoneNo } = req.body;
    
    // Find and update the branch
    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      {
        branchName,
        address,
        phoneNo
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBranch) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }
    
    res.json({
      message: 'Branch updated successfully',
      branch: updatedBranch
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating branch', error });
  }
};

/**
 * Delete branch (admin only)
 */
export const deleteBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const deletedBranch = await Branch.findByIdAndDelete(id);
    
    if (!deletedBranch) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }
    
    res.json({
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting branch', error });
  }
};
