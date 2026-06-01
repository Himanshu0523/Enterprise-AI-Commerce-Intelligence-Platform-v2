import { useContext } from 'react';
import { ToastContext } from './ToastContextValue';

export const useToast = () => useContext(ToastContext);
