import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  setProduct,
  setQuantity,
  setDeliveryInfo,
  setPaymentInfo,
  resetCheckout,
} from './cartSlice';

describe('cartSlice (Redux)', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  });

  it('debería tener el estado inicial correcto', () => {
    const state = store.getState().cart;
    expect(state.product).toBeNull();
    expect(state.quantity).toBe(1);
    expect(state.deliveryInfo).toBeNull();
    expect(state.paymentInfo).toBeNull();
  });

  it('debería agregar un producto y reiniciar la cantidad a 1', () => {
    store.dispatch(setProduct({ id: 1, name: 'Concierto Test', price: 50000 }));
    const state = store.getState().cart;
    expect(state.product.name).toBe('Concierto Test');
    expect(state.quantity).toBe(1);
  });

  it('debería actualizar la cantidad', () => {
    store.dispatch(setProduct({ id: 1, name: 'Concierto Test', price: 50000 }));
    store.dispatch(setQuantity(3));
    expect(store.getState().cart.quantity).toBe(3);
  });

  it('debería guardar los datos de envío y pago', () => {
    store.dispatch(setDeliveryInfo({ fullName: 'Leo', address: 'Cra 1' }));
    store.dispatch(setPaymentInfo({ cardNumber: '4242' }));

    const state = store.getState().cart;
    expect(state.deliveryInfo.fullName).toBe('Leo');
    expect(state.paymentInfo.cardNumber).toBe('4242');
  });

  it('debería limpiar todo el estado al hacer resetCheckout', () => {
    store.dispatch(setProduct({ id: 1, name: 'Concierto Test', price: 50000 }));
    store.dispatch(setQuantity(5));
    store.dispatch(resetCheckout());

    const state = store.getState().cart;
    expect(state.product).toBeNull();
    expect(state.quantity).toBe(1);
  });
});