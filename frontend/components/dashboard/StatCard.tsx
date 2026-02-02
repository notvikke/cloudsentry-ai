'use client';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-white/5 flex items-center justify-between"
        >
            <div>
                <h3 className="text-neutral-400 text-sm font-medium tracking-wide">{title}</h3>
                <div className="mt-2 text-3xl font-bold text-neutral-100">{value}</div>
                {trend && <div className="mt-1 text-xs text-emerald-400">{trend}</div>}
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                {icon}
            </div>
        </motion.div>
    );
}
