import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Event } from './events/event.entity';
import { Transaction } from './transactions/transaction.entity';
import { EventsModule } from './events/events.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'db.sqlite',
      entities: [Event, Transaction],
      synchronize: true,
    }),
    EventsModule,
    TransactionsModule,
  ],
})
export class AppModule {}