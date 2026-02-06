import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip } from 'recharts';
import type { Session } from '../types';
import { formatDuration, getDateString } from '../utils/time';

interface SessionHistoryProps {
    sessions: Session[];
}

// Generate last N days for heat map (organized for GitHub-style display)
function generateHeatMapData(sessions: Session[], weeks: number = 12): { date: string; minutes: number; level: number }[][] {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const sessionsByDate = sessions.reduce((acc, session) => {
        const date = getDateString(new Date(session.start_time));
        acc[date] = (acc[date] || 0) + session.duration;
        return acc;
    }, {} as Record<string, number>);

    const grid: { date: string; minutes: number; level: number }[][] = [];
    const totalDays = weeks * 7;
    const startOffset = totalDays - 1 - dayOfWeek;

    for (let week = 0; week < weeks; week++) {
        const weekData: { date: string; minutes: number; level: number }[] = [];

        for (let day = 0; day < 7; day++) {
            const daysAgo = startOffset - (week * 7) - day;

            if (daysAgo < 0) {
                weekData.push({ date: '', minutes: 0, level: -1 });
                continue;
            }

            const date = new Date(today);
            date.setDate(today.getDate() - daysAgo);
            const dateStr = getDateString(date);
            const duration = sessionsByDate[dateStr] || 0;
            const minutes = Math.round(duration / (1000 * 60));

            let level = 0;
            if (minutes > 120) level = 4;
            else if (minutes > 60) level = 3;
            else if (minutes > 30) level = 2;
            else if (minutes > 0) level = 1;

            weekData.push({ date: dateStr, minutes, level });
        }

        grid.push(weekData);
    }

    return grid;
}

// Generate 7-day data for bar chart
function generate7DayData(sessions: Session[]): { day: string; minutes: number; fullDate: string }[] {
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
        const duration = sessionsByDate[dateStr] || 0;

        data.push({
            day: dayName,
            fullDate: dateStr,
            minutes: Math.round(duration / (1000 * 60)),
        });
    }

    return data;
}

// Generate 30-day trend data for line chart
function generate30DayTrend(sessions: Session[]): { dayNum: number; displayDate: string; fullDate: string; minutes: number }[] {
    const today = new Date();
    const data = [];

    const sessionsByDate = sessions.reduce((acc, session) => {
        const date = getDateString(new Date(session.start_time));
        acc[date] = (acc[date] || 0) + session.duration;
        return acc;
    }, {} as Record<string, number>);

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = getDateString(date);
        const duration = sessionsByDate[dateStr] || 0;

        // Format as "Feb 3" style
        const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        // Show tick only for every 7th day or first/last
        const dayNum = 30 - i;

        data.push({
            dayNum,
            displayDate,
            fullDate: dateStr,
            minutes: Math.round(duration / (1000 * 60)),
        });
    }

    return data;
}

