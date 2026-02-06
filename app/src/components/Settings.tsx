import { useState } from 'react';

interface SettingsProps {
    birthYear: number;
    lifeExpectancy: number;
    onUpdate: (updates: { birth_year?: number; life_expectancy?: number }) => void;
    onClearHistory: () => void;
}

export function Settings({ birthYear, lifeExpectancy, onUpdate, onClearHistory }: SettingsProps) {
    const [localBirthYear, setLocalBirthYear] = useState(birthYear);
    const [localLifeExpectancy, setLocalLifeExpectancy] = useState(lifeExpectancy);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleSave = () => {
        onUpdate({
            birth_year: localBirthYear,
            life_expectancy: localLifeExpectancy,
        });
    };

    const handleClear = () => {
        if (showClearConfirm) {
            onClearHistory();
            setShowClearConfirm(false);
        } else {
            setShowClearConfirm(true);
        }
    };

    const hasChanges = localBirthYear !== birthYear || localLifeExpectancy !== lifeExpectancy;

    return (
        <div className="space-y-6">
            <h2>Settings</h2>

            <div className="card space-y-4">
                <h3>Mortality Calculator</h3>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    Used to calculate the percentage of your remaining life you're wasting.
                </p>

                <div className="space-y-2">
                    <label htmlFor="birthYear" style={{ display: 'block', fontWeight: 600 }}>
                        Birth Year
                    </label>
                    <input
                        id="birthYear"
                        type="number"
                        value={localBirthYear}
                        onChange={(e) => setLocalBirthYear(parseInt(e.target.value) || 1990)}
                        min="1900"
                        max={new Date().getFullYear()}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="lifeExpectancy" style={{ display: 'block', fontWeight: 600 }}>
                        Life Expectancy (years)
                    </label>
                    <input
                        id="lifeExpectancy"
                        type="number"
                        value={localLifeExpectancy}
                        onChange={(e) => setLocalLifeExpectancy(parseInt(e.target.value) || 80)}
                        min="1"
                        max="120"
                    />
                </div>

                {hasChanges && (
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Changes
                    </button>
                )}
            </div>

            {/* Clear Data Section */}
            <div className="card space-y-4">
                <h3>Data</h3>

                {!showClearConfirm ? (
                    <button
                        onClick={handleClear}
                        style={{
                            background: 'none',
                            border: '2px solid #e5e5e5',
                            padding: '0.75rem 1rem',
                            width: '100%',
                            cursor: 'pointer',
                            color: '#666',
                            textAlign: 'left',
                        }}
                    >
                        Clear all history and data
                    </button>
                ) : (
                    <div className="fade-in">
                        <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Are you sure?</p>
                        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                            This will permanently delete all your tracking history.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" onClick={handleClear}>
                                Delete All
                            </button>
                            <button className="btn" onClick={() => setShowClearConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="card space-y-2">
                <h3>About</h3>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    SunkCost doesn't sugarcoat your screen time. Just the uncomfortable truth.
                </p>
            </div>
        </div>
    );
}
