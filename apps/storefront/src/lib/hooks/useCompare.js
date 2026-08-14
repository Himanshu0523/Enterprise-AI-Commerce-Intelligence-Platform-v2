/* eslint-disable react-hooks/set-state-in-effect */
// src/lib/hooks/useCompare.js
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const MAX_COMPARE = 4;
const STORAGE_KEY = 'compare_ids';

/**
 * Custom hook to manage product comparison list with URL query params and localStorage persistence
 * @returns {Object}
 */
export function useCompare() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ids, setIds] = useState([]);
  
  // Use a ref to track whether initial synchronization has occurred
  const isInitialized = useRef(false);

  const updateUrl = useCallback(
    (newIds) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newIds.length > 0) {
        params.set('ids', newIds.join(','));
      } else {
        params.delete('ids');
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, searchParams, router]
  );

  // Sync with URL and localStorage on mount and searchParams change
  useEffect(() => {
    const param = searchParams.get('ids');
    if (param) {
      const idsFromUrl = param.split(',').filter((id) => id);
      setIds(idsFromUrl);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(idsFromUrl));
      isInitialized.current = true;
    } else {
      // Fallback to localStorage only if not already initialized from URL
      if (!isInitialized.current) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setIds(parsed);
              updateUrl(parsed);
            }
          } catch {
            // ignore parsing error
          }
        }
      }
      isInitialized.current = true;
    }
  }, [searchParams, updateUrl]);

  const add = useCallback(
    (productId) => {
      setIds((prev) => {
        if (prev.includes(productId)) return prev;
        if (prev.length >= MAX_COMPARE) {
          return prev;
        }
        const newIds = [...prev, productId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
        updateUrl(newIds);
        return newIds;
      });
    },
    [updateUrl]
  );

  const remove = useCallback(
    (productId) => {
      setIds((prev) => {
        const newIds = prev.filter((id) => id !== productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
        updateUrl(newIds);
        return newIds;
      });
    },
    [updateUrl]
  );

  const toggle = useCallback(
    (productId) => {
      setIds((prev) => {
        if (prev.includes(productId)) {
          const newIds = prev.filter((id) => id !== productId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
          updateUrl(newIds);
          return newIds;
        } else {
          if (prev.length >= MAX_COMPARE) {
            return prev;
          }
          const newIds = [...prev, productId];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
          updateUrl(newIds);
          return newIds;
        }
      });
    },
    [updateUrl]
  );

  const clear = useCallback(() => {
    setIds([]);
    localStorage.removeItem(STORAGE_KEY);
    updateUrl([]);
  }, [updateUrl]);

  const isComparing = useCallback((productId) => ids.includes(productId), [ids]);

  return { ids, add, remove, toggle, clear, isComparing, maxCount: MAX_COMPARE };
}