/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }
    return event;
  }

  async updateStock(id: number, quantity: number): Promise<Event> {
    const event = await this.findOne(id);
    if (event.stock < quantity) {
      throw new Error('Stock insuficiente');
    }
    event.stock -= quantity;
    return this.eventRepository.save(event);
  }
}