import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  // constructor() {
  //   // Dev-only query logging (helpful for debugging)
  //   if (process.env.NODE_ENV === 'development') {
  //     // log levels if needed: ['query', 'info', 'warn', 'error']
  //     super({ log: ['warn', 'error'] });
  //     // @ts-expect-error
  //     this.$on('query', (e) => {
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-expect-error
  //       console.log('Query: ' + e.query);
  //       // @ts-expect-error
  //       console.log('Params: ' + e.params);
  //       // @ts-expect-error
  //       console.log('Duration: ' + e.duration + 'ms');
  //     });
  //   }
  // }

  async onModuleInit() {
    await super.$connect();
  }

  async onModuleDestroy() {
    await super.$disconnect();
  }
}
