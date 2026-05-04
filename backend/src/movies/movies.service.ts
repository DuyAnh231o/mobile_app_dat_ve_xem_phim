import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const movies = await this.prisma.movies.findMany();

    return movies.map((movie) => ({
      ...movie,
      id: movie.id.toString(),
    }));
  }

  async findOne(id: number) {
    const movie = await this.prisma.movies.findUnique({
      where: { id: BigInt(id) },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return {
      ...movie,
      id: movie.id.toString(),
    };
  }

  async create(createMovieDto: CreateMovieDto) {
    const movie = await this.prisma.movies.create({
      data: {
        title: createMovieDto.title,
        description: createMovieDto.description,
        duration: createMovieDto.duration,
        release_date: createMovieDto.release_date
          ? new Date(createMovieDto.release_date)
          : undefined,
        poster_url: createMovieDto.poster_url,
      },
    });

    return {
      ...movie,
      id: movie.id.toString(),
    };
  }

async remove(id: number) {
  const movie = await this.prisma.movies.findUnique({
    where: { id: BigInt(id) },
  });

  if (!movie) {
    throw new NotFoundException(`Movie with id ${id} not found`);
  }

  const deletedMovie = await this.prisma.movies.delete({
    where: { id: BigInt(id) },
  });

  return {
    ...deletedMovie,
    id: deletedMovie.id.toString(),
  };
}

async update(id: number, updateMovieDto: UpdateMovieDto) {
  const movie = await this.prisma.movies.findUnique({
    where: { id: BigInt(id) },
  });

  if (!movie) {
    throw new NotFoundException(`Movie with id ${id} not found`);
  }

  const updatedMovie = await this.prisma.movies.update({
    where: { id: BigInt(id) },
    data: {
      title: updateMovieDto.title,
      description: updateMovieDto.description,
      duration: updateMovieDto.duration,
      release_date: updateMovieDto.release_date
        ? new Date(updateMovieDto.release_date)
        : undefined,
      poster_url: updateMovieDto.poster_url,
    },
  });

  return {
    ...updatedMovie,
    id: updatedMovie.id.toString(),
  };
}



}
