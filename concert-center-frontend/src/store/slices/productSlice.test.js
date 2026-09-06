import { configureStore } from '@reduxjs/toolkit';
import productReducer, { 
  setProducts, 
  setLoading, 
  setError,
  // Si tienes una acción para resetear, agrégala aquí (ej: resetProducts)
} from './productSlice';

describe('productSlice (Redux)', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { product: productReducer },
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
    expect(store.getState().product.loading).toBe(false); // Asegúrate de que al cargar termine el loading
  });

  it('debería activar el estado de carga (loading)', () => {
    store.dispatch(setLoading(true));
    expect(store.getState().product.loading).toBe(true);
  });

  it('debería guardar un error', () => {
    store.dispatch(setError('Error al obtener datos'));
    const state = store.getState().product;
    expect(state.error).toBe('Error al obtener datos');
    expect(state.loading).toBe(false);
  });

  // Test para cubrir la rama que no se está probando (por ejemplo, si limpias el error)
  it('debería limpiar el error si se reciben productos', () => {
    store.dispatch(setError('Error'));
    store.dispatch(setProducts([{ id: 1 }]));
    expect(store.getState().product.error).toBeNull();
  });
});