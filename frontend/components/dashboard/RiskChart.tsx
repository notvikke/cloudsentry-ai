'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { SecurityFinding } from '@/lib/mockData';
import { useMemo } from 'react';

export default function RiskChart({ data }: { data: SecurityFinding[] }) {

    const chartData = useMemo(() => {
        const buckets: Record<string, number> = {
            '00:00': 0, '04:00': 0, '08:00': 0, '12:00': 0,
            '16:00': 0, '20:00': 0, '24:00': 0
        };

        data.forEach(item => {
            const date = new Date(item.timestamp);
            const hour = date.getHours();
            // Simple bucket logic
            if (hour < 4) buckets['00:00']++;
            else if (hour < 8) buckets['04:00']++;
            else if (hour < 12) buckets['08:00']++;
            else if (hour < 16) buckets['12:00']++;
            else if (hour < 20) buckets['16:00']++;
            else buckets['20:00']++;
        });

        return Object.entries(buckets).map(([name, incidents]) => ({ name, incidents }));
    }, [data]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-2 p-6 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-white/5 h-[350px]"
        >
            <h3 className="text-neutral-200 font-medium mb-6">Incident Frequency (24h)</h3>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="incidents" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncidents)" />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
