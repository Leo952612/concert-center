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

    // Validaciones básicas
    if (!eventId || !quantity || !totalAmount || !deliveryInfo) {
      throw new BadRequestException('Datos incompletos');
    }

    // Validar email (para evitar errores de la API de Wompi)
    if (!deliveryInfo.email || !deliveryInfo.email.includes('@')) {
      deliveryInfo.email = 'cliente@test.com';
    }

    // 1. Generar referencia única y monto
    const reference = `concierto-${eventId}-${Date.now()}`;
    const amountInCents = Math.round(totalAmount * 100);

    // 2. Guardar transacción en estado PENDING en la BD
    const transaction = this.transactionRepository.create({
      reference,
      status: 'PENDING',
      amount: totalAmount,
      customer_email: deliveryInfo.email,
    });
    await this.transactionRepository.save(transaction);

    // 3. Leer las llaves del .env (Nunca en el código)
    const PUBLIC_KEY = this.configService.get<string>('WOMPI_PUBLIC_KEY');
    const INTEGRITY_SECRET = this.configService.get<string>('WOMPI_INTEGRITY_SECRET');
    
    // 4. Leer la URL del frontend (para redirigir después de pagar)
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    // 5. Generar la Firma de Integridad (SHA256) - Requisito obligatorio
    const concatString = `${reference}${amountInCents}COP${INTEGRITY_SECRET}`;
    const integritySignature = crypto.createHash('sha256').update(concatString).digest('hex');

    // 6. Construir la URL del Checkout UAT (El método que SÍ funciona)
    const paymentUrl = `https://checkout.co.uat.wompi.dev/p/?public-key=${PUBLIC_KEY}&currency=COP&amount-in-cents=${amountInCents}&reference=${reference}&signature:integrity=${integritySignature}&redirect-url=${encodeURIComponent(frontendUrl + '/result')}`;

    console.log(`🚀 URL de pago UAT generada: ${paymentUrl}`);

    // 7. Devolver la URL al Frontend
    return {
      success: true,
      transactionId: 'uat-' + Date.now(),
      paymentUrl: paymentUrl,
    };
  }

  // Endpoint que el Frontend llama cuando Wompi redirige de vuelta (o para confirmar el pago)
  async confirmPayment(data: any) {
    const { reference, status, wompiTransactionId, eventId, quantity } = data;

    const transaction = await this.transactionRepository.findOne({ where: { reference } });

    if (transaction) {
      // Actualizar el estado de la transacción en la BD
      transaction.status = status === 'APPROVED' ? 'APPROVED' : 'DECLINED';
      transaction.wompi_transaction_id = wompiTransactionId || null;
      await this.transactionRepository.save(transaction);

      // ✅ REQUISITO DEL PDF: Actualizar el stock del evento si el pago fue exitoso
      if (status === 'APPROVED') {
        await this.eventsService.updateStock(eventId, quantity);
      }
    }

    return { success: true };
  }
}