import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import indexRoutes from './routes/index-routes';
import authRoutes from './routes/auth-routes';
import customerRoutes from './routes/customer-routes';
import branchRoutes from './routes/branch-routes';
import branchSupervisorRoutes from './routes/branch-supervisor-routes';
import complaintRoutes from './routes/complaint-routes';
import { errorHandler } from './middleware/error-handler';
import { setupAdminUser } from './utils/admin-setup';
import { logger } from './utils/logger';
import { runSeeder } from './services/database-seeder';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();

app.use(express.static('public'));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/branch-supervisor', branchSupervisorRoutes);
app.use('/api/complaint', complaintRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket-complaint-management';
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected successfully');

    // Setup default admin user
    // await setupAdminUser();
    // await runSeeder()
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  // process.exit(1);
});

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

export default app;