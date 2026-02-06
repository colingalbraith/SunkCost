import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import type { Session } from '../types';
import { getWeekRange, getDateString } from '../utils/time';

interface WeeklyChartProps {
    sessions: Session[];
    currentSessionTime: number;
}

export function WeeklyChart({ sessions, currentSessionTime }: WeeklyChartProps) {
    const chartData = useMemo(() => {
        const { start } = getWeekRange();
        const days = [];

        // Generate last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const dateStr = getDateString(date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const isToday = dateStr === getDateString(new Date());

            // Sum sessions for this day
            const dayTotal = sessions
                .filter(s => getDateString(new Date(s.start_time)) === dateStr)
                .reduce((sum, s) => sum + s.duration, 0);

            // Add current session time to today
            const total = isToday ? dayTotal + currentSessionTime : dayTotal;

            days.push({
                day: dayName,
                minutes: Math.round(total / (1000 * 60)),
                isToday,
            });
        }

        return days;
    }, [sessions, currentSessionTime]);

    const maxMinutes = Math.max(...chartData.map(d => d.minutes), 1);

    return (
        <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>This Week</h3>
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                            domain={[0, maxMinutes]}
                        />
                        <Bar
                            dataKey="minutes"
                            radius={[2, 2, 0, 0]}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={entry.isToday ? '#000' : '#ccc'}
                                    className={entry.isToday ? 'bar-pulse' : ''}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
