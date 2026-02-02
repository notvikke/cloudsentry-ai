'use client';

import { motion } from 'framer-motion';
import { X, ShieldAlert, FileJson, Activity } from 'lucide-react';
import { SecurityFinding } from '@/lib/mockData';
import { remediateThreat } from '@/lib/actions';

interface FindingModalProps {
    finding: SecurityFinding | null;
    onClose: () => void;
}

export default function FindingModal({ finding, onClose }: FindingModalProps) {
    if (!finding) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-neutral-800 flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-xl border ${finding.risk === 'HIGH' || finding.risk === 'CRITICAL'
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                            }`}>
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{finding.action_summary}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${finding.risk === 'HIGH' || finding.risk === 'CRITICAL'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    }`}>
                                    {finding.risk} RISK
                                </span>
                                <span className="text-neutral-500 text-xs font-mono">
                                    {new Date(finding.timestamp).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">

                    {/* AI Analysis */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            AI Threat Analysis
                        </h3>
                        <div className="p-4 rounded-xl bg-neutral-800/50 border border-white/5 text-neutral-300 text-sm leading-relaxed">
                            {finding.reason}
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <span className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Details: </span>
                                {finding.detail}
                            </div>
                        </div>
                    </div>

                    {/* Raw Event Data */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                            <FileJson className="w-4 h-4" />
                            Raw CloudTrail Event
                        </h3>
                        <pre className="p-4 rounded-xl bg-black/50 border border-white/5 text-neutral-500 text-xs font-mono overflow-x-auto">
                            {/* We don't have the raw event in SecurityFinding type yet, need to add it or just show what we have */}
                            {JSON.stringify(finding, null, 2)}
                        </pre>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Close
                    </button>
                    {(finding.risk === 'HIGH' || finding.risk === 'CRITICAL') && (
                        <button
                            onClick={async () => {
                                // Extract resourceID if possible, for now pass finding.id as dummy
                                const result = await remediateThreat(finding.action_summary || "", finding.id);
                                alert(result.message);
                                if (result.success) onClose();
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/20 transition-all flex items-center gap-2"
                        >
                            <ShieldAlert className="w-4 h-4" />
                            Auto-Fix Issue
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
