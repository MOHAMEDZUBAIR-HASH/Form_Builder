import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formService } from '../../services/formService';

/**
 * Async Thunk to Create or Update a Form Schema
 */
export const saveForm = createAsyncThunk(
  'formBuilder/saveForm',
  async ({ formId, formData }, { rejectWithValue }) => {
    try {
      if (formId) {
        const response = await formService.updateForm(formId, formData);
        return response.data;
      } else {
        const response = await formService.createForm(formData);
        return response.data;
      }
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to save form.');
    }
  }
);

/**
 * Async Thunk to Fetch an Existing Form Definition for Editing
 */
export const fetchFormForEdit = createAsyncThunk(
  'formBuilder/fetchFormForEdit',
  async (formId, { rejectWithValue }) => {
    try {
      const response = await formService.getFormById(formId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to fetch form definition.');
    }
  }
);

/**
 * Current Streamlined Form Schema:
 * Only holds name, slug, description, status, and dynamic fields
 */
const initialFormState = {
  name: '',
  slug: '',
  description: '',
  status: 'draft',
  fields: [],
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState: {
    currentForm: initialFormState,
    selectedFieldIndex: null,
    status: 'idle',
    saveStatus: 'idle',
    error: null,
    saveSuccess: false,
  },
  reducers: {
    resetFormBuilder: (state) => {
      state.currentForm = initialFormState;
      state.selectedFieldIndex = null;
      state.status = 'idle';
      state.saveStatus = 'idle';
      state.error = null;
      state.saveSuccess = false;
    },
    setFormMeta: (state, action) => {
      state.currentForm = {
        ...state.currentForm,
        ...action.payload,
      };
    },
    addField: (state, action) => {
      const fieldType = action.payload || 'text';
      const keySuffix = Date.now().toString().slice(-4);
      const newField = {
        key: `field_${keySuffix}`,
        label: `New ${fieldType.toUpperCase()} Field`,
        type: fieldType,
        required: false,
        placeholder: '',
        defaultValue: '',
        options: ['select', 'radio', 'checkbox'].includes(fieldType) ? ['Option 1', 'Option 2'] : [],
        validation: {
          minLength: null,
          maxLength: null,
          min: null,
          max: null,
          pattern: null,
          allowedExtensions: fieldType === 'file' ? 'image/*, .pdf, .docx' : '',
        },
        order: state.currentForm.fields.length,
      };
      state.currentForm.fields.push(newField);
      state.selectedFieldIndex = state.currentForm.fields.length - 1;
    },
    updateField: (state, action) => {
      const { index, field } = action.payload;
      if (state.currentForm.fields[index]) {
        state.currentForm.fields[index] = {
          ...state.currentForm.fields[index],
          ...field,
        };
      }
    },
    deleteField: (state, action) => {
      const indexToDelete = action.payload;
      state.currentForm.fields.splice(indexToDelete, 1);
      // Re-order remaining fields sequentially
      state.currentForm.fields.forEach((f, idx) => {
        f.order = idx;
      });
      if (state.selectedFieldIndex === indexToDelete) {
        state.selectedFieldIndex = null;
      } else if (state.selectedFieldIndex > indexToDelete) {
        state.selectedFieldIndex -= 1;
      }
    },
    reorderFields: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.currentForm.fields.length ||
        toIndex >= state.currentForm.fields.length
      ) {
        return;
      }
      const [movedItem] = state.currentForm.fields.splice(fromIndex, 1);
      state.currentForm.fields.splice(toIndex, 0, movedItem);
      // Update order property sequentially
      state.currentForm.fields.forEach((f, idx) => {
        f.order = idx;
      });
      state.selectedFieldIndex = toIndex;
    },
    selectField: (state, action) => {
      state.selectedFieldIndex = action.payload;
    },
    clearSaveSuccess: (state) => {
      state.saveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFormForEdit
      .addCase(fetchFormForEdit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFormForEdit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentForm = {
          name: action.payload.name || '',
          slug: action.payload.slug || '',
          description: action.payload.description || '',
          status: action.payload.status || 'draft',
          fields: action.payload.fields || [],
        };
        state.selectedFieldIndex = action.payload.fields?.length > 0 ? 0 : null;
      })
      .addCase(fetchFormForEdit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // saveForm
      .addCase(saveForm.pending, (state) => {
        state.saveStatus = 'loading';
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(saveForm.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.currentForm = action.payload.data;
        state.saveSuccess = true;
      })
      .addCase(saveForm.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  resetFormBuilder,
  setFormMeta,
  addField,
  updateField,
  deleteField,
  reorderFields,
  selectField,
  clearSaveSuccess,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
