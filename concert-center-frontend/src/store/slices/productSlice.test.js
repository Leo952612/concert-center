import { configureStore } from '@reduxjs/toolkit';
import productReducer, { setProducts, setLoading, setError } from './productSlice';

describe('productSlice (Redux)', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        product: productReducer,
      },
    });
  });

  it('debería tener el estado inicial correcto', () => {
    const state = store.getState().product;
    expect(state.products).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('debería cargar los productos', () => {
    const mockProducts = [{ id: 1, name: 'Concierto' }];
    store.dispatch(setProducts(mockProducts));
    expect(store.getState().product.products).toEqual(mockProducts);
  });

  it('debería cambiar el estado de loading', () => {
    store.dispatch(setLoading(true));
    expect(store.getState().product.loading).toBe(true);
  });

  it('debería guardar un error', () => {
    store.dispatch(setError('Error de conexión'));
    expect(store.getState().product.error).toBe('Error de conexión');
  });
});