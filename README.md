# Commerce Shop NestJS Backend

This project is backend for an e-commerce platform built with the [NestJS](https://nestjs.com/) framework.
It uses :
    1. Prisma as the ORM. 
    2. PostgreSQL as database.

## TODO List

### Done
- ✅ Project Init
- ✅ User module (Simple implementation)
- ✅ Swagger setup
- ✅ Config setup
- ✅ Docker composer (simple version)
- ✅ Product module (1st pass)
- ✅ Cart module (1st pass)
- ✅ Product tests
- ✅ User tests
- ✅ Prisma ORM setup
- ✅ Image module: Emitters, Service, Controller, Swagger 
- ✅ Image module: Simple tests
- ✅ Events & Emitters: Cart, Product, User, Image - 2 pass
- ✅ Dummy data (seed) and some improvements
- ✅ Subscription for products on cart emmiters: update stock
- ✅ Enhanced cart test to verify emitters and product subscriptions


### TODO
- 📝 Subscriptions on events (emitters)
- 📝 Authentication & Authorization (JWT)
- 📝 Prisma log
- 📝 Monitoring
- 📝 Build optimisation
- 📝 Separate DB for the tests


## Emitters

`src/cart/cart.service.ts`
- **cart.created**: cart is created.
- **cart.items.updated**: cart are updated.
- **cart.closed**: cart is closed.
- **cart.deleted**: cart is deleted.

`src/image/image.service.ts`
- **image.created:** image is created.
- **image.updated**:  image is updated.
- **image.deleted**:  image is deleted.

`src/products/products.service.ts`
- **product.created**: product is created.
- **product.updated**: product is updated.
- **product.deleted**: product is deleted.

`src/user/user.service.ts`
- **user.created**: user is created.
- **user.updated**: user is updated.
- **user.deleted**: user is deleted.

## Modules

The application is divided into the following modules:

- **User:** Handles user authentication, registration, and management.
- **Products:** Manages the product catalog, including creating, updating, and retrieving product information.
- **Cart:** Manages the shopping cart functionality for users.
- **Image:** Manages the images  for products.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

###  Clone the Repository

```bash
    git clone https://github.com/man-1982/commerce-shop.git
    cd commerce-shop
```


###  Firsts start

  ```bash
      docker compose up -d
  ```
[http://localhost:3333/api/docs](http://localhost:3333/api/docs)

[http://localhost:5555](http://localhost:5555)


#### How to run prisma:seed under Docker

You can seed the database from inside the running application container. Replace <SERVICE_NAME> with your app service name from docker-compose.yml (for example, app or api).

Run inside the running container:
  ```bash
      docker compose exec api npm run prisma:seed
  ```
OR localy through u terminal

  ```bash
      npm run prisma:seed
  ```
This will create 10 users, 20 products, and some images for the products.

Also, you can run test with a GENERATE_ITEMS key 

  ```bash
      npm run test:e2e:generate
  ```



### Accessing the API and Database

- **Swagger API Documentation**: 
    [http://localhost:3333/api/docs](http://localhost:3333/api/docs)
- **Prisma Studio** (Database GUI):
Prisma studio has its own container and it available at [http://localhost:5555](http://localhost:5555).



## Development

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run tests

```bash
  npm run test:user    # Run user module tests
```

```bash
  npm run test:product # Run product module tests
```

```bash
  npm run test:image   # Run image module tests
```
```bash
  npm run test:cart    # Run cart module tests
```

```bash
# e2e tests
 npm run test:e2e
```