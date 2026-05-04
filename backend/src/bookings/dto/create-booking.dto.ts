import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  showtime_id!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  seat_ids!: number[];
}
