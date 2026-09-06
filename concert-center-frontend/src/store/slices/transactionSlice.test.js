import { configureStore } from '@reduxjs/toolkit';
import transactionReducer, {
  startTransaction,
  processingTransaction,
  completeTransaction,
  resetTransaction,
} from './transactionSlice';

describe('transactionSlice (Redux)', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        transaction: transactionReducer,
      },
    });
  });

  it('debería tener el estado inicial correcto', () => {
    const state = store.getState().transaction;
    expect(state.transactionId).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.result).toBeNull();
    expect(state.createdAt).toBeNull();
  });

  it('debería iniciar una transacción en estado PENDING', () => {
    store.dispatch(startTransaction('txn-98765'));
    const state = store.getState().transaction;
    expect(state.transactionId).toBe('txn-98765');
    expect(state.status).toBe('pending');
    expect(state.createdAt).toEqual(expect.any(String)); // Verifica que se haya creado una fecha
  });

  it('debería pasar al estado PROCESSING', () => {
    store.dispatch(startTransaction('txn-98765'));
    store.dispatch(processingTransaction());
    expect(store.getState().transaction.status).toBe('processing');
  });

  it('debería completar la transacción con el estado y resultado', () => {
    const mockResult = { status: 'APPROVED', id: 'wm-123' };
    store.dispatch(completeTransaction(mockResult));
    const state = store.getState().transaction;
    expect(state.status).toBe('APPROVED');
    expect(state.result).toEqual(mockResult);
  });

  it('debería resetear el estado a IDLE', () => {
    store.dispatch(startTransaction('txn-98765'));
    store.dispatch(completeTransaction({ status: 'APPROVED', id: 'wm-123' }));
    store.dispatch(resetTransaction());
    
    const state = store.getState().transaction;
    expect(state.transactionId).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.result).toBeNull();
    expect(state.createdAt).toBeNull();
  });
});