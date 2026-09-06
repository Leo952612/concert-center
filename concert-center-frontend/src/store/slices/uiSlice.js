import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isBackdropOpen: false,
  isLoading: false,
  error: null,
  currentStep: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openBackdrop: (state) => {
      state.isBackdropOpen = true;
    },
    closeBackdrop: (state) => {
      state.isBackdropOpen = false;
    },
    toggleBackdrop: (state) => {
      state.isBackdropOpen = !state.isBackdropOpen;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
});

export const {
  openBackdrop,
  closeBackdrop,
  toggleBackdrop,
  setLoading,
  setError,
  clearError,
  setStep,
} = uiSlice.actions;

export default uiSlice.reducer; // ✅ ESTA LÍNEA DEBE EXISTIR