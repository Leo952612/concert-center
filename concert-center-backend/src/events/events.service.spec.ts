// Mock de @nestjs/typeorm para evitar errores de ESM
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
    // Instanciación directa, sin NestJS
    service = new EventsService(mockRepo as any);
  });

  it('debería encontrar todos los eventos', async () => {
    expect(await service.findAll()).toHaveLength(1);
  });

  it('debería actualizar el stock correctamente', async () => {
    const result = await service.updateStock(1, 4);
    expect(result.stock).toBe(6);
  });

  it('debería fallar si el stock es insuficiente', async () => {
    await expect(service.updateStock(1, 100)).rejects.toThrow('Stock insuficiente');
  });
});