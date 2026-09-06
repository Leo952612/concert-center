import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { EventsService } from '../events/events.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private eventsService: EventsService,
    private configService: ConfigService,
  ) {}

  async createCheckout(data: any) {
    const { eventId, quantity, deliveryInfo, totalAmount } = data;

    if (!eventId || !quantity || !totalAmount || !deliveryInfo) {
      throw new BadRequestException('Datos incompletos');
    }

    if (!deliveryInfo.email || !deliveryInfo.email.includes('@')) {
      deliveryInfo.email = 'cliente@test.com';
    }

    const reference = `concierto-${eventId}-${Date.now()}`;
    const amountInCents = Math.round(totalAmount * 100);

    const transaction = this.transactionRepository.create({
      reference,
      status: 'PENDING',
      amount: totalAmount,
      customer_email: deliveryInfo.email,
    });
    await this.transactionRepository.save(transaction);

    const PUBLIC_KEY = this.configService.get<string>('WOMPI_PUBLIC_KEY');
    const INTEGRITY_SECRET = this.configService.get<string>('WOMPI_INTEGRITY_SECRET');
    
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    const concatString = `${reference}${amountInCents}COP${INTEGRITY_SECRET}`;
    const integritySignature = crypto.createHash('sha256').update(concatString).digest('hex');

    // ⚠️ CAMBIO AQUÍ: Redirigir a la raíz (sin /result) para evitar el 404 de Vercel
    const paymentUrl = `https://checkout.co.uat.wompi.dev/p/?public-key=${PUBLIC_KEY}&currency=COP&amount-in-cents=${amountInCents}&reference=${reference}&signature:integrity=${integritySignature}&redirect-url=${encodeURIComponent(frontendUrl + '/result')}`;

    console.log(`🚀 URL de pago UAT generada: ${paymentUrl}`);

    return {
      success: true,
      transactionId: 'uat-' + Date.now(),
      paymentUrl: paymentUrl,
    };
  }

  async confirmPayment(data: any) {
    const { reference, status, wompiTransactionId, eventId, quantity } = data;

    const transaction = await this.transactionRepository.findOne({ where: { reference } });

    if (transaction) {
      transaction.status = status === 'APPROVED' ? 'APPROVED' : 'DECLINED';
      transaction.wompi_transaction_id = wompiTransactionId || null;
      await this.transactionRepository.save(transaction);

      if (status === 'APPROVED') {
        await this.eventsService.updateStock(eventId, quantity);
      }
    }

    return { success: true };
  }
}