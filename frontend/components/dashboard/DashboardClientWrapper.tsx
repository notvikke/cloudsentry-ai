'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import RiskChart from '@/components/dashboard/RiskChart';
import RecentAlertsTable from '@/components/dashboard/RecentAlertsTable';
import FindingModal from '@/components/dashboard/FindingModal';
import { SecurityFinding } from '@/lib/mockData';

interface DashboardClientWrapperProps {
    findings: SecurityFinding[];
}

export default function DashboardClientWrapper({ findings }: DashboardClientWrapperProps) {
    const [selectedFinding, setSelectedFinding] = useState<SecurityFinding | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Chart */}
                <div className="lg:col-span-2">
                    <RiskChart data={findings} />
                </div>

                {/* Right Column: Recent Alerts */}
                <div>
                    <RecentAlertsTable
                        data={findings}
                        onSelect={(finding) => setSelectedFinding(finding)}
                    />
                </div>
            </div>

            <AnimatePresence>
                {selectedFinding && (
                    <FindingModal
                        finding={selectedFinding}
                        onClose={() => setSelectedFinding(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
