import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { EventsService } from '../events/events.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

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
      eventId: eventId,
      quantity: quantity,
    });
    await this.transactionRepository.save(transaction);

    const PUBLIC_KEY = this.configService.get<string>('WOMPI_PUBLIC_KEY');
    const INTEGRITY_SECRET = this.configService.get<string>('WOMPI_INTEGRITY_SECRET');
    
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    const concatString = `${reference}${amountInCents}COP${INTEGRITY_SECRET}`;
    const integritySignature = crypto.createHash('sha256').update(concatString).digest('hex');

    const paymentUrl = `https://checkout.co.uat.wompi.dev/p/?public-key=${PUBLIC_KEY}&currency=COP&amount-in-cents=${amountInCents}&reference=${reference}&signature:integrity=${integritySignature}&redirect-url=${encodeURIComponent(frontendUrl + '/result')}`;

    this.logger.log(`URL de pago generada correctamente para: ${reference}`);

    return {
      success: true,
      transactionId: 'uat-' + Date.now(),
      paymentUrl: paymentUrl,
    };
  }

  async getStatus(id: string) {
    try {
      const PRIVATE_KEY = this.configService.get<string>('WOMPI_PRIVATE_KEY');
      const API_URL = this.configService.get<string>('WOMPI_API_URL');

      const response = await axios.get(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${PRIVATE_KEY}` },
      });

      const wompiStatus = response.data.data.status;
      const wompiReference = response.data.data.reference;

      if (wompiStatus === 'APPROVED') {
        const localTx = await this.transactionRepository.findOne({ where: { reference: wompiReference } });

        if (localTx && localTx.status !== 'APPROVED') {
          localTx.status = 'APPROVED';
          localTx.wompi_transaction_id = id;
          await this.transactionRepository.save(localTx);

          if (localTx.eventId && localTx.quantity) {
            await this.eventsService.updateStock(localTx.eventId, localTx.quantity);
          }
        }
      }

      return { success: true, status: wompiStatus };
    } catch (error) {
      this.logger.error(`Error consultando estado: ${error.response?.data || error.message}`);
      return { success: false, status: 'ERROR' };
    }
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