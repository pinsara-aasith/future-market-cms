// User model with role-based authentication
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserRole {
  CUSTOMER = 'customer',
  BRANCH_SUPERVISOR = 'branchSupervisor',
  ADMIN = 'admin'
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phoneNo: string;
  role: UserRole;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  phoneNo: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash the password
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
