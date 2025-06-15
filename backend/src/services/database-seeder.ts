import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user-model';
import Branch from '../models/branch-model';
import BranchSupervisor from '../models/branch-supervisor-model';
import Customer from '../models/customer-model';
import Complaint from '../models/complaint-model';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket-complaint-management';
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected successfully for seeding');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to clean the database
const cleanDB = async (): Promise<void> => {
  try {
    await User.deleteMany({});
    await Branch.deleteMany({});
    await BranchSupervisor.deleteMany({});
    await Customer.deleteMany({});
    await Complaint.deleteMany({});
    logger.info('Database cleaned successfully');
  } catch (error) {
    logger.error('Error cleaning database:', error);
    process.exit(1);
  }
};

// Function to seed the database
const seedDB = async (): Promise<void> => {
  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10);
    const password = await bcrypt.hash('password', salt);
    
    // Create admin user
    const adminUser = await User.create({
      fullName: 'Admin User',
      email: 'admin@supermarket.com',
      password: 'password',
      phoneNo: '1234567890',
      role: 'admin'
    });
    logger.info(`Admin user created with ID: ${adminUser._id}`);

    // Create branches
    const branches = await Branch.insertMany([
      {
        branchCode: 'BR001',
        branchName: 'Rathmalana',
        address: '123 Main St, City',
        phoneNo: '1234567891'
      },
      {
        branchCode: 'BR002',
        branchName: 'Kadawatha',
        address: '456 North St, City',
        phoneNo: '1234567892'
      },
      {
        branchCode: 'BR003',
        branchName: 'Kirulapana',
        address: '789 South St, City',
        phoneNo: '1234567893'
      }
    ]);
    logger.info(`Created ${branches.length} branches`);

    // Create branch supervisors
    const supervisorUsers = await User.insertMany([
      {
        fullName: 'Supervisor One',
        email: 'supervisor1@supermarket.com',
        password: password,
        phoneNo: '1234567894',
        role: 'branch_supervisor'
      },
      {
        fullName: 'Supervisor Two',
        email: 'supervisor2@supermarket.com',
        password: password,
        phoneNo: '1234567895',
        role: 'branch_supervisor'
      },
      {
        fullName: 'Supervisor Three',
        email: 'supervisor3@supermarket.com',
        password: password,
        phoneNo: '1234567896',
        role: 'branch_supervisor'
      }
    ]);

    // Link supervisors to branches
    const branchSupervisors = await BranchSupervisor.insertMany([
      {
        branchCode: 'BR001',
        user: supervisorUsers[0]._id
      },
      {
        branchCode: 'BR002',
        user: supervisorUsers[1]._id
      },
      {
        branchCode: 'BR003',
        user: supervisorUsers[2]._id
      }
    ]);
    logger.info(`Created ${branchSupervisors.length} branch supervisors`);

    // Create customers
    const customerUsers = await User.insertMany([
      {
        fullName: 'Customer One',
        email: 'customer1@example.com',
        password,
        phoneNo: '1234567897',
        role: 'customer'
      },
      {
        fullName: 'Customer Two',
        email: 'customer2@example.com',
        password,
        phoneNo: '1234567898',
        role: 'customer'
      }
    ]);

    const customers = await Customer.insertMany([
      {
        user: customerUsers[0]._id,
        eCardHolder: true
      },
      {
        user: customerUsers[1]._id,
        eCardHolder: false
      }
    ]);
    logger.info(`Created ${customers.length} customers`);

    // Create complaints
    const complaints = await Complaint.insertMany([
      {
        description: 'Poor service at checkout',
        branchCode: 'BR001',
        createdBy: customerUsers[0]._id,
        status: 'pending',
        actionsTaken: []
      },
      {
        description: 'Out of stock items not marked properly',
        branchCode: 'BR002',
        createdBy: customerUsers[1]._id,
        status: 'in_progress',
        actionsTaken: []
      },
      {
        description: 'Anonymous complaint about cleanliness',
        branchCode: 'BR003',
        status: 'pending',
        actionsTaken: []
      }
    ]);
    logger.info(`Created ${complaints.length} complaints`);

    logger.info('Database seeded successfully');
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};

// Main function to run the seeder
export const runSeeder = async (): Promise<void> => {
  try {
    await connectDB();
    await cleanDB();
    await seedDB();

    logger.info('Seeding complete!');
    // process.exit(0);
  } catch (error) {
    logger.error('Error running seeder:', error);
    process.exit(1);
  }
};

// Run the seeder
// runSeeder();