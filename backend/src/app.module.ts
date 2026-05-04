import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TheatersModule } from './theaters/theaters.module';
import { SeatsModule } from './seats/seats.module';
import { RoomsModule } from './rooms/rooms.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';


@Module({
  imports: [
  PrismaModule,
  MoviesModule,
  UsersModule,
  AuthModule,
  TheatersModule,
  RoomsModule,
  SeatsModule,
  ShowtimesModule,
  BookingsModule,
  PaymentsModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
