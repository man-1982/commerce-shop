import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateCartDto, AddToCartDto, RemoveItemDto } from '../../src/cart/dto';
import { CreateProductDto } from '../../src/products/dto';
import { CreateUserDto } from '../../src/user/dto';
import { User } from '@prisma/client';

describe('CartController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;

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

  const createTestProduct = async () => {
    return prisma.product.create({ data: createTestProductDto() });
  };

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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // Clear database before each test
    await prisma.user.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});

    // before create one global user
    user = await createTestUser();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/cart (POST)', () => {
    it('should create a new cart', async () => {
      const product = await createTestProduct();
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 1,
      };

      return request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.uid).toBe(createCartDto.uid);
          expect(res.body.pid).toBe(createCartDto.pid);
          expect(res.body.quantity).toBe(createCartDto.quantity);
        });
    });

    it('should not create a cart if it already exists for the same user and product', async () => {
      const product = await createTestProduct();
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 1,
      };

      await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED);

      return request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('/cart/add (PATCH)', () => {
    it('should add items to an existing cart', async () => {
      const product = await createTestProduct();
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 1,
      };

      const createRes = await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED);

      const cartId = createRes.body.cid;

      const addToCartDto: AddToCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 2,
      };

      return request(app.getHttpServer())
        .patch('/cart/add')
        .send(addToCartDto)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.cid).toBe(cartId);
          expect(res.body.quantity).toBe(
            createCartDto.quantity + addToCartDto.quantity,
          );
        });
    });

    it('should return 404 if cart item not found', async () => {
      const product = await createTestProduct();
      const addToCartDto: AddToCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 2,
      };

      return request(app.getHttpServer())
        .patch('/cart/add')
        .send(addToCartDto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/cart/remove (PATCH)', () => {
    it('should remove items from an existing cart', async () => {
      const product = await createTestProduct();
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 5,
      };

      const createRes = await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED);

      const cartId = createRes.body.cid;

      const removeItemDto: RemoveItemDto = {
        pid: product.pid,
        quantity: 2,
      };

      return request(app.getHttpServer())
        .patch(`/cart/remove/${cartId}`)
        .send(removeItemDto)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.cid).toBe(cartId);
          expect(res.body.quantity).toBe(
            createCartDto.quantity - removeItemDto.quantity,
          );
        });
    });

    it('should return 400 if product or cart does not exist', async () => {
      const removeItemDto: RemoveItemDto = {
        pid: 999,
        quantity: 1,
      };

      return request(app.getHttpServer())
        .patch('/cart/remove/999')
        .send(removeItemDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/cart/:cid (GET)', () => {
    it('should return a single cart by id', async () => {
      const product = await createTestProduct();
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 1,
      };

      const createRes = await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED);

      const cartId = createRes.body.cid;

      return request(app.getHttpServer())
        .get(`/cart/${cartId}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.cid).toBe(cartId);
        });
    });

    it('should return 404 if cart not found', async () => {
      return request(app.getHttpServer())
        .get('/cart/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/cart/:cid/close (PATCH)', () => {
    it('should close a cart', async () => {
      const product = await createTestProduct();
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 1,
      };

      const createRes = await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED);

      const cartId = createRes.body.cid;
      console.log('Cart ID before close:', cartId);

      return request(app.getHttpServer())
        .patch(`/cart/${cartId}/close`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.cid).toBe(cartId);
          expect(res.body.status).toBe(false);
        });
    });
  });

  describe('/cart/:cid (DELETE)', () => {
    it('should delete a cart', async () => {
      const product = await createTestProduct();
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: 1,
      };

      const createRes = await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED);

      const cartId = createRes.body.cid;

      return request(app.getHttpServer())
        .delete(`/cart/${cartId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 404 if cart not found', async () => {
      return request(app.getHttpServer())
        .delete('/cart/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Update product stock when add/remove product from cart', () => {
    it('Should decrease product stock when add to cart', async () => {
      const product = await createTestProduct();
      const stockChange = 3;
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: stockChange,
      };

      console.log(
        `Create new cart with quantity: ${stockChange} and product: ${product.pid}`,
      );
      const addProductToCartRes = await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body.quantity).toBe(stockChange);
          expect(res.body.cid).toBeDefined();
        });

      console.log(`Check product: ${product.pid} stock after add to cart `);
      const getProductById = await request(app.getHttpServer())
        .get(`/products/${product.pid}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.quantity).toBe(product.quantity - stockChange);
          return res.body;
        });
    });

    it('Should increase product stock when remove items from cart', async () => {
      const product = await createTestProduct();
      const productStockStart = product.quantity;
      const stockChange = 3;
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: stockChange,
      };

      console.log(
        `Create new cart with quantity: ${stockChange} and product: ${product.pid}`,
      );
      const newCartEntry = await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body.quantity).toBe(stockChange);
          expect(res.body.cid).toBeDefined();
          return res.body;
        });

      // remove prodcut
      const removeProductFromCart = await request(app.getHttpServer())
        .patch(`/cart/remove/${newCartEntry.cid}`)
        .send(createCartDto)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body.quantity).toBe(0);
          expect(res.body.cid).toBeDefined();
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(
        `Check product: ${product.pid} stock after remove from cart `,
      );
      //compare current product stock with start stock
      const getProductById = await request(app.getHttpServer())
        .get(`/products/${product.pid}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.quantity).toBe(productStockStart);
        });
    });

    it('Should increase product stock when close the cart', async () => {
      // Empty by now @see  @OnEvent('cart.closed', { async: true })
    });
  });
});
