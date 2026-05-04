import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const showtimes = await this.prisma.showtimes.findMany({
      include: {
        movies: true,
        rooms: {
          include: {
            theaters: true,
          },
        },
      },
      orderBy: {
        start_time: 'asc',
      },
    });

    return showtimes.map((showtime) => this.serializeShowtime(showtime));
  }

  async findOne(id: number) {
    const showtime = await this.prisma.showtimes.findUnique({
      where: { id: BigInt(id) },
      include: {
        movies: true,
        rooms: {
          include: {
            theaters: true,
          },
        },
      },
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }

    return this.serializeShowtime(showtime);
  }

  async create(createShowtimeDto: CreateShowtimeDto) {
    const movie = await this.prisma.movies.findUnique({
      where: { id: BigInt(createShowtimeDto.movie_id) },
    });

    if (!movie) {
      throw new NotFoundException(
        `Movie with id ${createShowtimeDto.movie_id} not found`,
      );
    }

    const room = await this.prisma.rooms.findUnique({
      where: { id: BigInt(createShowtimeDto.room_id) },
    });

    if (!room) {
      throw new NotFoundException(
        `Room with id ${createShowtimeDto.room_id} not found`,
      );
    }

    const showtime = await this.prisma.showtimes.create({
      data: {
        movie_id: BigInt(createShowtimeDto.movie_id),
        room_id: BigInt(createShowtimeDto.room_id),
        start_time: new Date(createShowtimeDto.start_time),
        price: createShowtimeDto.price,
      },
      include: {
        movies: true,
        rooms: {
          include: {
            theaters: true,
          },
        },
      },
    });

    return this.serializeShowtime(showtime);
  }

  private serializeShowtime(showtime: any) {
    return {
      ...showtime,
      id: showtime.id.toString(),
      movie_id: showtime.movie_id?.toString(),
      room_id: showtime.room_id?.toString(),
      price: showtime.price?.toString(),
      movies: showtime.movies
        ? {
            ...showtime.movies,
            id: showtime.movies.id.toString(),
          }
        : null,
      rooms: showtime.rooms
        ? {
            ...showtime.rooms,
            id: showtime.rooms.id.toString(),
            theater_id: showtime.rooms.theater_id?.toString(),
            theaters: showtime.rooms.theaters
              ? {
                  ...showtime.rooms.theaters,
                  id: showtime.rooms.theaters.id.toString(),
                }
              : null,
          }
        : null,
    };
  }
}
