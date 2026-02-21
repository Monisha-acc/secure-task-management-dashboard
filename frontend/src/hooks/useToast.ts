// Custom hook for managing toast notifications throughout the app
import { useState, useCallback } from 'react';
import { ToastMessage } from '../components/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // useCallback prevents unnecessary re-renders in child components
  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    // Use timestamp as unique id for each toast
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);


  // Remove toast by id - called automatically after 3.5 seconds
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}