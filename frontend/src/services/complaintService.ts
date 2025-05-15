import api from './api';
import { Complaint, ComplaintAction, ComplaintStatus } from '../types';

export const createComplaint = async (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'actionsTaken'>): Promise<Complaint> => {
  const response = await api.post('/complaint', complaintData);
  return response.data;
};

export const createAnonymousComplaint = async (complaintData: Omit<Complaint, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'status' | 'actionsTaken'>): Promise<Complaint> => {
  const response = await api.post('/complaint/anonymous', complaintData);
  return response.data;
};

export const getComplaintStatus = async (id: string): Promise<Complaint> => {
  const response = await api.get(`/complaint/status/${id}`);
  return response.data;
};

export const getUserComplaints = async (): Promise<Complaint[]> => {
  const response = await api.get('/complaint/my-complaints');
  return response.data;
};

export const getBranchComplaints = async (branchCode: string): Promise<Complaint[]> => {
  const response = await api.get(`/complaint/branch/${branchCode}`);
  return response.data;
};

export const updateComplaintStatus = async (id: string, status: ComplaintStatus): Promise<Complaint> => {
  const response = await api.patch(`/complaint/${id}/status`, { status });
  return response.data;
};

export const addComplaintAction = async (id: string, description: string): Promise<ComplaintAction> => {
  const response = await api.post(`/complaint/${id}/actions`, { description });
  return response.data;
};

export const getAllComplaints = async (): Promise<Complaint[]> => {
  const response = await api.get('/complaint');
  return response.data;
};