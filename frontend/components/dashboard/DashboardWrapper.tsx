'use client';

import { useEffect, useState } from 'react';
import { isAdminUser } from '@/lib/authUtils';
import { SecurityFinding } from '@/lib/mockData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import DashboardClientWrapper from '@/components/dashboard/DashboardClientWrapper';
import { ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

interface DashboardWrapperProps {
    realFindings: SecurityFinding[];
    demoFindings: SecurityFinding[];
}

export default function DashboardWrapper({ realFindings, demoFindings }: DashboardWrapperProps) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            const adminStatus = await isAdminUser();
            setIsAdmin(adminStatus);
            setIsLoading(false);
        }
        checkAdmin();
    }, []);

    // Use real data for admin, demo data for others
    const findings = isAdmin ? realFindings : demoFindings;

    const totalIncidents = findings.length;
    const highRiskCount = findings.filter(f => f.risk === 'HIGH' || f.risk === 'CRITICAL').length;
    const confidenceScore = totalIncidents > 0
        ? Math.max(0, Math.round(100 - (highRiskCount * 15)))
        : 100;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-neutral-950 p-8 text-neutral-200 font-sans selection:bg-amber-500/30 flex items-center justify-center">
                <div className="text-neutral-400">Loading...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-950 p-8 text-neutral-200 font-sans selection:bg-amber-500/30">
            <DashboardHeader isAdmin={isAdmin} />

            {/* Top Row: Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Incidents (All Time)" value={totalIncidents.toString()} icon={<Activity className="w-6 h-6 text-amber-500" />} trend="Live Data" />
                <StatCard title="High Risk Alerts" value={highRiskCount.toString()} icon={<AlertTriangle className="w-6 h-6 text-amber-500" />} trend={highRiskCount > 0 ? "Action Required" : "Stable"} />
                <StatCard title="AI Confidence Score" value={`${confidenceScore}%`} icon={<ShieldCheck className="w-6 h-6 text-amber-500" />} trend="Real-time Analysis" />
            </div>

            {/* Main Grid with Interactive State */}
            <DashboardClientWrapper findings={findings} />
        </main>
    );
}
