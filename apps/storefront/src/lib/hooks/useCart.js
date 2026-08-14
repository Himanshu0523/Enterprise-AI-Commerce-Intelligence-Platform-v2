'use client';

import { useState, useEffect } from 'react';

export function useCart() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Mock: you can later use Zustand or context
    // setItemCount(2); // placeholder
  }, []);

  return { itemCount };
}