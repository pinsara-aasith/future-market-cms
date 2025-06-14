import api from './api';
import { User, AuthResponse } from '../types';

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (userData: User): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const registerCustomer = async (userData: User, eCardHolder: boolean): Promise<AuthResponse> => {
  console.log('Registering customer with data:', userData, 'eCardHolder:', eCardHolder);
  const response = await api.post('/customer/register', {
    user: userData,
    eCardHolder
  });
  console.log('Register customer response:', response);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data?.user;
};