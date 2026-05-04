import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const rooms = await this.prisma.rooms.findMany({ include: { theaters: true } });

    return rooms.map((room) => ({
      ...room,
      id: room.id.toString(),
      theater_id: room.theater_id?.toString(),
      theaters: room.theaters
        ? { ...room.theaters, id: room.theaters.id.toString() }
        : null,
    }));
  }

  async create(dto: CreateRoomDto) {
    const theater = await this.prisma.theaters.findUnique({
      where: { id: BigInt(dto.theater_id) },
    });

    if (!theater) {
      throw new NotFoundException(`Theater with id ${dto.theater_id} not found`);
    }

    const room = await this.prisma.rooms.create({
      data: {
        theater_id: BigInt(dto.theater_id),
        name: dto.name,
      },
    });

    return {
      ...room,
      id: room.id.toString(),
      theater_id: room.theater_id?.toString(),
    };
  }
}
