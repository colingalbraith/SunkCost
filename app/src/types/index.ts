// Digital Shame Mirror - Type Definitions

export interface Session {
    id: string;
    start_time: number;
    end_time: number | null;
    duration: number;
    device_type: 'phone' | 'computer';
}

export interface Intention {
    id: string;
    description: string;
    time_committed: number; // minutes per day
    created_at: number;
}

export interface DailyStats {
    date: string; // YYYY-MM-DD
    total_time: number; // milliseconds
    pickup_count: number;
    sessions: Session[];
}

export interface UserSettings {
    birth_year: number;
    life_expectancy: number; // years
}
