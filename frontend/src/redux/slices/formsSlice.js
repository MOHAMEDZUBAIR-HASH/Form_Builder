import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formService } from '../../services/formService';

export const fetchForms = createAsyncThunk(
  'forms/fetchForms',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await formService.getForms(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch forms.');
    }
  }
);

export const deleteForm = createAsyncThunk(
  'forms/deleteForm',
  async (formId, { rejectWithValue }) => {
    try {
      await formService.deleteForm(formId);
      return formId;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to delete form.');
    }
  }
);

const formsSlice = createSlice({
  name: 'forms',
  initialState: {
    list: [],
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearFormsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchForms
      .addCase(fetchForms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // deleteForm
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.list = state.list.filter((f) => f._id !== action.payload);
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
      });
  },
});

export const { clearFormsError } = formsSlice.actions;
export default formsSlice.reducer;
