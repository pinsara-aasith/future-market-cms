#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Define the directory structure
const directoryStructure = {
  'src': {
    'config': {},
    'controllers': {},
    'middleware': {},
    'models': {},
    'routes': {},
    'utils': {},
    'services': {},
    'validators': {}
  },
  'scripts': {},
  'logs': {}
};

// Map files to their destination directories
const fileMapping = {
  // Configuration files
  'database-config.ts': 'src/config',
  'constants.ts': 'src/config',
  'env-file.txt': 'src/config',
  'env-template.txt': 'src/config',
  
  // Controllers
  'admin-controller.ts': 'src/controllers',
  'auth-controller.ts': 'src/controllers',
  'branch-controller.ts': 'src/controllers',
  'branch-supervisor-controller.ts': 'src/controllers',
  'complaint-controller.ts': 'src/controllers',
  'customer-controller.ts': 'src/controllers',
  
  // Middleware
  'auth-middleware.ts': 'src/middleware',
  'role-middleware.ts': 'src/middleware',
  'error-handler.ts': 'src/middleware',
  
  // Models
  'branch-model.ts': 'src/models',
  'branch-supervisor-model.ts': 'src/models',
  'complaint-model.ts': 'src/models',
  'customer-model.ts': 'src/models',
  'user-model.ts': 'src/models',
  
  // Routes
  'admin-routes.ts': 'src/routes',
  'auth-routes.ts': 'src/routes',
  'branch-routes.ts': 'src/routes',
  'branch-supervisor-routes.ts': 'src/routes',
  'complaint-routes.ts': 'src/routes',
  'customer-routes.ts': 'src/routes',
  'index-routes.ts': 'src/routes',
  
  // Utils
  'token-utils.ts': 'src/utils',
  'logger.ts': 'src/utils',
  
  // Validators
  'validation-schemas.ts': 'src/validators',
  'validation-utils (1).ts': 'src/validators/validation-utils.ts',
  
  // Services
  'admin-setup.ts': 'src/services',
  'database-seeder.ts': 'src/services',
  
  // Root files
  'app-setup.ts': 'src',
  'server-ts.ts': 'src/server.ts',
  'tsconfig-json.json': 'tsconfig.json',
  'package-json.json': 'package.json'
};

// Function to create directories recursively
function createDirectories(basePath, structure) {
  for (const [dir, subDirs] of Object.entries(structure)) {
    const dirPath = path.join(basePath, dir);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
    
    if (Object.keys(subDirs).length > 0) {
      createDirectories(dirPath, subDirs);
    }
  }
}

// Function to move files to their respective directories
function moveFiles(sourceDir, fileMap) {
  for (const [file, destDir] of Object.entries(fileMap)) {
    const sourcePath = path.join(sourceDir, file);
    
    // Handle special case for renamed files
    let destFileName = path.basename(file);
    if (destDir.includes('/') && destDir.split('/').pop().includes('.ts')) {
      destFileName = destDir.split('/').pop();
      const targetDir = destDir.split('/').slice(0, -1).join('/');
      const destPath = path.join(targetDir, destFileName);
      
      if (fs.existsSync(sourcePath)) {
        try {
          // Create destination directory if it doesn't exist
          const targetDirPath = path.join(process.cwd(), targetDir);
          if (!fs.existsSync(targetDirPath)) {
            fs.mkdirSync(targetDirPath, { recursive: true });
          }
          
          fs.renameSync(sourcePath, destPath);
          console.log(`Moved and renamed ${sourcePath} to ${destPath}`);
        } catch (err) {
          console.error(`Error moving file ${sourcePath}: ${err.message}`);
        }
      } else {
        console.warn(`Source file not found: ${sourcePath}`);
      }
    } else {
      // Normal file move
      const destPath = path.join(destDir, destFileName);
      
      if (fs.existsSync(sourcePath)) {
        try {
          // Create destination directory if it doesn't exist
          const targetDirPath = path.join(process.cwd(), destDir);
          if (!fs.existsSync(targetDirPath)) {
            fs.mkdirSync(targetDirPath, { recursive: true });
          }
          
          fs.renameSync(sourcePath, destPath);
          console.log(`Moved ${sourcePath} to ${destPath}`);
        } catch (err) {
          console.error(`Error moving file ${sourcePath}: ${err.message}`);
        }
      } else {
        console.warn(`Source file not found: ${sourcePath}`);
      }
    }
  }
}

// Create a README.md file with project information
function createReadme() {
  const readmeContent = `# Supermarket Complaint Management System

## Overview
This is a Node.js and TypeScript-based microservice for managing complaints in a supermarket chain.

## Project Structure
\`\`\`
src/
├── config/         # Configuration files
├── controllers/    # Route handlers
├── middleware/     # Express middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── validators/     # Input validation
├── app-setup.ts    # Express app setup
└── server.ts       # Server entry point
\`\`\`

## User Types
1. Customers - Can register/login and submit complaints
2. Branch Supervisors - Can view and respond to complaints for their branch
3. Admins - Can manage branches and branch supervisors

## Data Models
- User: Base user model with authentication details
- Customer: Extended user model for customers
- Branch: Supermarket branch information
- BranchSupervisor: Links supervisors to branches
- Complaint: Complaint tracking and resolution

## Setup Instructions
1. Copy \`env-template.txt\` to \`.env\` and configure environment variables
2. Install dependencies: \`npm install\`
3. Start the server: \`npm start\`

## API Documentation
See the API documentation for details on available endpoints.
`;

  fs.writeFileSync('README.md', readmeContent);
  console.log('Created README.md file');
}

// Function to create a main entry script
function createMainEntryScript() {
  const indexContent = `import { app } from './app-setup';
import { connectToDatabase } from './config/database-config';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      logger.info(\`Server running on port \${PORT}\`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
`;

  fs.writeFileSync('src/index.ts', indexContent);
  console.log('Created src/index.ts file');
}

// Main execution
console.log('Starting file organization...');
try {
  // Create the directory structure
  createDirectories(process.cwd(), directoryStructure);
  
  // Move files to their respective directories
  moveFiles(process.cwd(), fileMapping);
  
  // Create README.md
  createReadme();
  
  // Create main entry script
  createMainEntryScript();
  
  console.log('File organization completed successfully!');
} catch (error) {
  console.error('Error organizing files:', error);
}
