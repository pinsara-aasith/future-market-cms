import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { logger } from './logger';

interface TokenPayload {
  id: string;
  role: string;
}

/**
 * Generate JWT token
 * @param userId - User ID
 * @param role - User role
 * @returns JWT token
 */
export const generateToken = (userId: string | Types.ObjectId, role: string): string => {
  const payload: TokenPayload = {
    id: userId.toString(),
    role
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRATION || '1d' }
  );
};

/**
 * Verify JWT token
 * @param token - JWT token
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as TokenPayload;
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return null;
  }
};