export function SessionHistory({ sessions }: SessionHistoryProps) {

    const heatMapGrid = useMemo(() => generateHeatMapData(sessions, 12), [sessions]);
    const weekData = useMemo(() => generate7DayData(sessions), [sessions]);
    const trendData = useMemo(() => generate30DayTrend(sessions), [sessions]);

    const stats = useMemo(() => {
        const totalSessions = sessions.length;
        const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
        const avgSessionLength = totalSessions > 0 ? totalTime / totalSessions : 0;
        const longestSession = sessions.reduce((max, s) => s.duration > max ? s.duration : max, 0);
        const uniqueDays = new Set(sessions.map(s => getDateString(new Date(s.start_time)))).size;

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = getDateString(date);
            const hasSession = sessions.some(s => getDateString(new Date(s.start_time)) === dateStr);
            if (hasSession) streak++;
            else if (i > 0) break;
        }

        return { totalSessions, totalTime, avgSessionLength, longestSession, uniqueDays, streak };
    }, [sessions]);

    // Get the last 10 sessions sorted by start time
    const recentSessions = [...sessions]
        .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
        .slice(0, 10);

    // Group these 10 sessions by date
    const sessionsByDate = recentSessions.reduce((acc, session) => {
        const date = getDateString(new Date(session.start_time));
        if (!acc[date]) acc[date] = [];
        acc[date].push(session);
        return acc;
    }, {} as Record<string, Session[]>);

    const dates = Object.keys(sessionsByDate).sort().reverse();

    const levelColors = ['#ebedf0', '#c6c6c6', '#888', '#444', '#000'];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];



    return (
        <div className="space-y-6">
            <h2>History</h2>

            {/* Stats Grid */}
            {sessions.length > 0 && (
                <div className="grid grid-cols-3">
                    <div className="card stat-card text-center">
                        <p className="stat-label">Total Sessions</p>
                        <p className="stat-value" style={{ fontSize: '2rem' }}>{stats.totalSessions}</p>
                    </div>
                    <div className="card stat-card text-center">
                        <p className="stat-label">Avg Session</p>
                        <p className="stat-value" style={{ fontSize: '2rem' }}>{formatDuration(stats.avgSessionLength)}</p>
                    </div>
                    <div className="card stat-card text-center">
                        <p className="stat-label">Longest</p>
                        <p className="stat-value" style={{ fontSize: '2rem' }}>{formatDuration(stats.longestSession)}</p>
                    </div>
                </div>
            )}

            {/* Heat Map + 7-Day Bar Chart Side by Side */}
            {sessions.length > 0 && (
                <div className="grid grid-cols-2">
                    {/* Heat Map */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>12 Week Activity</h3>
                        <div style={{ display: 'flex', gap: '3px', flex: 1, alignItems: 'center' }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '3px',
                                marginRight: '6px',
                                fontSize: '9px',
                                color: '#666',
                            }}>
                                {dayLabels.map((label, i) => (
                                    <div key={i} style={{ height: '11px', lineHeight: '11px' }}>
                                        {i % 2 === 1 ? label : ''}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '3px', flex: 1 }}>
                                {heatMapGrid.map((week, weekIndex) => (
                                    <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                title={day.level >= 0 ? `${day.date}: ${day.minutes}m` : ''}
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: '1',
                                                    backgroundColor: day.level >= 0 ? levelColors[day.level] : 'transparent',
                                                    borderRadius: '2px',
                                                }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '0.75rem',
                            fontSize: '10px',
                            color: '#666',
                        }}>
                            <span>Less</span>
                            {levelColors.map((color, i) => (
                                <div key={i} style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '2px' }} />
                            ))}
                            <span>More</span>
                        </div>
                    </div>

                    {/* 7-Day Bar Chart */}
                    <div className="card">
                        <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Last 7 Days</h3>
                        <div style={{ width: '100%', height: 120 }}>
                            <ResponsiveContainer>
                                <BarChart data={weekData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10 }}
                                        tickFormatter={(v) => `${v}m`}
                                    />
                                    <Bar
                                        dataKey="minutes"
                                        fill="#000"
                                        radius={[2, 2, 0, 0]}
                                        animationDuration={800}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly History Chart */}
            {sessions.length > 0 && (
                <div className="card">
                    <h3 style={{ marginBottom: '0.75rem' }}>Monthly History</h3>
                    <div style={{ width: '100%', height: 150 }}>
                        <ResponsiveContainer>
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="displayDate"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    interval={6}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    tickFormatter={(v) => `${v}m`}
                                />
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
                                            return payload[0].payload.displayDate;
                                        }
                                        return '';
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="minutes"
                                    stroke="#000"
                                    strokeWidth={2}
                                    fill="url(#colorMinutes)"
                                    animationDuration={1000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Days Active + Streak */}
            {sessions.length > 0 && (
                <div className="grid grid-cols-2">
                    <div className="card stat-card text-center">
                        <p className="stat-label">Days Active</p>
                        <p className="stat-value" style={{ fontSize: '2rem' }}>{stats.uniqueDays}</p>
                    </div>
                    <div className="card stat-card text-center">
                        <p className="stat-label">Current Streak</p>
                        <p className="stat-value" style={{ fontSize: '2rem' }}>{stats.streak} days</p>
                    </div>
                </div>
            )}

            {/* Recent Sessions */}
            {dates.length > 0 && (
                <div className="space-y-4">
                    <h3>Recent Sessions</h3>

                    {dates.map((date) => {
                        const daySessions = sessionsByDate[date];
                        const dayTotal = daySessions.reduce((sum, s) => sum + s.duration, 0);

                        return (
                            <div key={date} className="card" style={{ padding: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.75rem',
                                    paddingBottom: '0.75rem',
                                    borderBottom: '1px solid #e5e5e5',
                                }}>
                                    <span style={{ fontWeight: 700 }}>{date}</span>
                                    <span className="stat-label">{formatDuration(dayTotal)} total</span>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {daySessions.map((session) => (
                                        <div
                                            key={session.id}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: '#f5f5f5',
                                                border: '1px solid #e5e5e5',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            <span style={{ fontWeight: 600 }}>{formatDuration(session.duration)}</span>
                                            <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                                                {new Date(session.start_time).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}



            {/* Empty State */}
            {sessions.length === 0 && (
                <div className="card">
                    <p className="shame-text">No sessions recorded yet. The clock is ticking.</p>
                </div>
            )}
        </div>
    );
}
