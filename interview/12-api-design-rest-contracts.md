# 12. API Design, REST Contracts & Gateway Middleware

## 1. RESTful Standards & HTTP Verb Idempotency
| Verb | Target URI | Status Code | Idempotent? | Purpose |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/products` | `200 OK` | **Yes** | Retrieve resource list. |
| `POST` | `/api/v1/orders` | `201 Created` | **No** | Create new order (requires `Idempotency-Key` header). |
| `PUT` | `/api/v1/users/:id` | `200 OK` | **Yes** | Full replacement of user profile. |
| `PATCH` | `/api/v1/users/:id` | `200 OK` | **No** | Partial update of user profile fields. |
| `DELETE` | `/api/v1/cart/items/:id` | `204 No Content` | **Yes** | Remove item from cart. |

---

## 2. Status Codes & Error Contract Standard
- `201 Created`: Resource successfully created (Returns `Location` header).
- `400 Bad Request`: Validation failure (Malformed payload).
- `401 Unauthorized`: Missing or expired JWT token.
- `403 Forbidden`: Authenticated user lacks required RBAC role (e.g. non-admin accessing merchant stats).
- `409 Conflict`: Idempotency lock active or duplicate resource creation attempt.
- `422 Unprocessable Entity`: Business validation failure (e.g. cart items out of stock or agent loop exceeded).
- `429 Too Many Requests`: Request or token rate limit exceeded.

### Standard Error Response Schema
```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Requested item SKU-991 has insufficient inventory.",
    "correlationId": "req-88a2-41b9",
    "timestamp": "2026-09-27T22:30:00Z"
  }
}
```

---

## 3. Pagination, Filtering & Search Contracts
- **Cursor Pagination Contract**: `GET /api/v1/products?limit=20&cursor=64f1a2e8b&category=electronics&sort=-price`
- **Response Format**:
```json
{
  "data": [ ... ],
  "pagination": {
    "nextCursor": "64f1a3f9c",
    "hasMore": true
  }
}
```

---

## 4. API Gateway Resiliency Controls
- **Correlation ID Injection**: Gateway injects `X-Correlation-ID: req-<uuid>` into every request header, propagating through Express microservices to Python FastAPI AI endpoints for unified tracing.
- **Bulkhead Isolation**: Restricts concurrent connection pools per downstream service (e.g. max 50 concurrent sockets for `pricing-service` to prevent server resource exhaustion).
