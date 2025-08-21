import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../../src/user/dto';
import * as process from 'node:process';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const createTestUserDto = (): CreateUserDto => {
    const randomLength = Math.floor(Math.random() * 3) + 4;
    const randomString = Math.random()
      .toString(36)
      .substring(2, 2 + randomLength);
    return {
      email: `test-user${randomString}@example.com`,
      password: `password${randomString}`,
    };
  };

  const createTestUser = () => {
    return prisma.user.create({ data: createTestUserDto() });
  };

  const TOTAL_USERS = 10;
  const postUser = async (dto: CreateUserDto) =>
    await request(app.getHttpServer())
      .post('/user')
      .send(dto)
      .expect(HttpStatus.CREATED);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    // delete user before script
    if (!process.env.GENERATE_ITEMS) {
      await prisma.user.deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user (POST)', () => {
    it('should create a new user', async () => {
      const dto = createTestUserDto();

      return request(app.getHttpServer())
        .post('/user')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.email).toBe(dto.email);
        });
    });

    it(`should create ${TOTAL_USERS} users`, async () => {
      const createPromises: Array<Promise<request.Response>> = Array.from(
        { length: TOTAL_USERS },
        () => postUser(createTestUserDto()),
      );

      await Promise.all(createPromises);

      const usersCount = await prisma.user.count();
      if (!process.env.GENERATE_ITEMS) {
        expect(usersCount).toBe(TOTAL_USERS);
      } else {
        expect(createPromises.length).toBe(TOTAL_USERS);
      }
    }, 15000);
  });

  describe('/user/:uid (GET)', () => {
    it('should return a single user by id', async () => {
      const user = await createTestUser();

      return request(app.getHttpServer())
        .get(`/user/${user.uid}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.uid).toBe(user.uid);
        });
    });

    it('should return an empty body when user is not found', async () => {
      return request(app.getHttpServer())
        .get('/user/999')
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual({});
        });
    });
  });

  describe('/user/:uid (PATCH)', () => {
    it('should update a user', async () => {
      const user = await createTestUser();
      const updateUserDto: UpdateUserDto = {
        password: 'new-password',
      };

      return request(app.getHttpServer())
        .patch(`/user/${user.uid}`)
        .send(updateUserDto)
        .expect(HttpStatus.CREATED)
        .then(async (res) => {
          expect(res.body).toBeDefined();
        });
    });
  });

  describe('/user/:uid (DELETE)', () => {
    it('should delete a user', async () => {
      const user = await createTestUser();

      return request(app.getHttpServer())
        .delete(`/user/${user.uid}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
