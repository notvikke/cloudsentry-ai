'use client';

import { fetchAuthSession } from 'aws-amplify/auth';

// Admin email address
const ADMIN_EMAIL = 'vikastro911@gmail.com';

/**
 * Check if the current authenticated user is an admin
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isAdminUser(): Promise<boolean> {
    try {
        const session = await fetchAuthSession();
        const userEmail = session.tokens?.idToken?.payload?.email as string | undefined;

        return userEmail === ADMIN_EMAIL;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * Get the current user's email
 * @returns Promise<string | null> - user email or null if not authenticated
 */
export async function getCurrentUserEmail(): Promise<string | null> {
    try {
        const session = await fetchAuthSession();
        return (session.tokens?.idToken?.payload?.email as string) || null;
    } catch (error) {
        console.error('Error getting user email:', error);
        return null;
    }
}
