'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../services/authSlice';
import cartReducer from '../services/cartSlice';
import productReducer from '../services/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    productStore: productReducer,
  },
});