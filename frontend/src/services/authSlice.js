import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout as logoutAPI,
  sendResetOTP,    
  verifyOTP,
  resetPassword,
} from "./authService";

// Async login
export const loginUser = createAsyncThunk(
    "auth/loginUser" ,
    async (userData , {rejectWithValue}) => {
        try {
            const response = await login(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);

// Async register
export const registerUser = createAsyncThunk(
    "auth/registerUser" ,
    async (userData , {rejectWithValue}) => {
        try {
            const response = await register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Registration failed");
        }
    }
);

// Async logout 
export const logoutUser = createAsyncThunk(
    "auth/logoutUser" ,
    async (_ , {rejectWithValue}) => {
        try {
            await logoutAPI();
            return true;
        }catch(error) {
            return rejectWithValue(error.response?.data || "Logout failed");
        }
    } 
);

const getInitialUser = () => {
    try {
        const item = localStorage.getItem("user");
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return null;
    }
};

export const sendPasswordResetOTP = createAsyncThunk(
    "auth/sendPasswordResetOTP",
    async (data, { rejectWithValue }) => {
        try {
            const response = await sendResetOTP(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to send OTP");
    }
}
);

export const verifyPasswordResetOTP = createAsyncThunk(
  "auth/verifyPasswordResetOTP",
  async (data, { rejectWithValue }) => {
      try {
          const response = await verifyOTP(data);
          return response.data; // { success: true, token: "..." }
        } catch (error) {
            return rejectWithValue(error.response?.data || "OTP verification failed");
        }
  }
);


export const resetUserPassword = createAsyncThunk(
    "auth/resetUserPassword",
    async (data, { rejectWithValue }) => {
        try {
            const response = await resetPassword(data);
            return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password reset failed");
    }
}
);

const initialState = {
    user: getInitialUser(),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};


const authSlice = createSlice({
    name: "auth" ,
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder    
            // login
            .addCase(loginUser.pending , (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled , (state , action) => {
                state.loading = false;

                state.user = action.payload.user;
                state.token = action.payload.token;
                
                localStorage.setItem("token" , action.payload.token);
                localStorage.setItem("user" , JSON.stringify(action.payload.user));
            })

            .addCase(loginUser.rejected , (state , action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // register
            .addCase(registerUser.pending , (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled , (state , action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                
                localStorage.setItem("token" , action.payload.token);
                localStorage.setItem("user" , JSON.stringify(action.payload.user));
            })

            .addCase(registerUser.rejected , (state , action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(logoutUser.fulfilled , (state) => {
                state.user = null;
                state.error = null;
                state.token = null;

                localStorage.removeItem("token");
                localStorage.removeItem("user");
            })
            
            .addCase(logoutUser.rejected , (state, action) => {
                // Clear state anyway to force logout on frontend
                state.user = null;
                state.error = action.payload || "Logout failed";
                state.token = null;

                localStorage.removeItem("token");
                localStorage.removeItem("user");
            })

            .addCase(verifyPasswordResetOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(verifyPasswordResetOTP.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Reset Password ---
            .addCase(resetUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(resetUserPassword.fulfilled, (state) => {
                state.loading = false;
            })
            
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    } ,
});

export default authSlice.reducer;