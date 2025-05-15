import api from './api';
import { BranchSupervisor, User } from '../types';

export const createSupervisor = async (
  userData: User, 
  branchCode: string
): Promise<BranchSupervisor> => {
  const response = await api.post('/branch-supervisor', {
    user: userData,
    branchCode
  });
  return response.data;
};

export const getAllSupervisors = async (): Promise<BranchSupervisor[]> => {
  const response = await api.get('/branch-supervisor');
  return response.data;
};

export const getSupervisorById = async (id: string): Promise<BranchSupervisor> => {
  const response = await api.get(`/branch-supervisor/${id}`);
  return response.data;
};

export const updateSupervisor = async (
  id: string, 
  data: Partial<BranchSupervisor>
): Promise<BranchSupervisor> => {
  const response = await api.put(`/branch-supervisor/${id}`, data);
  return response.data;
};

export const deleteSupervisor = async (id: string): Promise<void> => {
  await api.delete(`/branch-supervisor/${id}`);
};