// src/middleware/role-middleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user-model';
import BranchSupervisor from '../models/branch-supervisor-model';

/**
 * Middleware to authorize users based on their roles
 * @param roles Array of allowed roles
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error during authorization' });
    }
  };
};

/**
 * Middleware to check if a user is the resource owner
 * @param paramIdField The parameter field name containing the resource ID
 */
export const isResourceOwner = (paramIdField: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const resourceId = req.params[paramIdField];
      
      // Admin can access any resource
      if (req.user.role === UserRole.ADMIN) {
        next();
        return;
      }
      
      // For customer roles, check if the resource belongs to them
      if (resourceId !== req.user.id) {
        res.status(403).json({ message: 'Forbidden: Not the resource owner' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error checking resource ownership' });
    }
  };
};

/**
 * Middleware to check if a branch supervisor has access to a specific branch
 */
export const checkBranchAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Admin has access to all branches
    if (req.user.role === UserRole.ADMIN) {
      next();
      return;
    }

    const branchCode = req.params.branchCode || req.body.branchCode;
    
    if (!branchCode) {
      res.status(400).json({ message: 'Branch code is required' });
      return;
    }

    // Check if supervisor is assigned to the requested branch
    if (req.user.role === UserRole.BRANCH_SUPERVISOR) {
      const supervisor = await BranchSupervisor.findOne({ 
        user: req.user.id,
        branchCode
      });

      if (!supervisor) {
        res.status(403).json({ message: 'Forbidden: No access to this branch' });
        return;
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking branch access' });
  }
};
