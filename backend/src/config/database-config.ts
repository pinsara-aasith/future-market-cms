import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * Connect to MongoDB database
 * @returns A promise that resolves when connected
 */
export const connectDatabase = async (): Promise<mongoose.Connection> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket-complaint-management';
    
    // Configure mongoose options
    mongoose.set('strictQuery', true);
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    
    logger.info('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Close the database connection
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};