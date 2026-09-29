# 35. JavaScript Language Internals & V8 Execution

## 1. Execution Context, Call Stack, Scope & Closures
- **Execution Context**: Created in 2 phases:
  1. *Creation Phase*: Allocates memory for variables (`hoisting`), sets up Scope Chain, and binds `this`.
  2. *Execution Phase*: Executes code line-by-line.
- **Temporal Dead Zone (TDZ)**: Period between entering scope and variable declaration where accessing `let` or `const` throws `ReferenceError`.
- **Closure**: Function bundled with its lexical environment. Allows inner functions access to outer variables even after outer function returns.
- **Prototype & Prototype Chain**: Objects inherit properties via `__proto__` link traversing up to `Object.prototype`.

---

## 2. Event Loop: Microtasks vs Macrotasks
```
Call Stack ──► Microtask Queue (Promise.then, queueMicrotask) ──► Macrotask Queue (setTimeout, I/O) ──► UI Render
```
- **Microtask Queue**: Higher priority. `Promise.then`, `async/await` continuations, and `process.nextTick` execute *all* pending items before yielding.
- **Macrotask Queue**: Lower priority. `setTimeout`, `setInterval`, `setImmediate`, and I/O callbacks execute 1 item per event loop tick.

---

## 3. High-Frequency JS Coding Patterns & Utilities

### Promises & Async Control Flow
- `Promise.all([p1, p2])`: Resolves when all succeed; rejects fast on first failure.
- `Promise.allSettled([p1, p2])`: Resolves when all complete (returns `{ status, value/reason }`).
- `Promise.race([p1, p2])`: Resolves/rejects as soon as *first* promise settles.

### Debounce vs Throttle Implementation
```js
// Debounce: Executes after 'delay' ms of silence
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Throttle: Executes at most once every 'limit' ms
function throttle(fn, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
```
