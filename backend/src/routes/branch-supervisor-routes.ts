// src/routes/branch-supervisor-routes.ts
import { Router } from 'express';
import { 
  createBranchSupervisor, 
  getAllBranchSupervisors, 
  getBranchSupervisorById, 
  updateBranchSupervisor, 
  deleteBranchSupervisor 
} from '../controllers/branch-supervisor-controller';
import { authenticate } from '../middleware/auth-middleware';
import { authorize } from '../middleware/role-middleware';
import { UserRole } from '../models/user-model';
import { branchSupervisorValidations } from '../validators/validation-schemas';
import { validate } from '../validators/validation-utils';

const router = Router();

// All branch supervisor routes are admin-only
router.use(authenticate, authorize([UserRole.ADMIN]));

router.post('/', validate(branchSupervisorValidations.create), createBranchSupervisor);
router.get('/', getAllBranchSupervisors);
router.get('/:id', getBranchSupervisorById);
router.put('/:id', validate(branchSupervisorValidations.update), updateBranchSupervisor);
router.delete('/:id', deleteBranchSupervisor);

export default router;