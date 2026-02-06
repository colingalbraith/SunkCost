// Time utility functions for Digital Shame Mirror

/**
 * Format milliseconds into human-readable duration
 * @param ms - Duration in milliseconds
 * @returns Formatted string like "2h 34m" or "45s"
 */
export function formatDuration(ms: number): string {
    if (ms < 0) ms = 0;

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
    }

    if (hours > 0) {
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }

    if (minutes > 0) {
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    return `${seconds}s`;
}

/**
 * Format milliseconds for live timer display
 * @param ms - Duration in milliseconds
 * @returns Formatted string like "02:34:56"
 */
export function formatTimerDisplay(ms: number): string {
    if (ms < 0) ms = 0;

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Convert milliseconds to days with decimal precision
 * @param ms - Duration in milliseconds
 * @returns Days as a decimal number
 */
export function getDaysWasted(ms: number): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return ms / msPerDay;
}

/**
 * Calculate percentage of remaining life wasted
 * @param ms - Time wasted in milliseconds
 * @param birthYear - User's birth year
 * @param lifeExpectancy - Expected lifespan in years (default 80)
 * @returns Percentage of remaining life
 */
export function calculateLifePercentage(
    ms: number,
    birthYear: number,
    lifeExpectancy: number = 80
): number {
    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - birthYear;
    const remainingYears = Math.max(lifeExpectancy - currentAge, 1);
    const remainingMs = remainingYears * 365.25 * 24 * 60 * 60 * 1000;

    return (ms / remainingMs) * 100;
}

/**
 * Get YYYY-MM-DD date string
 * @param date - Date object (defaults to now)
 * @returns Date string in YYYY-MM-DD format
 */
export function getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

/**
 * Get start and end of the current week (Sunday to Saturday)
 * @param date - Reference date
 * @returns Object with start and end dates
 */
export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

/**
 * Check if a timestamp is from today
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Boolean
 */
export function isToday(timestamp: number): boolean {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * Check if a timestamp is from this week
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Boolean
 */
export function isThisWeek(timestamp: number): boolean {
    const { start, end } = getWeekRange();
    return timestamp >= start.getTime() && timestamp <= end.getTime();
}

/**
 * Generate a unique ID
 * @returns Unique string ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
