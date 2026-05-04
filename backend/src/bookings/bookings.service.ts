import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const showtime = await this.prisma.showtimes.findUnique({
      where: { id: BigInt(dto.showtime_id) },
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${dto.showtime_id} not found`);
    }

    const seats = await this.prisma.seats.findMany({
      where: {
        id: {
          in: dto.seat_ids.map((seatId) => BigInt(seatId)),
        },
      },
    });

    if (seats.length !== dto.seat_ids.length) {
      throw new BadRequestException('Some seats do not exist');
    }

    const invalidSeats = seats.filter(
      (seat) => seat.room_id?.toString() !== showtime.room_id?.toString(),
    );

    if (invalidSeats.length > 0) {
      throw new BadRequestException('Some seats do not belong to this showtime room');
    }

    const bookedSeats = await this.prisma.booking_seats.findMany({
      where: {
        showtime_id: BigInt(dto.showtime_id),
        seat_id: {
          in: dto.seat_ids.map((seatId) => BigInt(seatId)),
        },
      },
    });

    if (bookedSeats.length > 0) {
      throw new BadRequestException('Some seats are already booked');
    }

    const price = Number(showtime.price ?? 0);
    const totalPrice = price * dto.seat_ids.length;

    const booking = await this.prisma.bookings.create({
      data: {
        user_id: BigInt(userId),
        showtime_id: BigInt(dto.showtime_id),
        total_price: totalPrice,
        status: 'CONFIRMED',
        booking_seats: {
          create: dto.seat_ids.map((seatId) => ({
            seat_id: BigInt(seatId),
            showtime_id: BigInt(dto.showtime_id),
          })),
        },
      },
      include: {
        booking_seats: {
          include: {
            seats: true,
          },
        },
        showtimes: {
          include: {
            movies: true,
            rooms: true,
          },
        },
      },
    });

    return this.serializeBooking(booking);
  }

  async findMyBookings(userId: string) {
    const bookings = await this.prisma.bookings.findMany({
      where: {
        user_id: BigInt(userId),
      },
      include: {
        booking_seats: {
          include: {
            seats: true,
          },
        },
        showtimes: {
          include: {
            movies: true,
            rooms: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return bookings.map((booking) => this.serializeBooking(booking));
  }

  private serializeBooking(booking: any) {
    return {
      ...booking,
      id: booking.id.toString(),
      user_id: booking.user_id?.toString(),
      showtime_id: booking.showtime_id?.toString(),
      total_price: booking.total_price?.toString(),
      booking_seats: booking.booking_seats.map((bookingSeat: any) => ({
        ...bookingSeat,
        id: bookingSeat.id.toString(),
        booking_id: bookingSeat.booking_id?.toString(),
        seat_id: bookingSeat.seat_id?.toString(),
        showtime_id: bookingSeat.showtime_id?.toString(),
        seats: bookingSeat.seats
          ? {
              ...bookingSeat.seats,
              id: bookingSeat.seats.id.toString(),
              room_id: bookingSeat.seats.room_id?.toString(),
            }
          : null,
      })),
      showtimes: booking.showtimes
        ? {
            ...booking.showtimes,
            id: booking.showtimes.id.toString(),
            movie_id: booking.showtimes.movie_id?.toString(),
            room_id: booking.showtimes.room_id?.toString(),
            price: booking.showtimes.price?.toString(),
            movies: booking.showtimes.movies
              ? {
                  ...booking.showtimes.movies,
                  id: booking.showtimes.movies.id.toString(),
                }
              : null,
            rooms: booking.showtimes.rooms
              ? {
                  ...booking.showtimes.rooms,
                  id: booking.showtimes.rooms.id.toString(),
                  theater_id: booking.showtimes.rooms.theater_id?.toString(),
                }
              : null,
          }
        : null,
    };
  }
  async findOneForUser(userId: string, bookingId: number) {
  const booking = await this.prisma.bookings.findFirst({
    where: {
      id: BigInt(bookingId),
      user_id: BigInt(userId),
    },
    include: {
      booking_seats: {
        include: {
          seats: true,
        },
      },
      showtimes: {
        include: {
          movies: true,
          rooms: true,
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundException(`Booking with id ${bookingId} not found`);
  }

  return this.serializeBooking(booking);
}

}
