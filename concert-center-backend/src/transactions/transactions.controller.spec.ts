// Mock para evitar el error de ESM en TypeORM
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
}));

// Mock para evitar el error de ESM en ConfigService
jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn(() => 'test-value'),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockService = {
    createCheckout: jest.fn().mockResolvedValue({ success: true, paymentUrl: 'url' }),
    getStatus: jest.fn().mockResolvedValue({ success: true, status: 'APPROVED' }),
    confirmPayment: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('debería crear un checkout', async () => {
    const body = { eventId: 1 };
    expect(await controller.createCheckout(body)).toEqual({ success: true, paymentUrl: 'url' });
  });

  it('debería consultar el estado', async () => {
    expect(await controller.getStatus('123')).toEqual({ success: true, status: 'APPROVED' });
  });

  it('debería confirmar el pago', async () => {
    const body = { status: 'APPROVED' };
    expect(await controller.confirmPayment(body)).toEqual({ success: true });
  });
});