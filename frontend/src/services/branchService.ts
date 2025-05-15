import api from './api';
import { Branch } from '../types';

export const getAllBranches = async (): Promise<Branch[]> => {
  const response = await api.get('/branch');
  return response.data;
};

export const getBranchById = async (id: string): Promise<Branch> => {
  const response = await api.get(`/branch/${id}`);
  return response.data;
};

export const createBranch = async (branchData: Branch): Promise<Branch> => {
  const response = await api.post('/branch', branchData);
  return response.data;
};

export const updateBranch = async (id: string, branchData: Branch): Promise<Branch> => {
  const response = await api.put(`/branch/${id}`, branchData);
  return response.data;
};

export const deleteBranch = async (id: string): Promise<void> => {
  await api.delete(`/branch/${id}`);
};