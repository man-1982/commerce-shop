import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductsService } from '../products.service';

@Injectable()
export class ProductListener {
  constructor(private readonly productsService: ProductsService) {}

  @OnEvent('cart.items.updated', { async: true })
  handleCartItemsUpdated(event: { item: { pid: number; quantity: number } }) {
    await this.productsService.updateQuantity(
      event.item.pid,
      -event.item.quantity,
    );
  }

  @OnEvent('cart.deleted', { async: true })
  handleCartDeleted(event: { items: { pid: number; quantity: number }[] }) {
    // TODO: Improve to execute at one query
    for (const item of event.items) {
      await this.productsService.updateQuantity(item.pid, item.quantity);
    }
  }

  @OnEvent('cart.created', { async: true })
  handlerCartCreate(event: any) {
    console.log('cart created', event);
  }
  @OnEvent('cart.closed', { async: true })
  handlerCartClosed(event: any) {
    console.log('cart closed', event);
  }
}
