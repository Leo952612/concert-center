import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('checkout')
  createCheckout(@Body() data: any) {
    return this.transactionsService.createCheckout(data);
  }

  // ✅ NUEVO ENDPOINT PARA CONSULTAR ESTADO
  @Get('status/:id')
  async getStatus(@Param('id') id: string) {
    return this.transactionsService.getStatus(id);
  }

  @Post('confirm')
  confirmPayment(@Body() data: any) {
    return this.transactionsService.confirmPayment(data);
  }
}