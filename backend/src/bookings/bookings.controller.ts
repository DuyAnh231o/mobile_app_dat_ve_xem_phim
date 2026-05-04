import { Body, Controller, Get, Post, Req, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  findMyBookings(@Req() req: any) {
    return this.bookingsService.findMyBookings(req.user.userId);
  }
  @UseGuards(AuthGuard('jwt'))
@Get(':id')
findOne(@Req() req: any, @Param('id') id: string) {
  return this.bookingsService.findOneForUser(req.user.userId, Number(id));
}

}
