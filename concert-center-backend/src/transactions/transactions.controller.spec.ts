import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
}));

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn(() => 'test-value'),
  })),
}));

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

  it('should create a checkout', async () => {
    const body = { eventId: 1 };
    expect(await controller.createCheckout(body)).toEqual({ success: true, paymentUrl: 'url' });
  });

  it('should query status', async () => {
    expect(await controller.getStatus('123')).toEqual({ success: true, status: 'APPROVED' });
  });

  it('should confirm payment', async () => {
    const body = { status: 'APPROVED' };
    expect(await controller.confirmPayment(body)).toEqual({ success: true });
  });
});