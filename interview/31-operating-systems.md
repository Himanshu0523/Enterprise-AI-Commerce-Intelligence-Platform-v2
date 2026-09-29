# 31. Operating Systems Fundamentals & Process Management

## 1. Process vs Thread & Context Switching
- **Process**: Independent execution unit with its own virtual address space (Stack, Heap, Data, Code). Completely memory-isolated.
- **Thread**: Lightweight execution unit within a process sharing the process's Heap, Data, and Code memory, with its own Stack.
- **Context Switching**: OS saves CPU registers, Program Counter, and Stack Pointer of running process/thread and restores another. Process switches cause CPU cache invalidation and TLB flushes; Thread switches are lighter.
- **User Mode vs Kernel Mode & System Calls**: User mode restricts direct hardware access. Switching to Kernel mode via a **System Call** (`fork`, `read`, `write`, `exec`) enables OS kernel operations.

---

## 2. CPU Scheduling Algorithms & Concurrency
- **Scheduling Algorithms**:
  - *FCFS (First-Come, First-Served)*: Non-preemptive, suffers from Convoy Effect.
  - *SJF (Shortest Job First)*: Minimizes average waiting time; risks Starvation for long processes.
  - *Round Robin*: Time-sliced preemptive scheduling; ideal for multi-user interactive systems.
  - *Priority Scheduling*: Executes highest priority task first; prevented from Starvation via Aging.
- **Multithreading, Concurrency vs Parallelism**:
  - *Concurrency*: Managing multiple tasks making progress simultaneously on 1 or more cores (Time-slicing).
  - *Parallelism*: Executing multiple tasks at the exact same physical instant on multiple CPU cores.

---

## 3. Synchronization: Race Conditions, Mutex, Semaphore & Deadlock
- **Critical Section & Race Condition**: Shared memory region accessed concurrently without synchronization, leading to data corruption.
- **Mutex vs Semaphore**:
  - *Mutex*: Mutual exclusion lock owned exclusively by 1 thread.
  - *Counting Semaphore*: Integer counter allowing $N$ concurrent threads access to a shared resource pool.
- **Deadlock Conditions (Coffman)**:
  1. Mutual Exclusion
  2. Hold & Wait
  3. No Preemption
  4. Circular Wait
- **Banker's Algorithm & Starvation**: Banker's algorithm tests resource allocation safety before granting locks to avoid deadlock states. Starvation occurs when a process is indefinitely denied necessary resources due to lower priority.

---

## 4. Virtual Memory, Paging, TLB & Memory Allocation
- **Virtual Memory & Paging**: OS translates virtual memory addresses into physical RAM addresses using fixed 4KB Pages and Page Tables.
- **Page Fault & TLB (Translation Lookaside Buffer)**: A Page Fault triggers disk swap I/O when accessed page is missing from RAM. TLB is a high-speed CPU hardware cache for fast virtual-to-physical address translation.
- **Stack vs Heap & Memory Allocation**:
  - *Stack*: Contiguous, fast $O(1)$ memory for function call frames and primitive local variables.
  - *Heap*: Dynamic memory for objects/arrays allocated at runtime. Causes Internal/External Fragmentation managed by Garbage Collectors.

---

## 5. Inter-Process Communication (IPC) & Project Connection
- **IPC Mechanisms**: Shared Memory (Fastest), Pipes (FIFO byte streams), Unix Domain Sockets, Network Sockets.
- **Project Link**:
  - *Node.js*: Uses non-blocking I/O event loop on a single main thread, delegating disk/crypto I/O to libuv thread pool.
  - *Python ML*: Uses multi-process worker pools (`uvicorn --workers N`) to execute CPU-bound CLIP vector and LLM tensor workloads across multiple CPU cores, bypassing the Python GIL.
