// src/middleware/auth-middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, UserRole } from '../models/user-model';
import BranchSupervisor from '../models/branch-supervisor-model';
import User from '../models/user-model';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}

/**
 * Authentication middleware to verify JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    // Find user by id
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    
    // Get branch code if user is a branch supervisor
    let branchCode: string | null = null;
    if (user.role === UserRole.BRANCH_SUPERVISOR) {

      const supervisor = await BranchSupervisor
        .findOne({ user: user._id })
        .select('branchCode')
        .lean();
    
      branchCode = supervisor?.branchCode ?? null;
    }
    
    // Attach user and token to request object
    req.user = user;
    req.user.branchCode = branchCode;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
