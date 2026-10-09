import * as SecureStore from 'expo-secure-store';
import { singleFlight } from './session-tools.mjs';
import { Platform } from 'react-native';
export type Session = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    user: {
        id: string;
    };
    name: string;
};
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const configured = (/^https:\/\//.test(url) || (__DEV__ && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(url))) && !!key;
let session: Session | null = null;
let generation = 0;
const subscribers = new Set<() => void>();
export const currentSession = () => session;
export function subscribe(callback: () => void) { subscribers.add(callback); return () => { subscribers.delete(callback); }; }
async function store(value: Session | null) {
    session = value;
    try {
        if (Platform.OS !== 'web') {
            if (value)
                await SecureStore.setItemAsync('educar-session', JSON.stringify(value));
            else
                await SecureStore.deleteItemAsync('educar-session');
        }
    }
    finally {
        subscribers.forEach(fn => fn());
    }
}
async function rawRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!configured)
        throw new Error('Connect Supabase using the public environment configuration.');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
        const response = await fetch(`${url}${path}`, { ...options, signal: controller.signal, headers: { apikey: key, Authorization: `Bearer ${session?.access_token ?? key}`, 'Content-Type': 'application/json', ...options.headers } });
        const body = await response.text();
        const data = body ? JSON.parse(body) : null;
        if (!response.ok)
            throw new Error(data?.msg ?? data?.message ?? 'Request failed. Please try again.');
        return data as T;
    }
    finally {
        clearTimeout(timer);
    }
}
async function verifySession(value: Session, expected = generation) {
    if (expected !== generation) throw new Error('Authentication changed. Please try again.');
    try {
        const profiles = await rawRequest<{
            full_name: string;
            role: string;
            is_active: boolean;
            account_status: string;
        }[]>(`/rest/v1/profiles?id=eq.${value.user.id}&select=full_name,role,is_active,account_status`, { headers: { Authorization: `Bearer ${value.access_token}` } });
        const profile = profiles[0];
        if (!profile?.is_active || profile.account_status !== 'active' || !['guardian', 'parent'].includes(profile.role))
            throw new Error('An active family account is required. Administration is available on the web.');
        value.name = profile.full_name;
        if (expected !== generation) throw new Error('Authentication changed. Please try again.');
        await store(value);
    }
    catch (error) {
        if (expected === generation) await store(null);
        throw error;
    }
}
export async function login(email: string, password: string) {
    const expected = ++generation;
    const value = await request<Session & {
        expires_in: number;
    }>('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email: email.trim().toLowerCase(), password }) });
    value.expires_at = Date.now() + value.expires_in * 1000;
    await verifySession(value, expected);
}
export const refreshSession = singleFlight(async () => {
    if (!session)
        return;
    const expected = generation;
    try {
        const refreshed = await rawRequest<Session & {
            expires_in: number;
        }>('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: session.refresh_token }) });
        await verifySession({ ...refreshed, expires_at: Date.now() + refreshed.expires_in * 1000 }, expected);
    }
    catch (error) {
        await store(null);
        throw error;
    }
});
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> { if (session && session.expires_at < Date.now() + 60000)
    await refreshSession(); return rawRequest<T>(path, options); }
export async function restoreSession() {
    if (Platform.OS === 'web' || !configured)
        return;
    const expected = generation;
    try {
        const stored = await SecureStore.getItemAsync('educar-session');
        if (!stored)
            return;
        let value = JSON.parse(stored) as Session;
        if (value.expires_at < Date.now() + 60000) {
            const refreshed = await request<Session & {
                expires_in: number;
            }>('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: value.refresh_token }) });
            value = { ...refreshed, expires_at: Date.now() + refreshed.expires_in * 1000 };
        }
        await verifySession(value);
    }
    catch {
        if (expected === generation) await store(null);
    }
}
export async function logout() { generation++; try {
    if (session)
        await request('/auth/v1/logout', { method: 'POST' });
}
finally {
    await store(null);
} }
export const resetPassword = (email: string) => request(`/auth/v1/recover?redirect_to=${encodeURIComponent(process.env.EXPO_PUBLIC_PASSWORD_RESET_URL || 'educar://recovery')}`, { method: 'POST', body: JSON.stringify({ email: email.trim().toLowerCase() }) });
export const changePassword = (password: string) => request('/auth/v1/user', { method: 'PUT', body: JSON.stringify({ password }) });
export async function uploadReceipt(path: string, blob: Blob, type: string) {
    if (session && session.expires_at < Date.now() + 60000)
        await refreshSession();
    if (!session)
        throw new Error('Sign in again before uploading.');
    const response = await fetch(`${url}/storage/v1/object/transfer-receipts/${path}`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${session?.access_token}`, 'Content-Type': type, 'x-upsert': 'false' }, body: blob });
    if (!response.ok)
        throw new Error('Receipt upload failed. Please try again.');
}
export async function receiptUrl(path: string) {
    const result = await request<{
        signedURL: string;
    }>(`/storage/v1/object/sign/transfer-receipts/${path}`, { method: 'POST', body: JSON.stringify({ expiresIn: 60 }) });
    return `${url}/storage/v1${result.signedURL}`;
}
export async function acceptRecovery(accessToken: string, refreshToken: string) {
    const expected = ++generation;
    const user = await rawRequest<{
        id: string;
    }>('/auth/v1/user', { headers: { Authorization: `Bearer ${accessToken}` } });
    await verifySession({ access_token: accessToken, refresh_token: refreshToken, expires_at: Date.now() + 300000, user, name: '' }, expected);
}
