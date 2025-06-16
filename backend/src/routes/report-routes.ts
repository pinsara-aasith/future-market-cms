import { Router } from 'express';
import { authenticate } from '../middleware/auth-middleware';
import { getReport } from '../controllers/report-controller';
import { authorize } from '../middleware/role-middleware';
import { UserRole } from '../models/user-model';
const router = Router();

router.get('/', authenticate, authorize([UserRole.ADMIN, UserRole.BRANCH_SUPERVISOR]), getReport);

export default router;