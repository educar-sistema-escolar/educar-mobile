import { schoolDate } from '@/lib/date.mjs';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, ScreenShell } from '@/components/screen-shell';
import { ChildSelector } from '@/components/child-selector';
import { useInvoices, money } from '@/lib/family';
import { useAuth } from '@/lib/auth';
export default function HomeScreen() {
    const { session } = useAuth();
    const { invoices, transfers, error, loading, reload } = useInvoices();
    const debt = invoices.flatMap(i => i.invoice_items).reduce((n, i) => n + i.amount_cents - i.paid_cents, 0);
    return <ScreenShell><View style={styles.row}><View><Text style={styles.eyebrow}>EDUCAR · FAMILY</Text><Text style={styles.title}>Welcome back.</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Open account" onPress={() => router.push('/account')} style={styles.avatar}><Text style={{ color: '#fff' }}>{session?.name?.slice(0, 1) || 'E'}</Text></Pressable></View><ChildSelector /><Card style={{ backgroundColor: '#f6f6f6' }}><Text style={styles.eyebrow}>OUTSTANDING BALANCE</Text><Text style={styles.amount}>{money(debt)}</Text><Text style={styles.muted}>Confirmed payments only reduce this balance.</Text><Pressable accessibilityRole="button" style={styles.button} onPress={() => router.push('/(tabs)/payments')}><Text style={styles.white}>Review invoices →</Text></Pressable></Card>{loading ? <Text>Loading financial information…</Text> : null}{error ? <Pressable onPress={reload}><Text accessibilityRole="alert">{error} Tap to retry.</Text></Pressable> : null}<Text style={styles.section}>Recent activity</Text>{!loading && !transfers.length ? <Card><Text style={styles.muted}>No transfers recorded for this student.</Text></Card> : null}{transfers.slice(0, 3).map(t => <Card key={t.id}><View style={styles.row}><Text style={styles.section}>{money(t.amount_cents)}</Text><Text>{t.status}</Text></View><Text style={styles.muted}>{t.reference} · {schoolDate(t.created_at)}</Text></Card>)}</ScreenShell>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { fontSize: 10, letterSpacing: 1.3, color: '#777', fontWeight: '700' }, title: { fontSize: 28, fontWeight: '700', marginTop: 6, letterSpacing: -.8 }, avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' }, amount: { fontSize: 32, fontWeight: '700', marginVertical: 12 }, muted: { fontSize: 13, color: '#777', lineHeight: 20 }, button: { backgroundColor: '#111', padding: 16, borderRadius: 12, marginTop: 18, alignItems: 'center' }, white: { color: '#fff', fontWeight: '600' }, section: { fontSize: 16, fontWeight: '600' } });
