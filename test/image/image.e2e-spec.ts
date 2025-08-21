import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateImageDto, UpdateImageDto } from '../../src/image/dto';
import { Product } from '@prisma/client';
import * as path from 'node:path';
import * as fs from 'node:fs';

describe('ImageController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testProduct: Product;

  const createTestImageDto = (pid: number): CreateImageDto => {
    return {
      imageData: 'data:image/png;base64,dGVzdA==', // "test" in base64
      title: 'Test Image',
      pid: pid,
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.image.deleteMany({});
    await prisma.product.deleteMany({});

    // Create a product to associate images with
    testProduct = await prisma.product.create({
      data: {
        title: 'Test Product for Images',
        sku: 'TEST-SKU-IMG-123',
        price: 99.99,
        quantity: 50,
      },
    });
  });

  afterAll(async () => {
    await prisma.image.deleteMany({});
    await prisma.product.deleteMany({});
    await app.close();
  });

  describe('/images (POST)', () => {
    it('should create a new image', async () => {
      const dto = createTestImageDto(testProduct.pid);

      return request(app.getHttpServer())
        .post('/images')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toBe(dto.title);
          expect(res.body.pid).toBe(testProduct.pid);
        });
    });

    it('should fail to create an image for a non-existent product', () => {
      const dto = createTestImageDto(99999); // Non-existent product ID

      return request(app.getHttpServer())
        .post('/images')
        .send(dto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should fail to create an image with a very large payload', () => {
      const filePath = path.resolve(__dirname, 'img/test-image.jpg');
      const base64 = fs.readFileSync(filePath).toString('base64');
      const largeBase64Image = `data:image/jpeg;base64,${base64}`;
      const dto = {
        ...createTestImageDto(testProduct.pid),
        imageData: largeBase64Image,
      };

      return request(app.getHttpServer())
        .post('/images')
        .send(dto)
        .expect(HttpStatus.PAYLOAD_TOO_LARGE);
    });
  });

  describe('/images/:mid (GET)', () => {
    it('should return a single image by id', async () => {
      const image = await prisma.image.create({
        data: createTestImageDto(testProduct.pid),
      });

      return request(app.getHttpServer())
        .get(`/images/${image.mid}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.mid).toBe(image.mid);
        });
    });

    it('should return 404 when image is not found', () => {
      return request(app.getHttpServer())
        .get('/images/99999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/images/product/:pid (GET)', () => {
    it('should return all images for a product', async () => {
      await prisma.image.create({ data: createTestImageDto(testProduct.pid) });
      await prisma.image.create({ data: createTestImageDto(testProduct.pid) });

      return request(app.getHttpServer())
        .get(`/images/product/${testProduct.pid}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('/images/:mid (PATCH)', () => {
    it('should update an image', async () => {
      const image = await prisma.image.create({
        data: createTestImageDto(testProduct.pid),
      });
      const updateImageDto: UpdateImageDto = {
        title: 'Updated Test Image',
      };

      return request(app.getHttpServer())
        .patch(`/images/${image.mid}`)
        .send(updateImageDto)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toBe(updateImageDto.title);
          // Ensure imageData was not changed
          expect(res.body.imageData).toBe(image.imageData);
        });
    });
  });

  describe('/images/:mid (DELETE)', () => {
    it('should delete an image', async () => {
      const image = await prisma.image.create({
        data: createTestImageDto(testProduct.pid),
      });

      await request(app.getHttpServer())
        .delete(`/images/${image.mid}`)
        .expect(HttpStatus.OK);

      // Verify the image is deleted
      return request(app.getHttpServer())
        .get(`/images/${image.mid}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
