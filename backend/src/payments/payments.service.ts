import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentDto) {
    const booking = await this.prisma.bookings.findFirst({
      where: {
        id: BigInt(dto.booking_id),
        user_id: BigInt(userId),
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const existingPayment = await this.prisma.payments.findFirst({
      where: {
        booking_id: BigInt(dto.booking_id),
        status: 'SUCCESS',
      },
    });

    if (existingPayment) {
      throw new BadRequestException('Booking already paid');
    }

    const payment = await this.prisma.payments.create({
      data: {
        booking_id: BigInt(dto.booking_id),
        amount: booking.total_price,
        method: dto.method,
        status: 'SUCCESS',
      },
    });

    return {
      ...payment,
      id: payment.id.toString(),
      booking_id: payment.booking_id?.toString(),
      amount: payment.amount?.toString(),
    };
  }
  async findMyPayments(userId: string) {
  const payments = await this.prisma.payments.findMany({
    where: {
      bookings: {
        user_id: BigInt(userId),
      },
    },
    include: {
      bookings: {
        include: {
          showtimes: {
            include: {
              movies: true,
              rooms: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return payments.map((payment) => ({
    ...payment,
    id: payment.id.toString(),
    booking_id: payment.booking_id?.toString(),
    amount: payment.amount?.toString(),
    bookings: payment.bookings
      ? {
          ...payment.bookings,
          id: payment.bookings.id.toString(),
          user_id: payment.bookings.user_id?.toString(),
          showtime_id: payment.bookings.showtime_id?.toString(),
          total_price: payment.bookings.total_price?.toString(),
          showtimes: payment.bookings.showtimes
            ? {
                ...payment.bookings.showtimes,
                id: payment.bookings.showtimes.id.toString(),
                movie_id: payment.bookings.showtimes.movie_id?.toString(),
                room_id: payment.bookings.showtimes.room_id?.toString(),
                price: payment.bookings.showtimes.price?.toString(),
                movies: payment.bookings.showtimes.movies
                  ? {
                      ...payment.bookings.showtimes.movies,
                      id: payment.bookings.showtimes.movies.id.toString(),
                    }
                  : null,
                rooms: payment.bookings.showtimes.rooms
                  ? {
                      ...payment.bookings.showtimes.rooms,
                      id: payment.bookings.showtimes.rooms.id.toString(),
                      theater_id:
                        payment.bookings.showtimes.rooms.theater_id?.toString(),
                    }
                  : null,
              }
            : null,
        }
      : null,
  }));
}

}
