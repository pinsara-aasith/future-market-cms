export type UserRole = 'customer' | 'branch_supervisor' | 'admin';

export interface User {
  id?: string;
  fullName: string;
  email: string;
  phoneNo: string;
  password?: string;
  role: UserRole;
}

export interface Customer {
  id?: string;
  user: User;
  eCardHolder: boolean;
}

export interface Branch {
  id?: string;
  branchCode: string;
  branchName: string;
  address: string;
  phoneNo: string;
}

export interface BranchSupervisor {
  id?: string;
  branchCode: string;
  user: User;
}

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface ComplaintAction {
  id?: string;
  complaintId: string;
  description: string;
  createdBy: string;
  createdAt: Date;
}

export interface Complaint {
  id?: string;
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