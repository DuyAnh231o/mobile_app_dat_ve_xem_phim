import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(req.user.userId, dto);
  }
  @UseGuards(AuthGuard('jwt'))
@Get('my')
findMyPayments(@Req() req: any) {
  return this.paymentsService.findMyPayments(req.user.userId);
}

}
