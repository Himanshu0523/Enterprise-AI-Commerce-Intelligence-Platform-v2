# 🛒 Customer Storefront Web Application

### Next.js 14 • React 18 • RAG Search Widget • Visual Search • Dynamic Pricing

This directory contains the **Customer-Facing Storefront**, providing an AI-native shopping experience featuring RAG-powered customer support, visual product search, dynamic personalized recommendations, and checkout flows.

---

## 🛠️ Tech Stack & Features

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Lucide Icons
- **AI Features**: 
  - **RAG Support Chatbot Widget**: Instant product queries via vector knowledge base (`rag-service`).
  - **Visual Similarity Search**: Image upload matching using CLIP embeddings (`visual-search-service`).
  - **Personalized Recommendations**: Two-tower neural collaborative filtering (`ml-service`).
- **Transactional Flow**: Algorithmic Redis Lua script lock-free inventory reservations during flash sales.

---

## 🚀 Getting Started

### Run Development Server:
```bash
npm run dev
# or from root
pnpm dev --filter storefront
```

Open `http://localhost:3000` to view the storefront application.

---

## 🔗 Connected Services
All frontend requests route through the **API Gateway** (`http://localhost:8000`), which proxies authentication, rate limiting, and core microservices.
