import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
      },
    });

    return this.issueTokens(user.id, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException();

    return this.issueTokens(user.id, user.role);
  }

  async refresh(userId: string) {
    return this.issueTokens(userId);
  }

  private async issueTokens(userId: string, role?: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, role },
      {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as NonNullable<
          JwtSignOptions['expiresIn']
        >,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as NonNullable<
          JwtSignOptions['expiresIn']
        >,
      },
    );

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: { token: refreshToken },
      create: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 86400000),
      },
    });

    return { accessToken, refreshToken };
  }
}
