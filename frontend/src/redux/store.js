import { configureStore } from '@reduxjs/toolkit';
import formsReducer from './slices/formsSlice';
import formBuilderReducer from './slices/formBuilderSlice';
import submissionsReducer from './slices/submissionsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forms: formsReducer,
    formBuilder: formBuilderReducer,
    submissions: submissionsReducer,
  },
});

export default store;
