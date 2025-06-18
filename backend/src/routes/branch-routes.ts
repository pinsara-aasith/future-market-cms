// src/routes/branch-routes.ts
import { Router } from 'express';
import { 
  createBranch, 
  getAllBranches, 
  getBranchById, 
  updateBranch, 
  deleteBranch 
} from '../controllers/branch-controller';
import { authenticate } from '../middleware/auth-middleware';
import { authorize } from '../middleware/role-middleware';
import { UserRole } from '../models/user-model';
import { branchValidations } from '../validators/validation-schemas';
import { validate } from '../validators/validation-utils';



const router = Router();

// Public route to get all branches
router.get('/', getAllBranches);

// Get branch by ID (public)
router.get('/:id', getBranchById);

// Admin-only routes for branch management
router.post('/', 
  authenticate, 
  authorize([UserRole.ADMIN]), 
  validate(branchValidations.create),
  createBranch
);

router.put('/:id', 
  authenticate, 
  authorize([UserRole.ADMIN]), 
  validate(branchValidations.update),
  updateBranch
);

router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), deleteBranch);

export default router;