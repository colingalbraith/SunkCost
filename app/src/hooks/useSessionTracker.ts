import { useState, useEffect, useCallback, useRef } from 'react';
import type { Session } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateId, isToday, isThisWeek } from '../utils/time';

interface UseSessionTrackerReturn {
    // Current session state
    isTracking: boolean;
    currentSessionStart: number | null;
    elapsedTime: number;

    // History
    sessions: Session[];
    clearSessions: () => void;

    // Stats
    todayTotal: number;
    weekTotal: number;
    allTimeTotal: number;
}

// Minimum session duration to record (5 seconds)
const MIN_SESSION_DURATION = 5000;

export function useSessionTracker(): UseSessionTrackerReturn {
    const [sessions, setSessions] = useLocalStorage<Session[]>('shame-sessions', []);
    const [currentSessionStart, setCurrentSessionStart] = useLocalStorage<number | null>('shame-current-session', null);
    const [elapsedTime, setElapsedTime] = useState(0);

    const intervalRef = useRef<number | null>(null);

    const isTracking = currentSessionStart !== null;

    // Start a new session
    const startSession = useCallback(() => {
        if (currentSessionStart === null) {
            setCurrentSessionStart(Date.now());
        }
    }, [currentSessionStart, setCurrentSessionStart]);

    // Stop and save the current session
    const stopSession = useCallback(() => {
        if (!currentSessionStart) return;

        const now = Date.now();
        const duration = now - currentSessionStart;

        // Only save sessions longer than minimum duration
        if (duration >= MIN_SESSION_DURATION) {
            const newSession: Session = {
                id: generateId(),
                start_time: currentSessionStart,
                end_time: now,
                duration,
                device_type: 'computer',
            };

            setSessions(prev => [newSession, ...prev]);
        }

        setCurrentSessionStart(null);
    }, [currentSessionStart, setSessions, setCurrentSessionStart]);

    // Auto-track: start when app opens, stop only when app closes
    useEffect(() => {
        const handleBeforeUnload = () => {
            stopSession();
        };

        // Start tracking immediately when the app opens
        startSession();

        // Only stop tracking when the app is actually closing
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [startSession, stopSession]);

    // Update elapsed time every second when tracking
    useEffect(() => {
        if (isTracking && currentSessionStart) {
            // Initial calculation
            setElapsedTime(Date.now() - currentSessionStart);

            // Update every second
            intervalRef.current = window.setInterval(() => {
                setElapsedTime(Date.now() - currentSessionStart);
            }, 1000);

            return () => {
                if (intervalRef.current) {
                    window.clearInterval(intervalRef.current);
                }
            };
        } else {
            setElapsedTime(0);
        }
    }, [isTracking, currentSessionStart]);

    const clearSessions = useCallback(() => {
        setSessions([]);
    }, [setSessions]);

    // Calculate stats (include current session in today's total)
    const currentSessionTime = isTracking ? elapsedTime : 0;

    const todayTotal = sessions
        .filter(s => isToday(s.start_time))
        .reduce((sum, s) => sum + s.duration, 0) + currentSessionTime;

    const weekTotal = sessions
        .filter(s => isThisWeek(s.start_time))
        .reduce((sum, s) => sum + s.duration, 0) + currentSessionTime;

    const allTimeTotal = sessions.reduce((sum, s) => sum + s.duration, 0) + currentSessionTime;

    return {
        isTracking,
        currentSessionStart,
        elapsedTime,
        sessions,
        clearSessions,
        todayTotal,
        weekTotal,
        allTimeTotal,
    };
}
