import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatDuration, getDaysWasted, calculateLifePercentage, getDateString } from '../utils/time';
import type { Session } from '../types';

interface DashboardProps {
    todayTotal: number;
    weekTotal: number;
    allTimeTotal: number;
    birthYear: number;
    lifeExpectancy: number;
    sessions: Session[];
    currentSessionTime: number;
}

export function Dashboard({
    todayTotal,
    weekTotal,
    allTimeTotal,
    birthYear,
    lifeExpectancy,
    sessions,
    currentSessionTime,
}: DashboardProps) {
    const daysWasted = getDaysWasted(allTimeTotal);
    const lifePercentage = calculateLifePercentage(allTimeTotal, birthYear, lifeExpectancy);

    // Generate 7-day chart data
    const weekData = useMemo(() => {
        const today = new Date();
        const data = [];

        const sessionsByDate = sessions.reduce((acc, session) => {
            const date = getDateString(new Date(session.start_time));
            acc[date] = (acc[date] || 0) + session.duration;
            return acc;
        }, {} as Record<string, number>);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = getDateString(date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const isToday = i === 0;
            const duration = sessionsByDate[dateStr] || 0;
            const total = isToday ? duration + currentSessionTime : duration;

            data.push({
                day: dayName,
                minutes: Math.round(total / (1000 * 60)),
                isToday,
            });
        }

        return data;
    }, [sessions, currentSessionTime]);

    // Life gauge data
    const lifeGaugeData = useMemo(() => {
        const used = Math.min(lifePercentage, 100);
        return [
            { name: 'Used', value: used },
            { name: 'Remaining', value: 100 - used },
        ];
    }, [lifePercentage]);

    return (
        <div className="space-y-6">
            <h2>The Truth</h2>

            {/* Time Wasted Stats */}
            <div className="grid grid-cols-3">
                <div className="card stat-card text-center">
                    <p className="stat-label">Today</p>
                    <p className="stat-value">{formatDuration(todayTotal)}</p>
                </div>
                <div className="card stat-card text-center">
                    <p className="stat-label">This Week</p>
                    <p className="stat-value">{formatDuration(weekTotal)}</p>
                </div>
                <div className="card stat-card text-center">
                    <p className="stat-label">All Time</p>
                    <p className="stat-value">{formatDuration(allTimeTotal)}</p>
                </div>
            </div>

            {/* Weekly Bar Chart */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>This Week</h3>
                <div style={{ width: '100%', height: 180 }}>
                    <ResponsiveContainer>
                        <BarChart data={weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#666', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#666', fontSize: 12 }}
                                tickFormatter={(v) => `${v}m`}
                            />
                            <Bar
                                dataKey="minutes"
                                radius={[3, 3, 0, 0]}
                                animationDuration={800}
                            >
                                {weekData.map((entry, index) => (
                                    <Cell key={index} fill={entry.isToday ? '#000' : '#ccc'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Life Gauge and Stats */}
            {allTimeTotal > 0 && (
                <div className="grid grid-cols-2">
                    {/* Life Consumed Gauge */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Life Consumed</h3>
                        <div style={{ width: '100%', height: 140, position: 'relative' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={lifeGaugeData}
                                        cx="50%"
                                        cy="85%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={0}
                                        dataKey="value"
                                        animationDuration={1000}
                                    >
                                        <Cell fill="#000" />
                                        <Cell fill="#e5e5e5" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                textAlign: 'center',
                            }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                    {lifePercentage.toFixed(4)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Life Traded */}
                    <div className="card space-y-4">
                        <h3>Life Traded</h3>
                        <p className="shame-text">
                            <span className="shame-highlight">{daysWasted.toFixed(2)} days</span> gone.
                        </p>

                        {daysWasted >= 0.1 && (
                            <p style={{ fontSize: '0.875rem', color: '#666' }}>
                                That's {Math.floor(daysWasted * 24)} hours of learning, reading, or connection you chose to skip.
                            </p>
                        )}

                        {/* Progress bar */}
                        <div>
                            <div style={{
                                height: '8px',
                                backgroundColor: '#e5e5e5',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}>
                                <div
                                    className="progress-bar"
                                    style={{
                                        height: '100%',
                                        width: `${Math.min(daysWasted * 10, 100)}%`,
                                        backgroundColor: '#000',
                                    }}
                                />
                            </div>
                            <p className="stat-label" style={{ marginTop: '0.5rem' }}>
                                {daysWasted.toFixed(2)} / 10 days
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mortality Perspective */}
            {allTimeTotal > 0 && lifePercentage > 0 && (
                <div className="card space-y-4">
                    <h3>Mortality Check</h3>

                    <p className="shame-text">
                        Assuming you live to {lifeExpectancy}, that's{' '}
                        <span className="shame-highlight">{lifePercentage.toFixed(4)}%</span>{' '}
                        of your remaining life expectancy.
                    </p>

                    <p className="shame-text" style={{ fontSize: '0.875rem' }}>
                        It doesn't sound like much until you realize it's time you'll never get back. Ever.
                    </p>
                </div>
            )}

            {/* Empty State */}
            {allTimeTotal === 0 && (
                <div className="card">
                    <p className="shame-text">
                        No data yet. The clock is ticking.
                    </p>
                </div>
            )}
        </div>
    );
}
