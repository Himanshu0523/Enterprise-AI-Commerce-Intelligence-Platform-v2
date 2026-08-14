import axios from 'axios';

export const updateUser = async (userId, data) => {
  return axios.put(`/api/users/${userId}`, data);
};

export const getUserProfile = async (userId) => {
  return axios.get(`/api/users/${userId}`);
};