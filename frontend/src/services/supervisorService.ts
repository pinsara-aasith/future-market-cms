import api from './api';
import { BranchSupervisor } from '../types';

export const createSupervisor = async (
  supervisor: BranchSupervisor
): Promise<BranchSupervisor> => {
  const response = await api.post('/branch-supervisor', {
    ...supervisor
  });
  return response.data?.supervisor;
};

export const getAllSupervisors = async (): Promise<BranchSupervisor[]> => {
  const response = await api.get('/branch-supervisor');
  return response.data?.supervisors;
};

export const getSupervisorById = async (id: string): Promise<BranchSupervisor> => {
  const response = await api.get(`/branch-supervisor/${id}`);
  return response.data?.supervisor;
};

export const updateSupervisor = async (
  id: string, 
  data: Partial<BranchSupervisor>
): Promise<BranchSupervisor> => {
  const response = await api.put(`/branch-supervisor/${id}`, data);
  return response.data?.supervisor;
};

export const deleteSupervisor = async (id: string): Promise<void> => {
  await api.delete(`/branch-supervisor/${id}`);
};