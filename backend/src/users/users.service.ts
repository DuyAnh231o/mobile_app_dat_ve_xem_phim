import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.users.findMany();

    return users.map((user) => ({
      ...user,
      id: user.id.toString(),
    }));
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return {
      ...user,
      id: user.id.toString(),
    };
  }

  async create(createUserDto: CreateUserDto) {
  const existingUser = await this.prisma.users.findUnique({
    where: { email: createUserDto.email },
  });

  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  const user = await this.prisma.users.create({
    data: {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    },
  });

  return {
    ...user,
    id: user.id.toString(),
  };
}



}
