import bcrypt from 'bcrypt';
import User from '../models/user-model';
import { logger } from '../utils/logger';

/**
 * Creates a default admin user if no admin exists in the system
 */
export const setupAdminUser = async (): Promise<void> => {
  try {
    // Check if any admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      await User.create({
        fullName: 'System Administrator',
        email: 'admin@supermarket.com',
        password: 'admin123',
        phoneNo: '1234567890',
        role: 'admin'
      });
      
      logger.info('Default admin user created successfully');
    }
  } catch (error) {
    logger.error('Error setting up default admin user:', error);
  }
};