import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { request } from './api';
import { useAuth } from './auth';
export type Child = {
    id: string;
    people: {
        first_name: string;
        last_name: string;
    };
};
export type Item = {
    id: string;
    invoice_id: string;
    label: string;
    concept: string;
    amount_cents: number;
    paid_cents: number;
};
export type Invoice = {
    id: string;
    student_id: string;
    period: string;
    due_date: string;
    invoice_items: Item[];
};
export type Transfer = {
    id: string;
    invoice_id: string;
    reference: string;
    amount_cents: number;
    status: string;
    created_at: string;
    reviewed_at?: string;
    transfer_submission_items: {
        item_id: string;
    }[];
    transfer_receipts: {
        id: string;
        filename: string;
        storage_path: string;
    }[];
};
const FamilyContext = createContext({ children: [] as Child[], childId: '', setChildId: (_id: string) => { }, loading: false, error: '', reload: () => { } });
export function FamilyProvider({ children }: PropsWithChildren) {
    const { session } = useAuth();
    const [list, setList] = useState<Child[]>([]);
    const [childId, setChildId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [revision, setRevision] = useState(0);
    useEffect(() => { let active = true; Promise.resolve().then(() => { if (!active)
        return; if (!session) {
        setList([]);
        setChildId('');
        setError('');
        setLoading(false);
        return;
    } setLoading(true); return request<Child[]>('/rest/v1/students?select=id,people(first_name,last_name)&is_active=eq.true').then(data => { if (active) {
        setList(data);
        setChildId(previous => data.some(c => c.id === previous) ? previous : data[0]?.id ?? '');
        setError('');
    } }).catch(() => { if (active) {
        setList([]);
        setChildId('');
        setError('Children could not be loaded. Check your connection or contact the school.');
    } }).finally(() => { if (active)
        setLoading(false); }); }); return () => { active = false; }; }, [session, revision]);
    return <FamilyContext.Provider value={{ children: list, childId, setChildId, loading, error, reload: () => setRevision(x => x + 1) }}>{children}</FamilyContext.Provider>;
}
export const useFamily = () => useContext(FamilyContext);
export const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ARS' }).format(cents / 100);
export function useInvoices() {
    const { childId } = useFamily();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [revision, setRevision] = useState(0);
    useEffect(() => { let active = true; Promise.resolve().then(() => { if (!active)
        return; setInvoices([]); setTransfers([]); setError(''); setLoading(!!childId); if (!childId)
        return; return Promise.all([request<Invoice[]>(`/rest/v1/invoices?student_id=eq.${childId}&select=*,invoice_items(*)&order=period.desc`), request<Transfer[]>('/rest/v1/transfer_submissions?select=*,transfer_receipts(*),transfer_submission_items(item_id)&order=created_at.desc')]).then(([i, t]) => { if (active) {
        setInvoices(i);
        setTransfers(t.filter(x => i.some(y => y.id === x.invoice_id)));
        setError('');
    } }).catch((cause) => { if (__DEV__)
        console.warn('Financial query failed:', cause instanceof Error ? cause.message : 'unknown'); if (active)
        setError('Financial information is unavailable. Please retry.'); }).finally(() => { if (active)
        setLoading(false); }); }); return () => { active = false; }; }, [childId, revision]);
    return { invoices, transfers, error, loading, reload: () => setRevision(x => x + 1) };
}
