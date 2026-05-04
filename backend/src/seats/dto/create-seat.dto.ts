import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateSeatDto {
  @IsNumber()
  room_id!: number;

  @IsString()
  @MinLength(1)
  seat_row!: string;

  @IsNumber()
  seat_number!: number;
}
