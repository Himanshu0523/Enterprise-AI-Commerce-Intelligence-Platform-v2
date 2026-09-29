# 36. TypeScript Type System & Advanced Typing

## 1. Type System Foundations
- **`type` vs `interface`**:
  - `interface`: Extensible via declaration merging. Preferred for defining object shapes & API response contracts.
  - `type`: Cannot be merged; supports Union (`type Status = 'PENDING' | 'PAID'`), Primitive aliases, and Tuples.
- **`any` vs `unknown` vs `never`**:
  - `any`: Bypasses all static type checking.
  - `unknown`: Type-safe top type. Forces explicit type checking/guards before dereferencing properties.
  - `never`: Bottom type representing values that can never occur (e.g. function that throws an error or infinite loop).

---

## 2. Advanced Utility Types & Generics
- **Built-in Utility Types**:
  - `Partial<T>` / `Required<T>`: Makes all properties optional / required.
  - `Pick<T, K>` / `Omit<T, K>`: Constructs type keeping / removing keys `K`.
  - `Record<K, T>`: Maps keys of type `K` to values of type `T`.
  - `Readonly<T>`: Prevents reassignment of properties.

### Generic Discriminated Union Contract Pattern
```typescript
export interface GenericResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

// Discriminated Union for State Machine Transitions
export type OrderStateEvent = 
    | { status: 'PENDING'; orderId: string; cartTotal: number }
    | { status: 'PAID'; orderId: string; transactionId: string }
    | { status: 'FAILED'; orderId: string; errorMessage: string };

function processOrderState(event: OrderStateEvent) {
    switch (event.status) {
        case 'PAID':
            console.log(`Charged: ${event.transactionId}`);
            break;
        case 'FAILED':
            console.error(`Error: ${event.errorMessage}`);
            break;
    }
}
```
