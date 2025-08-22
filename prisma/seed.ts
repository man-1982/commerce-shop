import { faker } from '@faker-js/faker';
import { PrismaService } from '../src/prisma/prisma.service';
import { Product, User } from '@prisma/client';

const prisma = new PrismaService();

async function main() {
  console.log('Start seeding...');
  await prisma.product.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.cart.deleteMany({});

  // Create users
  const users: User[] = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
    users.push(user);
  }
  console.log(`${users.length} users created.`);

  // Create products
  const products: Product[] = [];
  for (let i = 0; i < 20; i++) {
    const product = await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        sku: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        quantity: faker.number.int({ min: 1, max: 100 }),
      },
    });
    products.push(product);
  }
  console.log(`${products.length} products created.`);

  // Create images for products
  for (const product of products) {
    const numImages = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < numImages; i++) {
      await prisma.image.create({
        data: {
          imageData: faker.image.url(),
          title: faker.lorem.words({ min: 1, max: 2 }),
          pid: product.pid,
        },
      });
    }
  }
  console.log('Images created for products.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
