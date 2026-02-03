import DemoHeader from '@/components/dashboard/DemoHeader';
import StatCard from '@/components/dashboard/StatCard';
import DashboardClientWrapper from '@/components/dashboard/DashboardClientWrapper';
import { ShieldCheck, AlertTriangle, Activity } from 'lucide-react';
import { DEMO_FINDINGS } from '@/lib/demoData';



export default function DemoPage() {
    const findings = DEMO_FINDINGS;
    const totalIncidents = findings.length;
    const highRiskCount = findings.filter(f => f.risk === 'HIGH' || f.risk === 'CRITICAL').length;
    const confidenceScore = totalIncidents > 0
        ? Math.max(0, Math.round(100 - (highRiskCount * 15)))
        : 100;

    return (
        <main className="min-h-screen bg-neutral-950 p-8 text-neutral-200 font-sans selection:bg-amber-500/30">
            <DemoHeader />

            {/* Top Row: Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Incidents (All Time)" value={totalIncidents.toString()} icon={<Activity className="w-6 h-6 text-amber-500" />} trend="Live Data" />
                <StatCard title="High Risk Alerts" value={highRiskCount.toString()} icon={<AlertTriangle className="w-6 h-6 text-amber-500" />} trend={highRiskCount > 0 ? "Action Required" : "Stable"} />
                <StatCard title="AI Confidence Score" value={`${confidenceScore}%`} icon={<ShieldCheck className="w-6 h-6 text-amber-500" />} trend="Real-time Analysis" />
            </div>

            <DashboardClientWrapper findings={findings} />
        </main>
    );
}
