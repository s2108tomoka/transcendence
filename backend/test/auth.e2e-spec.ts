import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { App } from 'supertest/types';
import { Prisma } from '../src/generated/prisma/client.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Auth registration (e2e)', () => {
  let app: INestApplication<App>;
  const createUser = vi.fn();

  beforeEach(async () => {
    createUser.mockReset();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({ users: { create: createUser } })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('registers a user without exposing the password hash', async () => {
    const createdAt = new Date('2026-09-04T00:00:00.000Z');
    createUser.mockImplementationOnce(async ({ data }) => {
      expect(data.password_hash).not.toBe('correct horse battery staple');
      expect(
        await bcrypt.compare(
          'correct horse battery staple',
          data.password_hash,
        ),
      ).toBe(true);

      return {
        id: '54a78d50-0c23-4bea-b4ac-afd814f25798',
        username: data.username,
        email: data.email,
        display_name: data.display_name,
        bio: data.bio,
        avatar_url: null,
        created_at: createdAt,
      };
    });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: ' Alice_42 ',
        email: ' ALICE@example.com ',
        password: 'correct horse battery staple',
      })
      .expect(201);

    expect(response.body).toEqual({
      id: '54a78d50-0c23-4bea-b4ac-afd814f25798',
      username: 'alice_42',
      email: 'alice@example.com',
      displayName: 'alice_42',
      bio: null,
      avatarUrl: null,
      createdAt: createdAt.toISOString(),
    });
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('returns the common error format for invalid input', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'x', email: 'invalid', password: 'short' })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      path: '/auth/register',
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'username' }),
        expect.objectContaining({ field: 'email' }),
        expect.objectContaining({ field: 'password' }),
      ]),
    );
    expect(createUser).not.toHaveBeenCalled();
  });

  it('returns conflict when the username or email already exists', async () => {
    createUser.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.10.0',
      }),
    );

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'alice_42',
        email: 'alice@example.com',
        password: 'correct horse battery staple',
      })
      .expect(409);

    expect(response.body).toMatchObject({
      statusCode: 409,
      code: 'USER_ALREADY_EXISTS',
      message: 'Username or email is already in use',
      path: '/auth/register',
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
