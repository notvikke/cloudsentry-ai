'use client';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { SecurityFinding } from '@/lib/mockData';

export default function RecentAlertsTable({ data, onSelect }: { data: SecurityFinding[], onSelect?: (finding: SecurityFinding) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-white/5 h-[350px] overflow-hidden flex flex-col"
        >
            <h3 className="text-neutral-200 font-medium mb-4">Recent Alerts</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {data.length === 0 ? (
                    <div className="text-neutral-500 text-center text-sm py-10">
                        No security alerts found.
                    </div>
                ) : (
                    data.map((finding) => (
                        <div
                            key={finding.id}
                            onClick={() => onSelect?.(finding)}
                            className={clsx(
                                "p-3 rounded-lg border flex items-start gap-3 transition-all cursor-pointer group",
                                finding.risk === 'HIGH' || finding.risk === 'CRITICAL'
                                    ? "bg-amber-950/20 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:bg-amber-950/40"
                                    : "bg-neutral-800/30 border-white/5 hover:bg-neutral-800/50"
                            )}
                        >
                            <div className="mt-1">
                                {finding.risk === 'CRITICAL' || finding.risk === 'HIGH' ? (
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                ) : finding.risk === 'MEDIUM' ? (
                                    <Info className="w-5 h-5 text-blue-400" />
                                ) : (
                                    <CheckCircle className="w-5 h-5 text-neutral-500" />
                                )}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-neutral-200">
                                    {finding.action_summary || "Unknown Action"}
                                </div>
                                <div className="text-xs text-neutral-400 mt-1 line-clamp-2">
                                    {finding.reason}
                                </div>
                                <div className="text-[10px] text-neutral-500 mt-2 font-mono" suppressHydrationWarning>
                                    {finding.timestamp ? new Date(finding.timestamp).toLocaleTimeString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
