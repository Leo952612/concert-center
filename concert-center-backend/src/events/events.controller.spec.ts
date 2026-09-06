import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => {},
}));

describe('EventsController', () => {
  let controller: EventsController;

  const mockEventsService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Test' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should return all events', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, name: 'Test' }]);
  });

  it('should return an event by ID', async () => {
    expect(await controller.findOne('1')).toEqual({ id: 1, name: 'Test' });
  });
});