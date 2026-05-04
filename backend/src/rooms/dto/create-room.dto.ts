import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  theater_id!: number;

  @IsString()
  @MinLength(1)
  name!: string;
}
