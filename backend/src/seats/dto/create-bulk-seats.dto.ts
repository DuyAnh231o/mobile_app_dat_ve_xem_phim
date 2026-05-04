import { ArrayNotEmpty, IsArray, IsNumber, IsString, Min } from 'class-validator';

export class CreateBulkSeatsDto {
  @IsNumber()
  room_id!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  rows!: string[];

  @IsNumber()
  @Min(1)
  seats_per_row!: number;
}
