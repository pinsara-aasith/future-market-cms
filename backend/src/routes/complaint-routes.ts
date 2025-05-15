// src/routes/complaint-routes.ts
import { Router } from 'express';
import { 
  createComplaint,
  createAnonymousComplaint,
  getAllComplaints,
  getBranchComplaints,
  getUserComplaints,
  getComplaintById,
  updateComplaintStatus,
  addActionToComplaint
} from '../controllers/complaint-controller';
import { authenticate } from '../middleware/auth-middleware';
import { authorize, checkBranchAccess } from '../middleware/role-middleware';
import { UserRole } from '../models/user-model';
import { complaintValidations } from '../validators/validation-schemas';
import { validate } from '../validators/validation-utils';

const router = Router();

// Public routes
router.post('/anonymous', validate(complaintValidations.create), createAnonymousComplaint);
router.get('/status/:id', getComplaintById); // Public access to check complaint status

// Authenticated routes
router.post('/', authenticate, validate(complaintValidations.create), createComplaint); // Any authenticated user can create a complaint
router.get('/my-complaints', authenticate, getUserComplaints); // User's own complaints

// Branch supervisor routes (for complaints in their branch)
router.get('/branch/:branchCode', 
  authenticate, 
  authorize([UserRole.BRANCH_SUPERVISOR, UserRole.ADMIN]), 
  checkBranchAccess, 
  getBranchComplaints
);

// Branch supervisor and admin can update complaints
router.patch('/:id/status', 
  authenticate, 
  authorize([UserRole.BRANCH_SUPERVISOR, UserRole.ADMIN]), 
  validate(complaintValidations.update),
  updateComplaintStatus
);

router.post('/:id/actions', 
  authenticate, 
  authorize([UserRole.BRANCH_SUPERVISOR, UserRole.ADMIN]), 
  addActionToComplaint
);

// Admin-only route to view all complaints
router.get('/', 
  authenticate, 
  authorize([UserRole.ADMIN]), 
  getAllComplaints
);

export default router;