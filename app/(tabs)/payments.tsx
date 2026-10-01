import { StyleSheet, Text, View } from 'react-native';

import { Card, ScreenShell } from '@/components/screen-shell';
import { SectionTitle } from '@/components/section-title';
import { balances } from '@/constants/mock-data';
import { palette } from '@/constants/palette';

export default function PaymentsScreen() {
  return (
    <ScreenShell>
      <View style={styles.heading}><Text style={styles.eyebrow}>FINANCES</Text><Text style={styles.title}>Payments</Text><Text style={styles.subtitle}>Invoices, balances and transfer receipts.</Text></View>
      <Card style={styles.totalCard}>
        <Text style={styles.label}>TOTAL OUTSTANDING</Text>
        <Text style={styles.total}>$ 42,000</Text>
        <Text style={styles.subtle}>1 pending item · Updated today</Text>
      </Card>
      <SectionTitle title="This month" action="March 2026" />
      {balances.map((item) => (
        <Card key={item.label} style={styles.itemCard}>
          <View style={styles.itemTop}><Text style={styles.itemTitle}>{item.label}</Text><Text style={[styles.status, item.status === 'Due' ? styles.due : styles.paid]}>{item.status}</Text></View>
          <View style={styles.itemBottom}><Text style={styles.subtle}>{item.due}</Text><Text style={styles.amount}>{item.amount}</Text></View>
        </Card>
      ))}
      <Card style={styles.notice}><Text style={styles.itemTitle}>Bank transfer</Text><Text style={styles.subtle}>Payment and receipt upload will be available here.</Text></Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 5, marginBottom: 2 },
  eyebrow: { fontSize: 10, letterSpacing: 1.4, color: palette.muted, fontWeight: '700' },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.8, color: palette.ink },
  subtitle: { fontSize: 14, color: palette.muted },
  totalCard: { backgroundColor: palette.ink, borderColor: palette.ink },
  label: { fontSize: 10, color: '#BEBEBE', fontWeight: '700', letterSpacing: 1.2 },
  total: { fontSize: 32, fontWeight: '700', color: palette.paper, marginTop: 8 },
  subtle: { color: palette.muted, fontSize: 13, marginTop: 5 },
  itemCard: { gap: 14 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '600', color: palette.ink },
  status: { fontSize: 11, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, overflow: 'hidden' },
  due: { color: palette.paper, backgroundColor: palette.ink },
  paid: { color: palette.ink, backgroundColor: palette.soft },
  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { fontSize: 15, fontWeight: '700', color: palette.ink },
  notice: { backgroundColor: palette.soft, borderColor: palette.soft },
});
