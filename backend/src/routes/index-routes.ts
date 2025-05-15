// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth-routes';
import branchRoutes from './branch-routes';
import branchSupervisorRoutes from './branch-supervisor-routes';
import complaintRoutes from './complaint-routes';
import customerRoutes from './customer-routes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);
router.use('/branch-supervisors', branchSupervisorRoutes);
router.use('/complaints', complaintRoutes);
router.use('/customers', customerRoutes);

export default router;
