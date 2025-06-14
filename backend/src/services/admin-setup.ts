import bcrypt from 'bcrypt';
import User from '../models/user-model';
import { logger } from '../utils/logger';

/**
 * Creates a default admin user if none exists
 */
export const setupAdminUser = async (): Promise<void> => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        fullName: 'System Administrator',
        email: 'admin@supermarket.com',
        password: hashedPassword,
        phoneNo: '0000000000',
        role: 'admin'
      });
      
      logger.info('Default admin user created');
    }
  } catch (error) {
    logger.error('Error creating default admin user:', error);
  }
};