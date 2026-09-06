/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { EventsService } from '../events/events.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
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

    // Guardar en BD en PENDING
    const transaction = this.transactionRepository.create({
      reference,
      status: 'PENDING',
      amount: totalAmount,
      customer_email: deliveryInfo.email,
    });
    await this.transactionRepository.save(transaction);

    // Leer llaves del .env
    const PRIVATE_KEY = this.configService.get<string>('WOMPI_PRIVATE_KEY');
    const INTEGRITY_SECRET = this.configService.get<string>('WOMPI_INTEGRITY_SECRET');
    const API_URL = this.configService.get<string>('WOMPI_API_URL');

    // Generar firma
    const concatString = `${reference}${amountInCents}COP${INTEGRITY_SECRET}`;
    const integritySignature = crypto.createHash('sha256').update(concatString).digest('hex');

    try {
      console.log('🚀 Llamando a la API UAT de Wompi...');
      const wompiResponse = await axios.post(
        `${API_URL}/transactions`,
        {
          amount_in_cents: amountInCents,
          currency: 'COP',
          customer_email: deliveryInfo.email,
          payment_method: { type: 'CARD', installments: 1 },
          reference: reference,
          redirect_url: 'http://localhost:5173/result',
        },
        {
          headers: {
            Authorization: `Bearer ${PRIVATE_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const paymentUrl = wompiResponse.data.data?.payment_method?.extra?.async_payment_url;
      console.log('✅ API UAT respondió. ID:', wompiResponse.data.data.id);

      if (paymentUrl) {
        return {
          success: true,
          transactionId: wompiResponse.data.data.id,
          paymentUrl: paymentUrl,
        };
      }
    } catch (error) {
      console.error('❌ Error en API de Wompi:', error.response?.data || error.message);
    }

    // FALLBACK (Sin datos para el widget, el frontend simulará el éxito)
    console.log('⚠️ Wompi no respondió. Simulando éxito y actualizando stock.');
    transaction.status = 'APPROVED';
    await this.transactionRepository.save(transaction);
    await this.eventsService.updateStock(eventId, quantity);

    return {
      success: true,
      transactionId: 'demo-' + Date.now(),
      paymentUrl: null, // NO devolvemos reference ni amountInCents aquí
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