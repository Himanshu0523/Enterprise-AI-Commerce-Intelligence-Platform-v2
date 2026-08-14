import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  saveForLater,
  getSavedItems,
  moveToCart,
  applyCoupon,
  removeCoupon,
  getCartSummary,
} from './cartService';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, variant }, { rejectWithValue }) => {
    try {
      const response = await addToCart(productId, quantity, variant);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await updateCartItem(itemId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item quantity');
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await removeCartItem(itemId);
      return { itemId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

export const applyCouponAsync = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await applyCoupon(couponCode);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply coupon');
    }
  }
);

export const removeCouponAsync = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const response = await removeCoupon();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove coupon');
    }
  }
);

export const fetchSavedItems = createAsyncThunk(
  'cart/fetchSavedItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSavedItems();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved items');
    }
  }
);

export const saveForLaterAsync = createAsyncThunk(
  'cart/saveForLater',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await saveForLater(itemId);
      return { itemId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save item for later');
    }
  }
);

export const moveToCartAsync = createAsyncThunk(
  'cart/moveToCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await moveToCart(itemId);
      return { itemId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move item back to cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // [{ id, productId, name, price, quantity, image, variant }]
    savedItems: [],
    coupon: null,
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Local mutations for fast feedback (optional/optimistic)
    setCartLocal: (state, action) => {
      const { items, subtotal, discount, total } = action.payload;
      state.items = items || [];
      state.subtotal = subtotal || 0;
      state.discount = discount || 0;
      state.total = total || 0;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.coupon = action.payload.coupon || null;
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shipping = action.payload.shipping || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add To Cart
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shipping = action.payload.shipping || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Cart Item
    builder
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shipping = action.payload.shipping || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Remove Cart Item
    builder
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload.data.items || [];
        state.subtotal = action.payload.data.subtotal || 0;
        state.discount = action.payload.data.discount || 0;
        state.shipping = action.payload.data.shipping || 0;
        state.tax = action.payload.data.tax || 0;
        state.total = action.payload.data.total || 0;
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Clear Cart
    builder
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.coupon = null;
        state.subtotal = 0;
        state.discount = 0;
        state.shipping = 0;
        state.tax = 0;
        state.total = 0;
      });

    // Apply Coupon
    builder
      .addCase(applyCouponAsync.fulfilled, (state, action) => {
        state.coupon = action.payload.coupon || null;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shipping = action.payload.shipping || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(applyCouponAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Remove Coupon
    builder
      .addCase(removeCouponAsync.fulfilled, (state, action) => {
        state.coupon = null;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shipping = action.payload.shipping || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      });

    // Fetch Saved Items
    builder
      .addCase(fetchSavedItems.fulfilled, (state, action) => {
        state.savedItems = action.payload || [];
      });

    // Save For Later
    builder
      .addCase(saveForLaterAsync.fulfilled, (state, action) => {
        state.items = action.payload.data.items || [];
        state.subtotal = action.payload.data.subtotal || 0;
        state.discount = action.payload.data.discount || 0;
        state.shipping = action.payload.data.shipping || 0;
        state.tax = action.payload.data.tax || 0;
        state.total = action.payload.data.total || 0;
        // Re-fetch or locally push if returned
      });

    // Move to Cart
    builder
      .addCase(moveToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.data.items || [];
        state.subtotal = action.payload.data.subtotal || 0;
        state.discount = action.payload.data.discount || 0;
        state.shipping = action.payload.data.shipping || 0;
        state.tax = action.payload.data.tax || 0;
        state.total = action.payload.data.total || 0;
      });
  },
});

export const { setCartLocal, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
