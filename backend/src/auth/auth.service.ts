import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    return {
      message: 'Register successful',
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new BadRequestException('Email does not exist');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password ?? '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
