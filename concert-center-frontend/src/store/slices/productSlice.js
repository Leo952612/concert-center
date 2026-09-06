import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    updateStock: (state, action) => {
      const { productId, newStock } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stock = newStock;
      }
      if (state.selectedProduct?.id === productId) {
        state.selectedProduct.stock = newStock;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setProducts, selectProduct, updateStock, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;