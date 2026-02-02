'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const { signOut, user } = useAuthenticator((context) => [context.user]);

    return (
        <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 border border-white/10 hover:border-white/20 transition-all text-neutral-300 hover:text-white text-sm font-medium"
            title={`Signed in as ${user?.signInDetails?.loginId || 'user'}`}
        >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
        </button>
    );
}
