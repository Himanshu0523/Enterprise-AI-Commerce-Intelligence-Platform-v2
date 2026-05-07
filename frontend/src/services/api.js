import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});


// BASIC 
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    
    return req;
} , 
    (error) => {
        return Promise.reject(error);
    }
);

// UPGRADE LEVEL
API.interceptors.response.use((res) => res ,
(error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
})


// export const saveCart = (data) => API.post("/card" , data);

// export const getCardByUser = (userId) => API.get(`/card/${userId}`);


// // Products 
// export const getProducts = () => API.get("/products");
// export const getProduct = (id) => API.get(`/products/${id}`);
// export const createProduct = (product) => API.post("/products", product);
// export const updateProduct = (id, product) => API.put(`/products/${id}`, product);
// export const deleteProduct = (id) => API.delete(`/products/${id}`);

// // Cart 
// export const getCart = () => API.get("/cart");
// export const addToCart = (product) => API.post("/cart", product);
// export const updateCart = (id, product) => API.put(`/cart/${id}`, product);
// export const deleteCart = (id) => API.delete(`/cart/${id}`);

// // Orders 
// export const getOrders = () => API.get("/orders");
// export const getOrder = (id) => API.get(`/orders/${id}`);
// export const createOrder = (order) => API.post("/orders", order);
// export const updateOrder = (id, order) => API.put(`/orders/${id}`, order);
// export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// // Users 
// export const getUsers = () => API.get("/users");
// export const getUser = (id) => API.get(`/users/${id}`);
// export const createUser = (user) => API.post("/users", user);
// export const updateUser = (id, user) => API.put(`/users/${id}`, user);
// export const deleteUser = (id) => API.delete(`/users/${id}`);

// // Auth 
// export const login = (user) => API.post("/auth/login", user);
// export const register = (user) => API.post("/auth/register", user);
// export const logout = () => API.post("/auth/logout");

// // Reviews 
// export const getReviews = () => API.get("/reviews");
// export const getReview = (id) => API.get(`/reviews/${id}`);
// export const createReview = (review) => API.post("/reviews", review);
// export const updateReview = (id, review) => API.put(`/reviews/${id}`, review);
// export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// // Categories 
// export const getCategories = () => API.get("/categories");
// export const getCategory = (id) => API.get(`/categories/${id}`);
// export const createCategory = (category) => API.post("/categories", category);
// export const updateCategory = (id, category) => API.put(`/categories/${id}`, category);
// export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// // Brands 
// export const getBrands = () => API.get("/brands");
// export const getBrand = (id) => API.get(`/brands/${id}`);
// export const createBrand = (brand) => API.post("/brands", brand);
// export const updateBrand = (id, brand) => API.put(`/brands/${id}`, brand);
// export const deleteBrand = (id) => API.delete(`/brands/${id}`);

// // Search 
// export const searchProducts = (query) => API.get(`/products/search?q=${query}`);

// // Filter 
// export const filterProducts = (filters) => API.get(`/products/filter?${new URLSearchParams(filters)}`);

// // Sort 
// export const sortProducts = (sort) => API.get(`/products/sort?${new URLSearchParams(sort)}`);

// // Pagination 
// export const getProductsByPage = (page) => API.get(`/products/page/${page}`);

// export const getRecommendations = (userId) => API.get(`/recommendations/${userId}`);

export default API;