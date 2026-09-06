/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Event } from './events/event.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const eventRepo = dataSource.getRepository(Event);

  const events = [
    { name: 'Noche de Rock Clásico', description: 'Arena Central', price: 45000, stock: 12, style: 'Premium', featured: true, image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Festival Electrónico 2026', description: 'Parque Norte', price: 52000, stock: 8, style: 'VIP', featured: true, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Sinfonía de Otoño', description: 'Teatro Municipal', price: 38000, stock: 15, style: 'General', featured: false, image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Jazz bajo las Estrellas', description: 'Jardín Botánico', price: 29000, stock: 10, style: 'General', featured: false, image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop' },
  ];

  for (const event of events) {
    await eventRepo.save(eventRepo.create(event));
  }
  console.log('🎵 Base de datos sembrada con eventos');
  await app.close();
}

bootstrap();