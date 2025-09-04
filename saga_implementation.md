# Saga Implementation Plan: Hybrid Approach

## Phase 1: In-Process Event Handling (Simplified Hybrid)

### Step 1: Define Core Saga Steps and Critical Services

This section outlines the core steps of the order processing Saga and the services responsible for each step.  These steps require strict consistency and will be orchestrated.

**Core Saga Steps:**

1.  **Create Order:**  `OrderService` creates an order record.  This step initiates the Saga.
2.  **Reserve Inventory:** `InventoryService` reserves the required stock for the order.
3.  **Process Payment:** `PaymentService` processes the payment for the order.

**Critical Services:**

*   `OrderService`: Orchestrates the Saga and manages order records.
*   `InventoryService`: Manages product inventory and stock reservation.
*   `PaymentService`: Processes payments and handles refunds.


## Phase 2: RabbitMQ Integration (Mature Hybrid)  *(To be added later)*

