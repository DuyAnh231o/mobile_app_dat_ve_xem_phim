import { IsNumber, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  movie_id!: number;

  @IsNumber()
  room_id!: number;

  @IsString()
  start_time!: string;

  @IsNumber()
  price!: number;
}
