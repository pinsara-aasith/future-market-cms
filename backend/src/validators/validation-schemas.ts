import { body, param } from 'express-validator';

export const authValidations = {
  register: [
    body('fullName')
      .notEmpty().withMessage('Full name is required')
      .isString().withMessage('Full name must be a string'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phoneNo')
      .notEmpty().withMessage('Phone number is required')
      .matches(/^[0-9+\-\s]+$/).withMessage('Please provide a valid phone number'),
  ],
  
  login: [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ]
};

export const branchValidations = {
  create: [
    body('branchCode')
      .notEmpty().withMessage('Branch code is required')
      .isString().withMessage('Branch code must be a string'),
    body('branchName')
      .notEmpty().withMessage('Branch name is required')
      .isString().withMessage('Branch name must be a string'),
    body('address')
      .notEmpty().withMessage('Address is required')
      .isString().withMessage('Address must be a string'),
    body('phoneNo')
      .notEmpty().withMessage('Phone number is required')
      .matches(/^[0-9+\-\s]+$/).withMessage('Please provide a valid phone number')
  ],
  
  update: [
    body('branchName')
      .optional()
      .isString().withMessage('Branch name must be a string'),
    body('address')
      .optional()
      .isString().withMessage('Address must be a string'),
    body('phoneNo')
      .optional()
      .matches(/^[0-9+\-\s]+$/).withMessage('Please provide a valid phone number')
  ]
};

export const branchSupervisorValidations = {
  create: [
    body('branchCode')
      .notEmpty().withMessage('Branch code is required')
      .isString().withMessage('Branch code must be a string'),
    body('user.fullName')
      .notEmpty().withMessage('Full name is required')
      .isString().withMessage('Full name must be a string'),
    body('user.email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('user.password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('user.phoneNo')
      .notEmpty().withMessage('Phone number is required')
      .matches(/^[0-9+\-\s]+$/).withMessage('Please provide a valid phone number')
  ],
  
  update: [
    body('user.fullName')
      .optional()
      .isString().withMessage('Full name must be a string'),
    body('user.phoneNo')
      .optional()
      .matches(/^[0-9+\-\s]+$/).withMessage('Please provide a valid phone number')
  ]
};

export const complaintValidations = {
  create: [
    body('description')
      .notEmpty().withMessage('Description is required')
      .isString().withMessage('Description must be a string'),
    body('branchCode')
      .notEmpty().withMessage('Branch code is required')
      .isString().withMessage('Branch code must be a string'),
    body('createdBy')
      .optional()
  ],
  
  update: [
    body('actionsTaken')
      .optional()
      .isString().withMessage('Actions taken must be a string'),
    body('status')
      .optional()
      .isIn(['pending', 'in_progress', 'resolved', 'closed'])
      .withMessage('Status must be one of: pending, in_progress, resolved, closed')
  ]
};

export const customerValidations = {
  create: [
    body('user.fullName')
      .notEmpty().withMessage('Full name is required')
      .isString().withMessage('Full name must be a string'),
    body('user.email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('user.password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('user.phoneNo')
      .notEmpty().withMessage('Phone number is required')
      .matches(/^[0-9+\-\s]+$/).withMessage('Please provide a valid phone number'),
  ],
  
  update: [
    body('eCardHolder')
      .optional()
      .isBoolean().withMessage('E-card holder must be a boolean value')
  ]
};