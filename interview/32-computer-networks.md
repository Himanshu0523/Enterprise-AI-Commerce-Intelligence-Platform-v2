# 32. Computer Networks, OSI/TCP-IP & Web Protocols

## 1. Complete Request Lifecycle: "What Happens When You Type `https://store.com/checkout`?"
```
Browser ──► DNS Lookup ──► ARP/IP ──► TCP Handshake ──► TLS 1.3 ──► HTTP POST ──► Reverse Proxy/Gateway (:8000) ──► Microservices
```
1. **URL Parsing & HSTS Check**: Browser validates protocol (`https://`), host (`store.com`), port (`443`), and checks HSTS policy.
2. **DNS Resolution**: Checks browser cache $\rightarrow$ OS hosts file $\rightarrow$ Resolver $\rightarrow$ Root $\rightarrow$ TLD $\rightarrow$ Authoritative DNS (returns IP `1.2.3.4`).
3. **ARP & Routing**: Address Resolution Protocol (ARP) resolves target IP gateway to physical MAC address. Packets route across network via IP & NAT.
4. **TCP 3-Way Handshake**: Client `SYN` $\rightarrow$ Server `SYN-ACK` $\rightarrow$ Client `ACK` (Establishes reliable socket connection).
5. **TLS 1.3 Handshake**: Client Hello (supported ciphers) $\rightarrow$ Server Hello + Certificate $\rightarrow$ Key Exchange (ECDHE) $\rightarrow$ Encrypted Session Keys generated.
6. **HTTP POST Request**: Browser sends `POST /api/v1/orders` with headers, cookies, and JSON body payload.
7. **Reverse Proxy & Gateway (:8000)**: AWS ALB / NGINX terminates TLS $\rightarrow$ Express API Gateway checks CORS, strips untrusted headers, verifies JWT Bearer token, enforces rate limits $\rightarrow$ Proxies to `order-service:3006`.
8. **Downstream Execution & Response**: Order Service writes MongoDB transaction, emits Kafka event, returns `201 Created` JSON response back through TLS tunnel to client.

---

## 2. OSI 7-Layer vs TCP/IP 4-Layer Model
| OSI Layer | TCP/IP Layer | Protocol / Technology | Purpose |
| :--- | :--- | :--- | :--- |
| **7. Application** | Application | HTTP, HTTPS, WebSocket, gRPC, DNS | User application protocol logic. |
| **6. Presentation** | Application | TLS / SSL, JSON, Protobuf | Data encryption, compression, formatting. |
| **5. Session** | Application | Sockets, NetBIOS | Session management. |
| **4. Transport** | Transport | TCP, UDP | End-to-end transport, port addressing, flow control. |
| **3. Network** | Internet | IP (v4/v6), ICMP, ARP | Logical IP routing across routers. |
| **2. Data Link** | Network Access | Ethernet, Wi-Fi, MAC addresses | Physical node-to-node frame transfer. |
| **1. Physical** | Network Access | Cables, Fiber, Radio signals | Binary bit transmission over hardware. |

---

## 3. TCP vs UDP & HTTP Protocol Evolution
- **TCP vs UDP**:
  - *TCP*: Connection-oriented, reliable ordered stream, congestion control, windowing. Used for REST, gRPC, Kafka.
  - *UDP*: Connectionless, unordered datagrams, low latency. Used for DNS, QUIC, video streaming.
- **HTTP/1.1 vs HTTP/2 vs HTTP/3**:
  - *HTTP/1.1*: Plaintext, persistent connection, suffers from Head-of-Line (HoL) blocking on requests.
  - *HTTP/2*: Binary protocol, multiplexing over single TCP stream, header compression (HPACK), Server Push (gRPC transport layer).
  - *HTTP/3*: Uses QUIC over UDP; eliminates TCP network-level Head-of-Line blocking on packet drops.

---

## 4. WebSockets vs Webhooks vs REST vs gRPC
- **REST**: Stateless HTTP pull model. Lightweight JSON payloads over HTTP/1.1 or HTTP/2.
- **gRPC**: High-performance HTTP/2 binary RPC using Protocol Buffers (`.proto`). Used for microservice-to-microservice calls.
- **WebSockets**: Full-duplex persistent TCP socket connection for real-time bi-directional streaming (e.g. live order tracking).
- **Webhooks**: Event-driven asynchronous HTTP POST callbacks sent by 3rd party providers (Stripe payment webhook notifications).
- **CORS (Cross-Origin Resource Sharing)**: Browser security policy blocking cross-origin HTTP requests unless server responds with explicit `Access-Control-Allow-Origin` headers.
