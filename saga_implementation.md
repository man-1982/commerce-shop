[Boundary]
- Orchestrate any cart changes so they update product stock.
- Cart module = orchestrator. Product module = stock authority.
- Use RabbitMQ for messaging.

[Contracts]
- Commands: ReserveStock, ReleaseStock.
- Events: CartItemAdded, CartItemQtyChanged, CartItemRemoved, CartCleared, StockReserved, StockRejected, StockReleased.
- Topics: inventory.commands.*, inventory.events.*, cart.events.*

[Data Model]
- Outbox table (cart + product).
- SagaState table (cart).
- CartReservation table (product, unique cartId+productId).

[RabbitMQ Setup]
- Exchange: commerce.internal
- Queues: inventory.commands, inventory.events, cart.events
- Routing keys: inventory.commands.reserve/release, inventory.events.reserved/rejected/released.

[Outbox]
- Cart and Product write events to Outbox in same DB transaction.
- Publisher loop sends to RabbitMQ and marks sent.
- At-least-once delivery; handlers must be idempotent.

[Cart Orchestrator]
- Listens to cart events.
- Maps cart deltas → commands:
    * delta > 0 → ReserveStock
    * delta < 0 → ReleaseStock
- Tracks SagaState per cart.

[Product Responsibilities]
- On ReserveStock: check/decrement, upsert CartReservation, emit StockReserved/Rejected.
- On ReleaseStock: increment, mark reservation released, emit StockReleased.
- All emits go via Outbox.

[Idempotency]
- Use eventId in every message.
- Product enforces uniqueness with CartReservation and lastEventId.
- Ignore duplicates.

[Timeouts & Compensation]
- Orchestrator sets timeout for StockReserved/Rejected.
- On timeout: retry, then mark FAILED.
- On rejection: revert cart qty or notify user.
- On release timeout: retry; manual alert if stuck.

[State Machine]
- Saga states: IN_SYNC → RESERVING/RELEASING → IN_SYNC.
- Failure branches: FAILED, COMPENSATING.

[Choreography Side Effects]
- Emit public cart.synced event when stock is updated.
- Side-effects (analytics, audit) consume only this; no compensation.

[Observability]
- Correlation IDs: cartId, productId, eventId in logs.
- Metrics: Outbox backlog, Saga states, retries, DLQ size.
- Alerts: timeouts, repeated stock rejections.

[Testing]
- Unit: product handlers idempotency.
- Saga: simulate add/change/remove, check commands issued.
- Chaos: duplicates, reordering, broker outage.
- Concurrency: simultaneous updates to same product/cart.

[Rollout]
- Deploy Outbox + publisher (no behavior change).
- Run CartSaga in observe mode first.
- Gradually enable sending Reserve/Release commands.
- Monitor metrics; ramp up traffic.
- Enable cart.synced public events after stabilization.

[Runbooks]
- Stock mismatch: reconcile by releasing stale reservations and adjusting cart.
- Stuck reservations: reconciliation job issues compensating releases.

[Performance]
- Tune outbox batch size/polling interval.
- Index cartId+productId, Outbox.sentAt.
- Retry policy: backoff 200ms → 1s → 5s, cap retries.
