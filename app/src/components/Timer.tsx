import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { Session } from '../types';
import { getDateString } from '../utils/time';

interface TimerProps {
    isTracking: boolean;
    elapsedTime: number;
    todayTotal: number;
    sessions: Session[];
}

function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
}

function formatTimeCompact(ms: number): string {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Format hour number to 12-hour format with am/pm
function formatHour(h: number): string {
    if (h === 0) return '12am';
    if (h === 12) return '12pm';
    if (h < 12) return `${h}am`;
    return `${h - 12}pm`;
}

export function Timer({
    isTracking,
    elapsedTime,
    todayTotal,
    sessions,
}: TimerProps) {
    // Hourly breakdown for today
    const hourlyData = useMemo(() => {
        const now = new Date();
        const todayStr = getDateString(now);
        const todaySessions = sessions.filter(s => getDateString(new Date(s.start_time)) === todayStr);

        const hours: { displayHour: string; tickLabel: string; minutes: number }[] = [];

        for (let h = 0; h < 24; h++) {
            let totalMs = 0;

            // Create hour boundaries for today
            const hourStart = new Date(now);
            hourStart.setHours(h, 0, 0, 0);
            const hourEnd = new Date(now);
            hourEnd.setHours(h + 1, 0, 0, 0);

            todaySessions.forEach(s => {
                const startTime = new Date(s.start_time);
                const endTime = s.end_time ? new Date(s.end_time) : new Date();

                // Find overlap between session and this hour
                const overlapStart = Math.max(startTime.getTime(), hourStart.getTime());
                const overlapEnd = Math.min(endTime.getTime(), hourEnd.getTime());

                if (overlapEnd > overlapStart) {
                    totalMs += overlapEnd - overlapStart;
                }
            });

            // Tick labels only show for key hours on the x-axis
            let tickLabel = '';
            if (h === 6) tickLabel = '6am';
            else if (h === 12) tickLabel = '12pm';
            else if (h === 18) tickLabel = '6pm';

            hours.push({
                displayHour: formatHour(h),
                tickLabel,
                minutes: Math.round(totalMs / (1000 * 60)),
            });
        }

        return hours;
    }, [sessions]);

    const hasTimelineData = hourlyData.some(h => h.minutes > 0);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '1rem 0',
        }}>
            {/* Main time display */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: 'clamp(3rem, 12vw, 5rem)',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                }}>
                    {formatTime(elapsedTime)}
                </div>
                <p style={{
                    color: '#666',
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                }}>
                    {isTracking ? 'current session' : 'paused'}
                </p>
            </div>

            {/* Today's stat */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.25rem', minWidth: '150px' }}>
                    <p style={{
                        fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                        fontWeight: 700,
                        lineHeight: 1,
                    }}>
                        {formatTimeCompact(todayTotal)}
                    </p>
                    <p className="stat-label">today</p>
                </div>
            </div>

            {/* Today's Timeline with tooltip - using same pattern as Monthly History */}
            {hasTimelineData && (
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Today's Timeline</h3>
                    <div style={{ width: '100%', height: 100 }}>
                        <ResponsiveContainer>
                            <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="displayHour"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    interval={5}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                    formatter={(value) => [`${value}m`, 'Time']}
                                    labelFormatter={(_, payload) => {
                                        if (payload && payload[0] && payload[0].payload) {
                                            return payload[0].payload.displayHour;
                                        }
                                        return '';
                                    }}
                                    cursor={{ stroke: '#ccc', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="minutes"
                                    stroke="#000"
                                    strokeWidth={2}
                                    fill="url(#todayGradient)"
                                    animationDuration={800}
                                    activeDot={{ r: 4, fill: '#000' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Shame message */}
            <p style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '0.9rem',
                maxWidth: '300px',
                margin: '0 auto',
                lineHeight: 1.5,
            }}>
                Every second here is a second you'll never get back.
            </p>
        </div>
    );
}
