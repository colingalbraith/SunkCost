import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for persisting state to localStorage
 * @param key - Storage key
 * @param initialValue - Default value if nothing stored
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    // Get initial value from storage or use default
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when state changes
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            setStoredValue(prev => {
                const valueToStore = value instanceof Function ? value(prev) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                return valueToStore;
            });
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key]);

    // Sync with other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(`Error parsing storage event for "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue];
}
