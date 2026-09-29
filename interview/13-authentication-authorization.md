# 13. Authentication, Authorization & Security Architecture

## 1. Authentication Strategy: Dual JWT Token Pattern
- **Access Token**: Short-lived (15 minutes), signed via RS256 private key. Carries `user_id`, `email`, `role`.
- **Refresh Token**: Long-lived (7 days), stored in HTTP-Only, SameSite=Strict secure cookie. Persisted in Redis (`refresh_token:<user_id>`).
- **Refresh Token Rotation**: Upon consuming a refresh token, it is invalidated and replaced with a new token pair. If a revoked refresh token is presented, Redis flags security breach and revokes all tokens for that user session.

```
Client ──(POST /login)──► Auth Service ──► Sets HTTP-Only Cookie (Refresh Token) + Returns JSON (Access Token)
Client ──(Bearer Token)──► API Gateway ──► Validates RS256 Signature ──► Strips Token ──► Injects x-user-id
```

---

## 2. API Gateway Header Security Policy
- **Header Injection**: Gateway validates public JWT, strips incoming raw client headers, and appends trusted internal headers:
  - `x-user-id: 64f128...`
  - `x-user-email: user@domain.com`
  - `x-user-role: CUSTOMER`
- **Header Forgery Prevention**: API Gateway aggressively deletes any client-supplied headers starting with `x-user-*` before forwarding downstream. Core services reject requests not originating from gateway private subnet IPs.

---

## 3. Password Hashing & Secret Storage
- **Password Hashing**: Argon2id / bcrypt with salt factor 12. Prevents rainbow table attacks and GPU brute-forcing.
- **Secrets Management**: Sensitive keys (`JWT_PRIVATE_KEY`, `MONGO_URI`, `STRIPE_KEY`) injected at runtime via Docker Secrets / Kubernetes Secrets; never checked into repository.

---

## 4. Security Defenses: CSRF, XSS, & Injection
- **XSS Defense**: Content Security Policy (CSP) headers set via Helmet; user-generated HTML in Product Reviews sanitized via DOMPurify.
- **CSRF Defense**: State-changing API routes use JSON payloads + Bearer Authorization headers (not vulnerable to standard browser cookie auto-submission).
- **NoSQL Injection Defense**: Strict Mongoose schema casting + parameter sanitization (prevents query injection like `{ "email": { "$ne": null } }`).
