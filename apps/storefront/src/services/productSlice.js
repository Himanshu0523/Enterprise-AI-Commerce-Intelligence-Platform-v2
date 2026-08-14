import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchTrendingProducts = createAsyncThunk(
  'products/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products/trending');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch trending products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products/featured');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchFlashSaleProducts = createAsyncThunk(
  'products/fetchFlashSale',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products/flash-sale');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch flash sale products');
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products/new-arrivals');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch new arrivals');
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'products/fetchRecommendations',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products/recommendations', { params: { productId } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

export const fetchSearchSuggestions = createAsyncThunk(
  'search/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      if (!query.trim()) return [];
      const response = await axios.get('/api/search/suggestions', { params: { q: query } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch suggestions');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/categories');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  products: {
    items: [],
    featured: [],
    trending: [],
    flashSale: [],
    newArrivals: [],
    recommendations: [],
    recentlyViewed: [],
    currentProduct: null,
    pagination: { page: 1, limit: 12, total: 0, pages: 1 },
    filters: { category: null, brands: [], priceMin: null, priceMax: null, rating: null, inStockOnly: false },
    sort: 'featured',
    loading: false,
    error: null,
  },
  categories: {
    items: [],
    currentCategory: null,
    subcategories: [],
    loading: false,
  },
  search: {
    query: '',
    suggestions: [],
    results: [],
    loading: false,
  },
};

const productSlice = createSlice({
  name: 'productStore',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.products.filters = { ...state.products.filters, ...action.payload };
      state.products.pagination.page = 1;
    },
    resetFilters(state) {
      state.products.filters = initialState.products.filters;
      state.products.pagination.page = 1;
    },
    setSort(state, action) {
      state.products.sort = action.payload;
    },
    setPage(state, action) {
      state.products.pagination.page = action.payload;
    },
    setSearchQuery(state, action) {
      state.search.query = action.payload;
    },
    clearSearchSuggestions(state) {
      state.search.suggestions = [];
    },
    addRecentlyViewed(state, action) {
      const product = action.payload;
      if (!product || !product.id) return;
      const filtered = state.products.recentlyViewed.filter((p) => p.id !== product.id);
      state.products.recentlyViewed = [product, ...filtered].slice(0, 10);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.items = action.payload.products || action.payload;
        if (action.payload.pagination) {
          state.products.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })
      // Featured
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.products.featured = action.payload;
      })
      // Trending
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.products.trending = action.payload;
      })
      // Flash Sale
      .addCase(fetchFlashSaleProducts.fulfilled, (state, action) => {
        state.products.flashSale = action.payload;
      })
      // New Arrivals
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.products.newArrivals = action.payload;
      })
      // Recommendations
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.products.recommendations = action.payload;
      })
      // Suggestions
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.search.loading = true;
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.suggestions = action.payload;
      })
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categories.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.items = action.payload;
      });
  },
});

export const {
  setFilter,
  resetFilters,
  setSort,
  setPage,
  setSearchQuery,
  clearSearchSuggestions,
  addRecentlyViewed,
} = productSlice.actions;

export default productSlice.reducer;
