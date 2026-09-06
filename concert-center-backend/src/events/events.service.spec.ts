// Mock para evitar el error de ESM en TypeORM
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
}));

import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;

  const mockRepo = {
    find: jest.fn().mockResolvedValue([{ id: 1, name: 'Test', stock: 10 }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test', stock: 10 }),
    save: jest.fn().mockImplementation((e) => Promise.resolve(e)),
  };

  beforeEach(() => {
    // Direct instantiation without a NestJS container (avoids DI and ESM errors)
    service = new EventsService(mockRepo as any);
  });

  it('should find all events', async () => {
    expect(await service.findAll()).toHaveLength(1);
  });

  it('should update stock correctly', async () => {
    const result = await service.updateStock(1, 4);
    expect(result.stock).toBe(6);
  });

  it('should fail if stock is insufficient', async () => {
    await expect(service.updateStock(1, 100)).rejects.toThrow('Stock insuficiente');
  });

  it('should throw an error if event is not found', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow('Evento no encontrado');
  });
});