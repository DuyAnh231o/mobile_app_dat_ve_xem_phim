import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  release_date?: string;

  @IsOptional()
  @IsString()
  poster_url?: string;
}
