import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formService } from '../../services/formService';

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchSubmissions',
  async ({ formId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await formService.getSubmissions(formId, params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch submissions.');
    }
  }
);

export const deleteSubmission = createAsyncThunk(
  'submissions/deleteSubmission',
  async (submissionId, { rejectWithValue }) => {
    try {
      await formService.deleteSubmission(submissionId);
      return submissionId;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to delete submission.');
    }
  }
);

export const fetchSubmissionById = createAsyncThunk(
  'submissions/fetchSubmissionById',
  async (submissionId, { rejectWithValue }) => {
    try {
      const response = await formService.getSubmissionById(submissionId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch submission details.');
    }
  }
);

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState: {
    list: [],
    selectedSubmission: null,
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
    },
    status: 'idle',
    detailStatus: 'idle',
    error: null,
  },
  reducers: {
    clearSelectedSubmission: (state) => {
      state.selectedSubmission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSubmissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // deleteSubmission
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        if (state.selectedSubmission && state.selectedSubmission._id === action.payload) {
          state.selectedSubmission = null;
        }
      })
      // fetchSubmissionById
      .addCase(fetchSubmissionById.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedSubmission = action.payload;
      })
      .addCase(fetchSubmissionById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearSelectedSubmission } = submissionsSlice.actions;
export default submissionsSlice.reducer;
