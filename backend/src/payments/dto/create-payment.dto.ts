import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  booking_id!: number;

  @IsNotEmpty()
  @IsIn(['CASH', 'MOMO', 'VNPAY', 'BANKING'])
  method!: string;
}
