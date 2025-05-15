import  app  from './app-setup';
import { connectDatabase } from './config/database-config';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDatabase()
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
