import { Request, Response } from 'express';
import User from '../models/user-model';

/**
 * Get all admins (admin only)
 */
export const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('fullName email phoneNo role');

    res.json({
      count: admins.length,
      admins
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error });
  }
};

/**
 * Create a new admin (super admin only)
 */
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phoneNo, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use' });
      return;
    }

    // Create user with admin role
    const admin = new User({
      fullName,
      email,
      phoneNo,
      password,
      role: 'admin'
    });

    await admin.save();

    const adminResponse = admin.toObject();
    // @ts-ignore
    delete adminResponse.password;

    res.status(201).json({
      message: 'Admin created successfully',
      admin: adminResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error });
  }
};

/**
 * Update admin profile (admin only)
 */
export const updateAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, phoneNo } = req.body;

    // Ensure the user exists and is an admin
    const admin = await User.findOne({ _id: id, role: 'admin' });
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    // Update the admin
    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      { fullName, phoneNo },
      { new: true, runValidators: true }
    ).select('fullName email phoneNo role');

    res.json({
      message: 'Admin profile updated successfully',
      admin: updatedAdmin
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin profile', error });
  }
};

/**
 * Delete admin (super admin only)
 */
export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Ensure the user is not trying to delete themselves
     // @ts-ignore
    if (id === req.user?._id.toString()) {
      res.status(400).json({ message: 'You cannot delete your own admin account' });
      return;
    }

    // Find and delete the admin
    const deletedAdmin = await User.findOneAndDelete({ _id: id, role: 'admin' });
    
    if (!deletedAdmin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error });
  }
};

/**
 * Get dashboard statistics (admin only)
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {    
    // Count users by role
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format stats for easier consumption
    const stats = {
      users: {
        total: 0,
        byRole: {} as any
      }
    };
    
    userStats.forEach(stat => {
      stats.users.total += stat.count;
      stats.users.byRole[stat._id] = stat.count;
    });
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard statistics', error });
  }
};
