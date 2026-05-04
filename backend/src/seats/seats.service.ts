import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { CreateBulkSeatsDto } from './dto/create-bulk-seats.dto';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const seats = await this.prisma.seats.findMany({
      include: {
        rooms: true,
      },
    });

    return seats.map((seat) => ({
      ...seat,
      id: seat.id.toString(),
      room_id: seat.room_id?.toString(),
      rooms: seat.rooms
        ? {
            ...seat.rooms,
            id: seat.rooms.id.toString(),
            theater_id: seat.rooms.theater_id?.toString(),
          }
        : null,
    }));
  }

  async create(createSeatDto: CreateSeatDto) {
    const room = await this.prisma.rooms.findUnique({
      where: { id: BigInt(createSeatDto.room_id) },
    });

    if (!room) {
      throw new NotFoundException(
        `Room with id ${createSeatDto.room_id} not found`,
      );
    }

    const seat = await this.prisma.seats.create({
      data: {
        room_id: BigInt(createSeatDto.room_id),
        seat_row: createSeatDto.seat_row,
        seat_number: createSeatDto.seat_number,
      },
    });

    return {
      ...seat,
      id: seat.id.toString(),
      room_id: seat.room_id?.toString(),
    };
  }


  async findByShowtime(showtimeId: number) {
  const showtime = await this.prisma.showtimes.findUnique({
    where: { id: BigInt(showtimeId) },
  });

  if (!showtime) {
    throw new NotFoundException(`Showtime with id ${showtimeId} not found`);
  }

  if (!showtime.room_id) {
    throw new NotFoundException(`Showtime with id ${showtimeId} has no room`);
  }

  const seats = await this.prisma.seats.findMany({
    where: {
      room_id: showtime.room_id,
    },
    orderBy: [
      { seat_row: 'asc' },
      { seat_number: 'asc' },
    ],
  });

  const bookedSeats = await this.prisma.booking_seats.findMany({
    where: {
      showtime_id: BigInt(showtimeId),
    },
    select: {
      seat_id: true,
    },
  });

  const bookedSeatIds = new Set(
    bookedSeats.map((bookingSeat) => bookingSeat.seat_id?.toString()),
  );

  return seats.map((seat) => ({
    ...seat,
    id: seat.id.toString(),
    room_id: seat.room_id?.toString(),
    status: bookedSeatIds.has(seat.id.toString()) ? 'BOOKED' : 'AVAILABLE',
  }));
}

async createBulk(dto: CreateBulkSeatsDto) {
  const room = await this.prisma.rooms.findUnique({
    where: { id: BigInt(dto.room_id) },
  });

  if (!room) {
    throw new NotFoundException(`Room with id ${dto.room_id} not found`);
  }

  const seatsData = dto.rows.flatMap((row) =>
    Array.from({ length: dto.seats_per_row }, (_, index) => ({
      room_id: BigInt(dto.room_id),
      seat_row: row,
      seat_number: index + 1,
    })),
  );

  await this.prisma.seats.createMany({
    data: seatsData,
  });

  const seats = await this.prisma.seats.findMany({
    where: {
      room_id: BigInt(dto.room_id),
      seat_row: {
        in: dto.rows,
      },
    },
    orderBy: [{ seat_row: 'asc' }, { seat_number: 'asc' }],
  });

  return seats.map((seat) => ({
    ...seat,
    id: seat.id.toString(),
    room_id: seat.room_id?.toString(),
  }));
}


}
