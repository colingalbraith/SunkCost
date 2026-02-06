import type { UserSettings } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface UseSettingsReturn {
    settings: UserSettings;
    updateSettings: (updates: Partial<UserSettings>) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
    birth_year: 1995,
    life_expectancy: 80,
};

export function useSettings(): UseSettingsReturn {
    const [settings, setSettings] = useLocalStorage<UserSettings>('shame-settings', DEFAULT_SETTINGS);

    const updateSettings = (updates: Partial<UserSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    return {
        settings,
        updateSettings,
    };
}
