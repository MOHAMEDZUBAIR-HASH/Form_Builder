import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminLogin, adminRegister, logoutAdmin, getAdminProfile } from '../../services/authService';

/**
 * 100% Pure HttpOnly Cookie Auth Slice
 * Zero tokens stored in localStorage (Protected against XSS attacks)
 */

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await adminLogin(credentials);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.message || err.customMessage || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminRegister(userData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.message || err.customMessage || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      // Ignore network errors on logout
    }
    return true;
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminProfile();
      return response.data.data;
    } catch (err) {
      return rejectWithValue('Not authenticated');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isInitialized: false, // true once initial cookie verification check completes
    status: 'idle',
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
        state.isInitialized = true;
      })
      // checkAuthStatus on page load
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isInitialized = true;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
