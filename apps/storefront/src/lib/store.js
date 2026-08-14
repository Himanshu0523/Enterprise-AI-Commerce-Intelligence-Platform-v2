// apps/storefront/src/lib/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: null,   // or { id: null, name: '' } etc.
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

// Export actions if needed
export const { setUser, clearUser } = userSlice.actions;

// Create store – reducer must be an object of slice reducers
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    // other reducers go here
  },
});