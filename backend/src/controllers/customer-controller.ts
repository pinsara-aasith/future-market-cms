// src/controllers/customer-controller.ts
import { Request, Response } from 'express';
import User from '../models/user-model';
import Customer, { ICustomer } from '../models/customer-model';
import mongoose from 'mongoose';
import { sendMail } from '../utils/mailer';
import fs from 'fs';

/**
 * Register a new customer
 */
export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phoneNo, password } = req.body.user;
    const { eCardHolder } = req.body.eCardHolder || false;
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use' });
      return;
    }

    // Create user with customer role
    const user = new User({
      fullName,
      email,
      phoneNo,
      password,
      role: 'customer'
    });

    await user.save();

    // Create customer profile
    const customer = new Customer({
      user: user._id,
      eCardHolder
    });

    await customer.save();

    res.status(201).json({
      message: 'Customer registered successfully',
      customer: {
        ...customer.toObject(),
        user: {
          fullName: user.fullName,
          email: user.email,
          phoneNo: user.phoneNo,
          role: user.role
        }
      }
    });

    // Send welcome email    
    let htmlContent = fs.readFileSync("./src/utils/email-templates/welcome-email.html", 'utf8');

    sendMail(
      user.email,
      'Welcome to CustomerPulse!',
      htmlContent
    ).catch((error) => {
      console.error('Error sending welcome email:', error);
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering customer', error });
  }
};

/**
 * Get all customers (admin only)
 */
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await Customer.find()
      .populate({
        path: 'user',
        select: 'fullName email phoneNo role'
      });

    res.json({
      count: customers.length,
      customers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

/**
 * Get customer profile (for logged in customer)
 */
export const getCustomerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const customer = await Customer.findOne({ user: userId })
      .populate({
        path: 'user',
        select: 'fullName email phoneNo role'
      });

    if (!customer) {
      res.status(404).json({ message: 'Customer profile not found' });
      return;
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer profile', error });
  }
};

/**
 * Update customer profile (for logged in customer)
 */
export const updateCustomerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { fullName, phoneNo, eCardHolder } = req.body;

    // Update user information
    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, phoneNo },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update customer information
    const customer = await Customer.findOneAndUpdate(
      { user: userId },
      { eCardHolder },
      { new: true, runValidators: true }
    ).populate({
      path: 'user',
      select: 'fullName email phoneNo role'
    });

    if (!customer) {
      res.status(404).json({ message: 'Customer profile not found' });
      return;
    }

    res.json({
      message: 'Customer profile updated successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer profile', error });
  }
};

/**
 * Delete customer account (for logged in customer)
 */
export const deleteCustomerAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    // Delete customer profile
    const deletedCustomer = await Customer.findOneAndDelete({ user: userId });

    if (!deletedCustomer) {
      res.status(404).json({ message: 'Customer profile not found' });
      return;
    }

    // Delete user account
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'Customer account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer account', error });
  }
};

/**
 * Get customer by ID (admin only)
 */
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid customer ID format' });
      return;
    }

    const customer = await Customer.findById(id)
      .populate({
        path: 'user',
        select: 'fullName email phoneNo role'
      });

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

/**
 * Delete customer (admin only)
 */
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid customer ID format' });
      return;
    }

    // Find the customer first to get the user ID
    const customer = await Customer.findById(id);
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    // Delete customer profile
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    // Delete associated user account
    const deletedUser = await User.findByIdAndDelete(customer.user);

    if (!deletedUser) {
      res.status(404).json({ message: 'Associated user not found' });
      return;
    }

    res.json({ 
      message: 'Customer deleted successfully',
      deletedCustomer: {
        ...deletedCustomer?.toObject(),
        user: {
          _id: deletedUser._id,
          fullName: deletedUser.fullName,
          email: deletedUser.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};