# 38. Docker Containers & Kubernetes (K8s) Orchestration

## 1. Docker Foundations & Multi-Stage Builds
- **Image vs Container vs Layer**: Docker Image is a read-only template built from stacked file system layers; Container is an isolated, writable running instance of an image.
- **Multi-Stage Build Pattern**: Minimizes production image size by separating build tools from final runtime artifacts.
  ```dockerfile
  # Build Stage
  FROM node:18-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  # Production Stage
  FROM node:18-alpine AS runner
  WORKDIR /app
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/node_modules ./node_modules
  USER node
  CMD ["node", "dist/index.js"]
  ```

---

## 2. Docker Compose vs Kubernetes
- **Docker Compose**: Orchestrates multi-container applications on a single host node (`docker-compose.yml`). Used for local development.
- **Kubernetes (K8s)**: Production multi-node cluster orchestrator providing autoscaling, rolling updates, self-healing, and service discovery across hundreds of nodes.

---

## 3. Core Kubernetes Abstractions
- **Pod**: Smallest deployable execution unit containing 1 or more containers sharing network IP and volumes.
- **Deployment**: Declarative controller managing Pod replicas, rolling updates, and automated rollbacks.
- **Service & Ingress**: `Service` provides stable internal IP load balancing across Pods; `Ingress` manages external HTTP/HTTPS routing.
- **ConfigMap & Secret**: Decouple environment configuration and encrypted secret keys from container images.
- **Probes**:
  - *Liveness Probe*: Checks if container is alive; restarts container if failing.
  - *Readiness Probe*: Checks if container is ready to accept user traffic; removes from load balancer if failing.
- **Horizontal Pod Autoscaler (HPA)**: Automatically adjusts Pod replica counts based on CPU usage or custom metrics (e.g. Kafka consumer queue lag).
