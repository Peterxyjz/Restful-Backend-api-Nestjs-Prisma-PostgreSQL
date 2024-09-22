import { ConfigService } from '@nestjs/config';
import { AuthDTO } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { User, Note } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(authDTO: AuthDTO) {
    const hashPassword = await argon.hash(authDTO.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          password: hashPassword,
          name: authDTO.name,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        // throw new ForbiddenException(error.message);

        throw new ForbiddenException({
          message: 'email already in use',
        });
      }
    }
  }

  async login(authDTO: AuthDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDTO.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const passwordMatched = await argon.verify(user.password, authDTO.password);
    if (!passwordMatched) {
      throw new ForbiddenException('Wrong email or password');
    }
    delete user.password;
    return await this.signJwtToken(user.id, user.email);
  }

  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return {
      accessToken: jwtString,
    };
  }
}
