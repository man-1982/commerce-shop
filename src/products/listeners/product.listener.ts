import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductsService } from '../products.service';

@Injectable()
export class ProductListener {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * On Cart items update
   * @param event
   */
  @OnEvent('cart.items.updated', { async: true })
  async handleCartItemsUpdated(event: {
    item: { pid: number; quantity: number };
  }) {
    const updatedProduct = await this.productsService.updateQuantity(
      event.item.pid,
      -event.item.quantity,
    );
    console.log('Product updated in listener:', updatedProduct);
  }

  /**
   * On cart delete
   * @param event
   */
  @OnEvent('cart.deleted', { async: true })
  async handleCartDeleted(event: {
    items: { pid: number; quantity: number }[];
  }) {
    // TODO: Improve to execute at one query
    for (const item of event.items) {
      await this.productsService.updateQuantity(item.pid, item.quantity);
    }
  }

  /**
   * On cart create
   * @param event
   */
  @OnEvent('cart.created', { async: true })
  handlerCartCreate(event: any) {
    console.log('cart created', event);
  }

  /**
   * On cart closed
   * @param event
   */
  @OnEvent('cart.closed', { async: true })
  handlerCartClosed(event: any) {
    console.log('cart closed', event);
  }
}
