'use client';
import { Provider } from 'react-redux';
import { store } from '@/lib/store'; // you need to create this

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}