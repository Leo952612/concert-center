// Mock de @nestjs/typeorm para evitar errores de ESM
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
}));

// Mock de @nestjs/config para evitar errores de ESM
jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn(() => 'test-value'),
  })),
}));

// Mock de axios
jest.mock('axios', () => ({
  post: jest.fn().mockRejectedValue(new Error('API Error')),
  get: jest.fn().mockResolvedValue({ data: { data: { status: 'APPROVED' } } }),
}));

import { TransactionsService } from './transactions.service';

// ⬇️ DEFINIMOS EL MOCK CONFIG GLOBALMENTE (para que nunca sea undefined)
const mockConfig = {
  get: jest.fn((key: string) => {
    if (key === 'WOMPI_API_URL') return 'https://test-url.com';
    if (key === 'WOMPI_PRIVATE_KEY') return 'test-private-key';
    return 'test-secret';
  }),
};

const mockTxRepo = {
  create: jest.fn((dto) => dto),
  save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
  findOne: jest.fn(),
};

let mockEventsService: { updateStock: jest.Mock };

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    mockEventsService = {
      updateStock: jest.fn().mockResolvedValue(true),
    };

    // ⬇️ PASAMOS LOS TRES MOCKS AL CONSTRUCTOR
    service = new TransactionsService(
      mockTxRepo as any,
      mockEventsService as any,
      mockConfig as any,
    );
  });

  it('debería lanzar error si faltan datos', async () => {
    await expect(service.createCheckout({})).rejects.toThrow('Datos incompletos');
  });

  it('debería confirmar el pago y actualizar stock en caso de éxito (APPROVED)', async () => {
    mockTxRepo.findOne.mockResolvedValue({ id: 1, status: 'PENDING' });
    const result = await service.confirmPayment({
      reference: 'test-1',
      status: 'APPROVED',
      wompiTransactionId: 'wm-1',
      eventId: 1,
      quantity: 2,
    });
    expect(result.success).toBe(true);
    expect(mockEventsService.updateStock).toHaveBeenCalledWith(1, 2);
  });

  it('debería actualizar estado a DECLINED si el pago falla', async () => {
    mockTxRepo.findOne.mockResolvedValue({ id: 1, status: 'PENDING' });
    const result = await service.confirmPayment({
      reference: 'test-1',
      status: 'DECLINED',
      wompiTransactionId: null,
      eventId: 1,
      quantity: 2,
    });
    expect(result.success).toBe(true);
    expect(mockEventsService.updateStock).not.toHaveBeenCalled();
  });

  it('debería entrar en el fallback (catch) cuando la API falla', async () => {
    const result = await service.createCheckout({
      eventId: 1,
      quantity: 2,
      totalAmount: 10000,
      deliveryInfo: { email: 'test@test.com' },
    });
    expect(result.success).toBe(true);
  });
});