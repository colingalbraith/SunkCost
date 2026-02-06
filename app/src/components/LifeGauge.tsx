import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface LifeGaugeProps {
    percentageUsed: number;
}

export function LifeGauge({ percentageUsed }: LifeGaugeProps) {
    const data = useMemo(() => {
        const used = Math.min(percentageUsed, 100);
        return [
            { name: 'Used', value: used },
            { name: 'Remaining', value: 100 - used },
        ];
    }, [percentageUsed]);

    return (
        <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Life Consumed</h3>
            <div style={{ width: '100%', height: 180, position: 'relative' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                            animationDuration={1000}
                            animationEasing="ease-out"
                        >
                            <Cell fill="#000" />
                            <Cell fill="#e5e5e5" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -20%)',
                    textAlign: 'center',
                }}>
                    <span className="stat-value" style={{ fontSize: '1.5rem' }}>
                        {percentageUsed.toFixed(4)}%
                    </span>
                    <p className="stat-label" style={{ marginTop: '0.25rem' }}>
                        of remaining life
                    </p>
                </div>
            </div>
        </div>
    );
}
