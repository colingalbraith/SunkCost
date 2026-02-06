import { useCallback } from 'react';
import type { Intention } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/time';

interface UseIntentionsReturn {
    intentions: Intention[];
    addIntention: (description: string, timeCommitted: number) => void;
    removeIntention: (id: string) => void;
    clearIntentions: () => void;
}

export function useIntentions(): UseIntentionsReturn {
    const [intentions, setIntentions] = useLocalStorage<Intention[]>('shame-intentions', []);

    const addIntention = useCallback((description: string, timeCommitted: number) => {
        const newIntention: Intention = {
            id: generateId(),
            description: description.trim(),
            time_committed: timeCommitted,
            created_at: Date.now(),
        };

        setIntentions(prev => [newIntention, ...prev]);
    }, [setIntentions]);

    const removeIntention = useCallback((id: string) => {
        setIntentions(prev => prev.filter(i => i.id !== id));
    }, [setIntentions]);

    const clearIntentions = useCallback(() => {
        setIntentions([]);
    }, [setIntentions]);

    return {
        intentions,
        addIntention,
        removeIntention,
        clearIntentions,
    };
}
