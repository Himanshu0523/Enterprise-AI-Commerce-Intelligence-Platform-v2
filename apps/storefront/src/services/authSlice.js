import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for login (if you use credentials provider)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for logout (calls NextAuth signOut optionally)
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // If using NextAuth, sign out from that session too
    await fetch('/api/auth/signout', { method: 'POST' }); // NextAuth signout
    // Then clear Redux
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Action to manually set user (e.g., from NextAuth session)
    syncSession: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { syncSession, clearError } = authSlice.actions;
export default authSlice.reducer;