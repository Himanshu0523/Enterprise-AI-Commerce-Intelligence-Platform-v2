# 22. Next.js 14 & React Frontend Architecture

## 1. Next.js 14 App Router Rendering Strategies
- **Server Components (RSC)**: Default components executed exclusively on the server. Used for initial product catalog rendering and static content to achieve fast Time-to-First-Byte (TTFB) and zero JavaScript bundle overhead.
- **Client Components (`"use client"`)**: Opt-in for interactive UI elements (interactive cart drawer, stateful checkout form, search inputs).
- **Incremental Static Regeneration (ISR)**: Product pages statically generated at build time and revalidated in the background every 60 seconds (`export const revalidate = 60`).

---

## 2. React Optimization Techniques
- **Hydration & Mismatch Prevention**: Suppress hydration mismatch on dynamic client attributes (e.g. local time format) using custom `useHasMounted` hook.
- **State Management & Caching**: TanStack Query (React Query) handles server state fetching, background refetching, and optimistic updates for cart item modifications.
- **Performance**:
  - `useCallback` / `useMemo` used for expensive cart price calculation functions.
  - Image optimization via Next.js `<Image>` component enforcing WebP conversion and responsive sizing.
