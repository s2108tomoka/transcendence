import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../generated/prisma/client.js';
import { ErrorCode } from '../common/errors/error-code.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';

export type RegisteredUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
};

@Injectable()
export class AuthService {
  private readonly bcryptRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.bcryptRounds = configService.get<number>('BCRYPT_ROUNDS', 12);
  }

  async register(dto: RegisterDto): Promise<RegisteredUser> {
    const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);

    try {
      const user = await this.prisma.users.create({
        data: {
          username: dto.username,
          email: dto.email,
          password_hash: passwordHash,
          display_name: dto.displayName ?? dto.username,
          bio: dto.bio ?? null,
          updated_at: new Date(),
        },
        select: {
          id: true,
          username: true,
          email: true,
          display_name: true,
          bio: true,
          avatar_url: true,
          created_at: true,
        },
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          code: ErrorCode.UserAlreadyExists,
          message: 'Username or email is already in use',
        });
      }
      throw error;
    }
  }
}
