// Mock to avoid the ESM error in TypeORM
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
}));

// Mock to avoid the ESM error in ConfigService
jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn((key: string) => {
      if (key === 'WOMPI_API_URL') return 'https://test-url.com';
      if (key === 'WOMPI_PRIVATE_KEY') return 'test-private-key';
      return 'test-secret';
    }),
  })),
}));

// Axios mockup
jest.mock('axios', () => ({
  post: jest.fn().mockRejectedValue(new Error('API Error')),
}));

import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockEventsService: { updateStock: jest.Mock };

  const mockTxRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    findOne: jest.fn().mockResolvedValue({ id: 1, status: 'PENDING' }),
  };

  const mockConfig = {
    get: jest.fn((key: string) => {
      if (key === 'WOMPI_API_URL') return 'https://test-url.com';
      if (key === 'WOMPI_PRIVATE_KEY') return 'test-private-key';
      return 'test-secret';
    }),
  };

  beforeEach(() => {
    mockEventsService = {
      updateStock: jest.fn().mockResolvedValue(true),
    };

    service = new TransactionsService(
      mockTxRepo as any,
      mockEventsService as any,
      mockConfig as any,
    );
  });

  it('should throw an error if data is missing', async () => {
    await expect(service.createCheckout({})).rejects.toThrow('Datos incompletos');
  });

  it('should confirm payment and update stock on success (APPROVED)', async () => {
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

  it('should update status to DECLINED if payment fails', async () => {
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

  it('should enter fallback (catch) when creating checkout fails', async () => {
    const result = await service.createCheckout({
      eventId: 1,
      quantity: 2,
      totalAmount: 10000,
      deliveryInfo: { email: 'test@test.com' },
    });
    expect(result.success).toBe(true);
  });
});