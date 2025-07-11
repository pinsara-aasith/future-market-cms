import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserRole, IUser } from "../models/user-model";
import Customer from "../models/customer-model";
import { logger } from "../utils/logger";
import BranchSupervisor from "../models/branch-supervisor-model";

// Token generation helper
const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });
};

// Token refresh helper
const generateRefreshToken = (user: IUser): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

/**
 * Register a new user (customer)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, phoneNo, eCardHolder } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }

    // Create new user with customer role
    const user = new User({
      fullName,
      email,
      password,
      phoneNo,
      role: UserRole.CUSTOMER,
    });

    await user.save();

    // Create customer profile
    const customer = new Customer({
      user: user._id,
      eCardHolder: !!eCardHolder,
    });

    await customer.save();

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNo: user.phoneNo,
        role: user.role,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during registration", error });
  }
};

/**
 * User login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const [token, refreshToken] = await Promise.all([
      generateToken(user),
      generateRefreshToken(user),
    ]);

    // Get branch code if user is a branch supervisor
    let branchCode: string | null = null;
    if (user.role === UserRole.BRANCH_SUPERVISOR) {
      const supervisor = await BranchSupervisor.findOne({ user: user._id })
        .select("branchCode")
        .lean();

      branchCode = supervisor?.branchCode ?? null;
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNo: user.phoneNo,
        role: user.role,
        branchCode,
      },
      token,
      refreshToken,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Error during login", error: err });
  }
};

/**
 * User logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: "Logged out successfully" });
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    // Generate new access token
    const newToken = generateToken(user);

    res.json({
      token: newToken,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

/**
 * Get current authenticated user info
 */
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    res.json({
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phoneNo: req.user.phoneNo,
        role: req.user.role,
        branchCode: req.user.branchCode ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user information", error });
  }
};
