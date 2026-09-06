import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('concertState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem('concertState', JSON.stringify(state));
  } catch (err) {
    console.error("Error guardando estado", err);
  }
};

const initialState = loadState() || {
  product: null,
  quantity: 1,
  deliveryInfo: null,
  paymentInfo: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
      state.quantity = 1;
      saveState(state);
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
      saveState(state);
    },
    setDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
      saveState(state);
    },
    setPaymentInfo: (state, action) => {
      state.paymentInfo = action.payload;
      saveState(state);
    },
    resetCheckout: (state) => {
      state.product = null;
      state.quantity = 1;
      state.deliveryInfo = null;
      state.paymentInfo = null;
      localStorage.removeItem('concertState');
    },
  },
});

export const { setProduct, setQuantity, setDeliveryInfo, setPaymentInfo, resetCheckout } = cartSlice.actions;
export default cartSlice.reducer;