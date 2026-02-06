import { useState } from 'react';
import logo from '../assets/logo.png';

interface OnboardingProps {
    birthYear: number;
    lifeExpectancy: number;
    onComplete: (settings: { birth_year: number; life_expectancy: number }) => void;
}

export function Onboarding({ birthYear, lifeExpectancy, onComplete }: OnboardingProps) {
    const [localBirthYear, setLocalBirthYear] = useState(birthYear);
    const [localLifeExpectancy, setLocalLifeExpectancy] = useState(lifeExpectancy);

    const handleComplete = () => {
        onComplete({
            birth_year: localBirthYear,
            life_expectancy: localLifeExpectancy,
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
            {/* Header: Logo centered above title */}
            <img src={logo} alt="SunkCost" style={{ height: '3rem', marginBottom: '0.75rem' }} />
            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem', fontWeight: 700 }}>SunkCost</h1>

            {/* Slogan directly under the logo/title */}
            <p style={{
                margin: '0 0 2rem 0',
                color: '#666',
                fontSize: '0.9rem',
            }}>
                Stop lying to yourself.
            </p>

            {/* Settings card */}
            <div style={{
                width: '100%',
                maxWidth: '320px',
                textAlign: 'left',
                padding: '1.5rem',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                backgroundColor: '#fff',
            }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>About You</h3>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                    We use this to calculate how much of your remaining life you're spending here.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label
                            htmlFor="birthYear"
                            style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem', color: '#333' }}
                        >
                            Birth Year
                        </label>
                        <input
                            id="birthYear"
                            type="number"
                            value={localBirthYear}
                            onChange={(e) => setLocalBirthYear(parseInt(e.target.value) || 1990)}
                            min="1900"
                            max={new Date().getFullYear()}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e5e5',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="lifeExpectancy"
                            style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem', color: '#333' }}
                        >
                            Life Expectancy (years)
                        </label>
                        <input
                            id="lifeExpectancy"
                            type="number"
                            value={localLifeExpectancy}
                            onChange={(e) => setLocalLifeExpectancy(parseInt(e.target.value) || 80)}
                            min="1"
                            max="120"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e5e5',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        onClick={handleComplete}
                        style={{
                            width: '100%',
                            marginTop: '0.5rem',
                            padding: '0.875rem 1.5rem',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Start Tracking
                    </button>
                </div>
            </div>

            <p style={{
                marginTop: '2rem',
                fontSize: '0.7rem',
                color: '#999',
                maxWidth: '260px',
                lineHeight: 1.4,
            }}>
                No achievements. No streaks. No gamification.<br />Just the uncomfortable truth.
            </p>
        </div>
    );
}
