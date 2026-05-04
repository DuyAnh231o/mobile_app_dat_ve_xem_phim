import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { TheatersService } from './theaters.service';

@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get()
  findAll() {
    return this.theatersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theatersService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theatersService.create(createTheaterDto);
  }
}
