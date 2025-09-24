'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [hydrated, setHydrated] = useState(false);
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    // This effect runs only on the client
    setHydrated(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  useEffect(() => {
    // This effect runs on the client only after hydration is complete
    if (hydrated) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}
