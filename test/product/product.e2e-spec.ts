import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '../../src/products/dto';
import * as process from 'node:process';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let productCounter = 0;
  const createTestProductDto = (): CreateProductDto => {
    productCounter++;
    return {
      title: `Test Product ${productCounter}`,
      sku: `TEST-SKU-${productCounter}`,
      description: `Test Description ${productCounter}`,
      price: 100.12 + productCounter,
      quantity: 10 + productCounter,
    };
  };

  const createTestProduct = () => {
    return prisma.product.create({ data: createTestProductDto() });
  };

  const TOTAL_PRODUCTS = 100;
  const postProduct = async (dto: CreateProductDto) =>
    await request(app.getHttpServer())
      .post('/products')
      .send(dto)
      .expect(HttpStatus.CREATED);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    productCounter = 0;
    if (!process.env.GENERATE_ITEMS) {
      await prisma.image.deleteMany({});
      await prisma.product.deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products (POST)', () => {
    it('should create a new product', async () => {
      const dto = createTestProductDto();

      return request(app.getHttpServer())
        .post('/products')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toBe(dto.title);
          expect(Number(res.body.price)).toBe(dto.price);
        });
    });

    it(`should create ${TOTAL_PRODUCTS}   products`, async () => {
      const createPromises: Array<Promise<request.Response>> = Array.from(
        { length: TOTAL_PRODUCTS },
        () => postProduct(createTestProductDto()),
      );

      await Promise.all(createPromises);

      const productsCount = await prisma.product.count();

      if (!process.env.GENERATE_ITEMS) {
        expect(productsCount).toBe(TOTAL_PRODUCTS);
      } else {
        expect(createPromises.length).toBe(TOTAL_PRODUCTS);
      }
    }, 15000);
  });

  describe('/products/:pid (GET)', () => {
    it('should return a single product by id', async () => {
      const product = await createTestProduct();

      return request(app.getHttpServer())
        .get(`/products/${product.pid}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.pid).toBe(product.pid);
        });
    });

    it('should return an empty body when product is not found', async () => {
      return request(app.getHttpServer())
        .get('/products/999')
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual({});
        });
    });
  });

  describe('/products/:pid (PATCH)', () => {
    it('should update a product', async () => {
      const product = await createTestProduct();
      const updateProductDto: UpdateProductDto = {
        title: 'Updated Test Product',
        price: 150,
      };

      return request(app.getHttpServer())
        .patch(`/products/${product.pid}`)
        .send(updateProductDto)
        .expect(HttpStatus.OK)
        .then(async (res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toBe(updateProductDto.title);
          expect(Number(res.body.price)).toBe(updateProductDto.price);
        });
    });
  });

  describe('/products/:pid (DELETE)', () => {
    it('should delete a product', async () => {
      const product = await createTestProduct();

      return request(app.getHttpServer())
        .delete(`/products/${product.pid}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
