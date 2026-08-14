# 🖥️ Enterprise Merchant Admin Dashboard

### Next.js 14 • Turborepo • TailwindCSS • Shadcn/UI • Real-Time AI Agent Control

This directory contains the **Enterprise Admin Dashboard**, built for store managers and operators to monitor catalog inventory, demand forecasting, real-time fraud flags, dynamic price bounds, and autonomous AI agent operations.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router)
- **UI Components**: Shared `@workspace/ui` (Shadcn/UI + TailwindCSS)
- **State & API**: React Query / Hooks connecting to API Gateway (`http://localhost:8000`)
- **Monorepo Management**: Turborepo + pnpm workspaces

---

## 🚀 Getting Started

### Run Independently:
```bash
npm run dev --filter admin-dashboard
# or from root
pnpm dev --filter admin-dashboard
```

The application will launch on `http://localhost:3002` (or configured admin port).

---

## 📊 Key Features

1. **AI Agent Supervisor Monitor**: Real-time graph monitoring for `agent-service` LangGraph loops, financial token budget gauges, and manual Human-In-The-Loop (HITL) price/order approvals.
2. **Dynamic Pricing Controls**: Set floor prices and MSRP ceilings for automated reinforcement learning dynamic pricing.
3. **Demand Forecasting Visualizer**: Interactive time-series revenue and SKU stock level charts powered by `forecast-service`.
4. **Real-time Fraud Review Console**: Audit flagged high-risk transactions from `fraud-service`.
