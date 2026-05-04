import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateSeatDto } from './dto/create-seat.dto';
import { SeatsService } from './seats.service';
import { CreateBulkSeatsDto } from './dto/create-bulk-seats.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get()
  findAll() {
    return this.seatsService.findAll();
  }
  @Get('showtime/:showtimeId')
findByShowtime(@Param('showtimeId') showtimeId: string) {
  return this.seatsService.findByShowtime(Number(showtimeId));
}


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatsService.create(createSeatDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Post('bulk')
createBulk(@Body() dto: CreateBulkSeatsDto) {
  return this.seatsService.createBulk(dto);
}

}
