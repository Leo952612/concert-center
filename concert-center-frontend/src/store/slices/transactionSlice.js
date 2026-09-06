import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactionId: null,
  status: 'idle', // idle | pending | processing | success | failed
  result: null,
  createdAt: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    startTransaction: (state, action) => {
      state.transactionId = action.payload;
      state.status = 'pending';
      state.createdAt = new Date().toISOString();
    },
    processingTransaction: (state) => {
      state.status = 'processing';
    },
    completeTransaction: (state, action) => {
      state.status = action.payload.status;
      state.result = action.payload;
    },
    resetTransaction: (state) => {
      state.transactionId = null;
      state.status = 'idle';
      state.result = null;
      state.createdAt = null;
    },
  },
});

export const { startTransaction, processingTransaction, completeTransaction, resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;