import API from "./api";

// Get all users (admin)
export const getUsers = () =>
  API.get("/users");

// Get single user
export const getUser = (id) =>
  API.get(`/users/${id}`);

// Update profile
export const updateUser = (id, data) =>
  API.put(`/users/${id}`, data);

// Update user role (admin)
export const updateUserRole = (id, role) =>
  API.put(`/users/${id}/role`, { role });

// Delete user
export const deleteUser = (id) =>
  API.delete(`/users/${id}`);

export const getAllUser = (id) => {
  try {
    const res = API.get(`/users/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};