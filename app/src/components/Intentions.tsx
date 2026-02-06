import { useState } from 'react';
import type { Intention } from '../types';
import { formatDuration } from '../utils/time';

interface IntentionsProps {
    intentions: Intention[];
    todayTotal: number;
    onAddIntention: (description: string, timeCommitted: number) => void;
    onRemoveIntention: (id: string) => void;
}

export function Intentions({
    intentions,
    todayTotal,
    onAddIntention,
    onRemoveIntention,
}: IntentionsProps) {
    const [newDescription, setNewDescription] = useState('');
    const [newTime, setNewTime] = useState(60); // Default 60 minutes

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDescription.trim()) {
            onAddIntention(newDescription, newTime);
            setNewDescription('');
            setNewTime(60);
        }
    };

    // Calculate time wasted in minutes for comparison
    const minutesWasted = Math.floor(todayTotal / (1000 * 60));

    // Total time committed to intentions
    const totalCommitted = intentions.reduce((sum, i) => sum + i.time_committed, 0);

    return (
        <div className="space-y-8">
            <h2>What You Said You'd Do</h2>

            {/* Add Intention Form */}
            <form onSubmit={handleSubmit} className="card space-y-4">
                <h3>Set an Intention</h3>

                <div className="space-y-2">
                    <label htmlFor="description" style={{ display: 'block', fontWeight: 600 }}>
                        I want to spend time on:
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Reading, exercising, learning guitar..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="time" style={{ display: 'block', fontWeight: 600 }}>
                        Minutes per day:
                    </label>
                    <input
                        id="time"
                        type="number"
                        value={newTime}
                        onChange={(e) => setNewTime(Math.max(1, parseInt(e.target.value) || 0))}
                        min="1"
                        max="480"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Add Intention
                </button>
            </form>

            {/* Intentions List */}
            {intentions.length > 0 && (
                <div className="space-y-4">
                    <h3>Your Promises</h3>

                    {intentions.map((intention) => (
                        <div key={intention.id} className="card space-y-2">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontWeight: 700 }}>{intention.description}</p>
                                    <p className="stat-label">{intention.time_committed} minutes daily</p>
                                </div>
                                <button
                                    className="btn"
                                    onClick={() => onRemoveIntention(intention.id)}
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reality Check */}
            {intentions.length > 0 && todayTotal > 0 && (
                <div className="card space-y-4" style={{ borderWidth: '3px' }}>
                    <h3>Reality Check</h3>

                    <p className="shame-text">
                        You committed to{' '}
                        <span className="shame-highlight">{totalCommitted} minutes</span>{' '}
                        of meaningful activity today.
                    </p>

                    <p className="shame-text">
                        Instead, you've wasted{' '}
                        <span className="shame-highlight">{formatDuration(todayTotal)}</span>{' '}
                        on screens.
                    </p>

                    {minutesWasted >= totalCommitted && (
                        <p className="shame-text" style={{ fontWeight: 700 }}>
                            You've spent more time scrolling than you promised to spend on what matters. Think about that.
                        </p>
                    )}

                    {intentions.map((intention) => (
                        <p key={intention.id} className="shame-text">
                            You said <span className="shame-highlight">"{intention.description}"</span>.
                            {minutesWasted >= intention.time_committed
                                ? ` You could have done it ${(minutesWasted / intention.time_committed).toFixed(1)}x over.`
                                : ` There's still time. But will you?`}
                        </p>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {intentions.length === 0 && (
                <div className="card">
                    <p className="shame-text">
                        No intentions set. What did you actually want to do with your time?
                    </p>
                </div>
            )}
        </div>
    );
}
