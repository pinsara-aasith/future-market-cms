import api from './api';
import { Branch } from '../types';

export const getAllBranches = async (): Promise<Branch[]> => {
  const response = await api.get('/branch');
  return response.data?.branches;
};

export const getBranchById = async (_id: string): Promise<Branch> => {
  const response = await api.get(`/branch/${_id}`);
  console.log(response.data)
  return response.data?.branch;
};

export const createBranch = async (branchData: Branch): Promise<Branch> => {
  const response = await api.post('/branch', branchData);
  return response.data?.branch;
};

export const updateBranch = async (_id: string, branchData: Branch): Promise<Branch> => {
  const response = await api.put(`/branch/${_id}`, branchData);
  return response.data?.branch;
};

export const deleteBranch = async (_id: string): Promise<void> => {
  await api.delete(`/branch/${_id}`);
};