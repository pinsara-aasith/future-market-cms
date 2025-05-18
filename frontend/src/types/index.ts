export type UserRole = 'customer' | 'branch_supervisor' | 'admin';

export interface User {
  _id?: string;
  fullName: string;
  email: string;
  phoneNo: string;
  password?: string;
  role: UserRole;
}

export interface Customer {
  _id?: string;
  user: User | string; // Can be either User object or user ID string
  eCardHolder: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BranchSupervisor {
  _id?: string;
  branchCode: string;
  user:  User;
}

export interface Branch {
  _id?: string;
  branchCode: string;
  branchName: string;
  address: string;
  phoneNo: string;
}

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface ComplaintAction {
  _id?: string;
  description: string;
  createdAt: Date;
}

export interface Complaint {
  _id?: string;
  description: string;
  branchCode: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  status: ComplaintStatus;
  actionsTaken: ComplaintAction[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}