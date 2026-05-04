import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get()
  findAll() {
    return this.showtimesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }
}
