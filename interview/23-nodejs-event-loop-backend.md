# 23. Node.js Event Loop & Express Backend Architecture

## 1. Node.js Event Loop Architecture
```
┌───────────────────────────┐
│          timers           │  <-- setTimeout, setInterval
└─────────────┬─────────────┘
┌─────────────▼─────────────┐
│     pending callbacks     │  <-- I/O callbacks
└─────────────┬─────────────┘
┌─────────────▼─────────────┐
│       poll phase          │  <-- Retrieve new I/O events
└─────────────┬─────────────┘
┌─────────────▼─────────────┐
│          check            │  <-- setImmediate
└─────────────┬─────────────┘
┌─────────────▼─────────────┐
│      close callbacks      │  <-- socket.on('close')
└───────────────────────────┘
```

- **Microtasks vs Macrotasks**:
  - *Microtasks* (`process.nextTick`, `Promise.then` resolution) execute **immediately** after the current operation finishes, before moving to the next event loop phase.
  - *Macrotasks* (`setTimeout`, `setImmediate`) execute in their respective event loop phases.

---

## 2. Event Loop Blocking Prevention
- **Avoid CPU Heavy Tasks on Main Thread**: Heavy CPU workloads (e.g. image vectorization, complex ML matrix calculations) are **never** executed in Express Node.js services. They are offloaded to Python FastAPI AI microservices.
- **Asynchronous Non-Blocking I/O**: All database queries (Mongoose) and Redis calls use `async/await` Promises to keep the main thread poll loop unblocked.

---

## 3. Graceful Shutdown (SIGTERM Handling)
- When Docker sends `SIGTERM`:
  1. Express server stops accepting new incoming HTTP connections (`server.close()`).
  2. Waits for active in-flight HTTP requests to finish (with 10s timeout).
  3. Flushes Kafka producer queues and closes Redis/MongoDB connection pools cleanly.
  4. Exits process with code `0`.
