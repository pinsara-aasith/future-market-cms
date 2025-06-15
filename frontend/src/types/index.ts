export type UserRole = 'customer' | 'branch_supervisor' | 'admin';

export interface User {
  _id?: string;
  fullName: string;
  email: string;
  phoneNo: string;
  password?: string;
  role: UserRole;
  branchCode?: string;
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

export interface BranchReport {
  branch_code: string;
  branch_name: string;
  total_complaints: number;
  resolved: number;
  pending: number;
  in_progress: number;
  anonymous_complaints_ratio: string;
  most_frequent_complainers: Complainer[];
}

export interface OverallReport {
  total_complaints: number;
  resolved: number;
  pending: number;
  in_progress: number;
  anonymous_complaints_ratio: string;
  top_branches_by_complaints: BranchComplaintCount[];
  branch_with_highest_pending: BranchPendingInfo;
  most_frequent_complainers: Complainer[];
}

export interface Complainer {
  user_id: string;
  name: string;
  count: number;
}

export interface BranchComplaintCount {
  branch_code: string;
  branch_name: string;
  count: number;
}

export interface BranchPendingInfo {
  branch_code: string;
  branch_name: string;
  pending: number;
}
