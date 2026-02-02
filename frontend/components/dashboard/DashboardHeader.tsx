'use client';

import { useState } from 'react';
import { simulateThreat } from '@/lib/actions';
import { Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import LogoutButton from '@/components/LogoutButton';

interface DashboardHeaderProps {
    isAdmin?: boolean;
}

export default function DashboardHeader({ isAdmin = false }: DashboardHeaderProps) {
    const [simulating, setSimulating] = useState(false);

    const handleSimulation = async () => {
        setSimulating(true);
        try {
            const result = await simulateThreat();
            if (result.success) {
                alert("Threat Simulated! Watch the dashboard...");
                // In a real app, we might trigger a re-fetch or rely on auto-refresh
            } else {
                alert("Failed to simulate threat");
            }
        } finally {
            setSimulating(false);
        }
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex items-center justify-between"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse"></span>
                    CloudSentry AI
                </h1>
                <p className="text-neutral-500 mt-1">Autonomous Security Monitor</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSimulation}
                    disabled={simulating}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/30 border border-red-500/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                    <Zap className={`w-4 h-4 ${simulating ? 'animate-pulse' : ''}`} />
                    {simulating ? 'Injecting Threat...' : 'Simulate Attack'}
                </button>

                <div className="flex items-center gap-2">
                    {isAdmin ? (
                        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/50 text-emerald-400">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="font-medium">Live Mode</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/50 text-blue-400">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="font-medium">Demo Mode</span>
                        </div>
                    )}
                    <div className="text-xs px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                        System Status: <span className="text-emerald-500 font-medium">Online</span>
                    </div>
                    <LogoutButton />
                </div>
            </div>
        </motion.header>
    );
}
