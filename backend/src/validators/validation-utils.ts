import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { CustomError } from '../middleware/error-handler';

/**
 * Middleware for validating requests using express-validator
 * @param validations - Array of validation chains
 * @returns Middleware function
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    // If validation errors exist, throw a custom error
    throw new CustomError(
      'Validation failed',
      400,
      errors.array()
    );
  };
};