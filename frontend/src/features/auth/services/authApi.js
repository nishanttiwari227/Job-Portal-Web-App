import apiClient from '../../../services/apiClient.js';

const login = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};

const register = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

const verifyEmail = async (token) => {
  const response = await apiClient.get('/auth/verify-email', { params: { token } });
  return response.data;
};

const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export { login, register, verifyEmail, logout };
