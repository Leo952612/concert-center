/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('checkout')
  createCheckout(@Body() data: any) {
    return this.transactionsService.createCheckout(data);
  }

  @Post('confirm')
  confirmPayment(@Body() data: any) {
    return this.transactionsService.confirmPayment(data);
  }
}