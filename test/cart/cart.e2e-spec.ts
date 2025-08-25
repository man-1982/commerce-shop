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
      stock: 10 + productCounter,
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

  describe('Create new cart. Add item. Remove particular item. Remove remain item quantity', () => {
    it('should update product stock when adding/removing items in cart', async () => {
      // Define constants for all quantities used in test
      const INITIAL_PRODUCT_STOCK = 5;
      const CART_ADD_QUANTITY = 5;
      const CART_REMOVE_FIRST = 3;
      const CART_REMOVE_SECOND = 2;
      console.log(
        `1. Create a product with quantity/stock ${INITIAL_PRODUCT_STOCK}`,
      );
      // 1. Create a product with quantity/stock 5
      const product = await prisma.product.create({
        data: {
          title: 'Stock Test Product',
          sku: 'STOCK-SKU-001',
          price: 100.0,
          stock: INITIAL_PRODUCT_STOCK,
        },
      });

      // 2. using existing "user"
      console.log(`2. Using exisiting user  ${user.uid}`);

      console.log(
        `3. Add product to cart  ${product.pid} quantity: ${CART_ADD_QUANTITY}`,
      );
      // 3. Add product to cart
      const createCartDto: CreateCartDto = {
        uid: user.uid,
        pid: product.pid,
        quantity: CART_ADD_QUANTITY,
      };
      const createRes = await request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(HttpStatus.CREATED);

      const cartId = createRes.body.cid;

      // 4. Check the product stock should be 0
      const productAfterAdd = await prisma.product.findUnique({
        where: { pid: product.pid },
        select: { stock: true },
      });
      expect(productAfterAdd?.stock).toBe(
        INITIAL_PRODUCT_STOCK - CART_ADD_QUANTITY,
      );

      // 5. Check cart for this product. In cart should be 5.
      const cartAfterAdd = await request(app.getHttpServer())
        .get(`/cart/${cartId}`)
        .expect(HttpStatus.OK);
      expect(cartAfterAdd.body.quantity).toBe(CART_ADD_QUANTITY);

      // 6. Remove this product from cart with quantity 3
      const removeFirstDto: RemoveItemDto = {
        pid: product.pid,
        quantity: CART_REMOVE_FIRST,
      };
      await request(app.getHttpServer())
        .patch(`/cart/remove/${cartId}`)
        .send(removeFirstDto)
        .expect(HttpStatus.OK);

      // 7. Check the cart. in the cart should be 5-3 = 2
      const cartAfterRemoveFirst = await request(app.getHttpServer())
        .get(`/cart/${cartId}`)
        .expect(HttpStatus.OK);
      expect(cartAfterRemoveFirst.body.quantity).toBe(
        CART_ADD_QUANTITY - CART_REMOVE_FIRST,
      );

      // 8. CHECK the product quantity it should be 3.
      const productAfterRemoveFirst = await prisma.product.findUnique({
        where: { pid: product.pid },
        select: { stock: true },
      });
      expect(productAfterRemoveFirst?.stock).toBe(CART_REMOVE_FIRST);

      // 9. Remove 2 from cart. it should be 0 for this product in the cart.
      const removeSecondDto: RemoveItemDto = {
        pid: product.pid,
        quantity: CART_REMOVE_SECOND,
      };
      await request(app.getHttpServer())
        .patch(`/cart/remove/${cartId}`)
        .send(removeSecondDto)
        .expect(HttpStatus.OK);

      const cartAfterRemoveAll = await request(app.getHttpServer())
        .get(`/cart/${cartId}`)
        .expect(HttpStatus.OK);
      expect(cartAfterRemoveAll.body.quantity).toBe(
        CART_ADD_QUANTITY - CART_REMOVE_FIRST - CART_REMOVE_SECOND,
      );

      // 10. Check the product it should be 5
      const productResponse = await request(app.getHttpServer())
        .get(`/products/${product.pid}`)
        .expect(HttpStatus.OK);
      expect(productResponse.body.stock).toBe(INITIAL_PRODUCT_STOCK);
    });
  });
});
