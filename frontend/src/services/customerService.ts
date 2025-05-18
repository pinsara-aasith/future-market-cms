import api from './api';
import { Customer, User } from '../types';

export const registerCustomer = async (userData: User): Promise<Customer> => {
  const response = await api.post('/customer/register', userData);
  return response.data?.customer;
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await api.get('/customer');
  return response.data?.customers;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await api.get(`/customer/${id}`);
  return response.data?.customer;
};

export const updateCustomerProfile = async (
  id: string, 
  data: Partial<Customer>
): Promise<Customer> => {
  const response = await api.put(`/customer/${id}`, data);
  return response.data?.customer;
};

export const updateCustomerECard = async (
  id: string, 
  eCardData: unknown
): Promise<Customer> => {
  const response = await api.patch(`/customer/${id}/ecard`, eCardData);
  return response.data?.customer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/customer/${id}`);
};