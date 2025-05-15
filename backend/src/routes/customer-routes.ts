// src/routes/customer-routes.ts
import { Router } from 'express';
import { 
  registerCustomer,
  getAllCustomers,
  updateCustomerProfile,
  getCustomerById,
  deleteCustomer
} from '../controllers/customer-controller';
import { authenticate } from '../middleware/auth-middleware';
import { authorize, isResourceOwner } from '../middleware/role-middleware';
import { UserRole } from '../models/user-model';
import { customerValidations } from '../validators/validation-schemas';
import { validate } from '../validators/validation-utils';

const router = Router();

// Public route for self-registration
router.post('/register', validate(customerValidations.create), registerCustomer);

// Protected routes - user can only access their own data
router.get('/:id', authenticate, isResourceOwner('id'), getCustomerById);
router.put('/:id', 
  authenticate, 
  isResourceOwner('id'), 
  validate(customerValidations.update), 
  updateCustomerProfile
);
router.patch('/:id/ecard', 
  authenticate, 
  isResourceOwner('id'), 
  validate(customerValidations.update)
);

// Admin-only routes
router.get('/', authenticate, authorize([UserRole.ADMIN]), getAllCustomers);
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), deleteCustomer);

export default router;