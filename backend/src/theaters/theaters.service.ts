import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTheaterDto } from './dto/create-theater.dto';

@Injectable()
export class TheatersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const theaters = await this.prisma.theaters.findMany();

    return theaters.map((theater) => ({
      ...theater,
      id: theater.id.toString(),
    }));
  }

  async findOne(id: number) {
    const theater = await this.prisma.theaters.findUnique({
      where: { id: BigInt(id) },
      include: {
        rooms: true,
      },
    });

    if (!theater) {
      throw new NotFoundException(`Theater with id ${id} not found`);
    }

    return {
      ...theater,
      id: theater.id.toString(),
      rooms: theater.rooms.map((room) => ({
        ...room,
        id: room.id.toString(),
        theater_id: room.theater_id?.toString(),
      })),
    };
  }

  async create(createTheaterDto: CreateTheaterDto) {
    const theater = await this.prisma.theaters.create({
      data: {
        name: createTheaterDto.name,
        location: createTheaterDto.location,
      },
    });

    return {
      ...theater,
      id: theater.id.toString(),
    };
  }
}
