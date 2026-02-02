'use client';

import '@/lib/amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './auth-styles.css';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator
      components={{
        Header() {
          return (
            <div className="text-center mb-6 pt-4">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Cloud<span className="text-amber-500">Sentry</span>
              </h1>
              <p className="text-neutral-500 mt-2 text-sm">AI-Powered Security Intelligence</p>
            </div>
          );
        },
        Footer() {
          return (
            <div className="mt-6 pb-4 text-center">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-900/30 border border-blue-500/50 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 transition-all text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View Demo (No Login Required)
              </Link>
              <p className="text-neutral-600 text-xs mt-3">
                Recruiters: Click above to explore the dashboard without signing up
              </p>
            </div>
          );
        }
      }}
    >
      {children}
    </Authenticator>
  );
}
