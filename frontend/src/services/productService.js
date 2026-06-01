import API from "./api";

//  Helpers 
const helperParams = (params = {}) => {
    return Object.fromEntries(
        Object.entries(params).filter(([,value]) => value !== null && value !== undefined && 
        value !== ""
        )
    );
};

// export const getProducts = () => API.get("/products");
export const getProducts = async (params = {}) => {
    try {
        const response = await API.get("/products" , {
            params : helperParams(params)
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products" ,error);
        throw error;
    }
};

// export const getProduct = (id) => API.get(`/products/${id}`);
export const getProduct = async (id) => {
    try {
        if (!id) throw new Error("Product ID required");
        const res = await API.get(`/products/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching product" ,error);
        throw error;
    }
};

// export const createProduct = (product) => API.post("/products", product);
export const createProduct = async (productData) => {
  try {
    if (!productData) {
        throw new Error("Product data is required")
    }
    const response = await API.post("/products" , productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product" ,error);
    throw error;
  }
};

// export const updateProduct = (id, product) => API.put(`/products/${id}`, product);
export const updateProduct = async (id, product) => {
  const res = await API.put(`/products/${id}`, product);
  return res.data;
};

// export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

// export const searchProducts = (query) => API.get("/products/search" , {params: { q: query}});
export const searchProducts = async (query) => {
  const res = await API.get("/products/search" , {params: { q: query}});
  return res.data;
};

// export const filterProducts = (filters) => API.get("/products/filter" , {params: filters});
export const filterProducts = async (filters) => {
  const res = await API.get("/products/filter" , {params: filters});
  return res.data;
};

// export const sortProducts = (sort) => API.get("/products/sort" , {params: { sort }});
export const sortProducts = async (sort) => {
  const res = await API.get("/products/sort" , {params: { sort }});
  return res.data;
};

// export const getProductsByPage = (page) => API.get(`/products/page/${page}`);   
export const getProductsByPage = async (page) => {
  const res = await API.get(`/products/page/${page}`);
  return res.data;
};

export const getMyProducts = async (params = {}) => {
  try {
    const response = await API.get("/products/my-products", {
      params: helperParams(params)
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my products", error);
    throw error;
  }
};

export const getMyStats = async (params = {}) => {
  try {
    const response = await API.get("/products/my-stats", {
      params: helperParams(params)
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my stats", error);
    throw error;
  }
};