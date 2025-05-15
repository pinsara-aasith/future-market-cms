# Supermarket Complaint Management System

## Overview
This is a Node.js and TypeScript-based microservice for managing complaints in a supermarket chain.

## Project Structure
```
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
```

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
1. Copy `env-template.txt` to `.env` and configure environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## API Documentation
See the API documentation for details on available endpoints.
