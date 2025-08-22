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
- ✅ Events & Emitters: Cart, Product, User, Image

### In Progress

- 🚧 Cart tests
- 🚧 Add tests data (some JSON data and separate comand to fill put the DB using these datasets)

### TODO
- 📝 Authentication & Authorization (JWT)
- 📝 Logging and monitoring solution


## Emmiters

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

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm
- Docker and Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/man-1982/commerce-shop.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application with Docker Compose

1. Use exisiting or create a new `.env` file in the root of the project with the content from .env.example:


2.  Run the application using Docker Compose:

    ```bash
    docker-compose up -d
    ```
3. Run Prisma studio to DB access

     ```bash
      prisma studio
    ```

4. Swagger API documentation is available at:

http://localhost:3333/api/docs#/

This will start the NestJS application and a PostgreSQL database.

## Generating Dummy Data

You can generate dummy data for users and products by running the end-to-end tests. Set the `GENERATE_ITEMS` environment variable to prevent the tests from cleaning up the database before running.

```bash
    test:e2e:generate 
```
This command will populate the database with sample data, which can be useful for development and testing purposes.

## Events


## Emitters




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
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```