// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  BRANCH_SUPERVISOR: 'branch_supervisor',
  CUSTOMER: 'customer'
};

// Complaint statuses
export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

// API response messages
export const MESSAGES = {
  // Auth messages
  AUTH: {
    REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    TOKEN_REQUIRED: 'Authentication token is required',
    INVALID_TOKEN: 'Invalid authentication token'
  },
  
  // User messages
  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'Email already in use'
  },
  
  // Branch messages
  BRANCH: {
    CREATED: 'Branch created successfully',
    UPDATED: 'Branch updated successfully',
    DELETED: 'Branch deleted successfully',
    NOT_FOUND: 'Branch not found',
    CODE_EXISTS: 'Branch code already exists'
  },
  
  // Branch Supervisor messages
  BRANCH_SUPERVISOR: {
    CREATED: 'Branch supervisor created successfully',
    UPDATED: 'Branch supervisor updated successfully',
    DELETED: 'Branch supervisor deleted successfully',
    NOT_FOUND: 'Branch supervisor not found'
  },
  
  // Customer messages
  CUSTOMER: {
    CREATED: 'Customer created successfully',
    UPDATED: 'Customer updated successfully',
    DELETED: 'Customer deleted successfully',
    NOT_FOUND: 'Customer not found'
  },
  
  // Complaint messages
  COMPLAINT: {
    CREATED: 'Complaint created successfully',
    UPDATED: 'Complaint updated successfully',
    DELETED: 'Complaint deleted successfully',
    NOT_FOUND: 'Complaint not found'
  },
  
  // General messages
  GENERAL: {
    SERVER_ERROR: 'Server error',
    NOT_FOUND: 'Resource not found',
    SUCCESS: 'Success',
    FAILED: 'Failed',
    INVALID_ID: 'Invalid ID format'
  }
};

// Regex patterns
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[0-9+\-\s]+$/
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50
};