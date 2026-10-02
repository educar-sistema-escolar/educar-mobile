import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

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
      <SectionTitle title="Transfer receipts" action="2 files" />
      <Card style={styles.itemCard}>
        <View style={styles.itemTop}>
          <Text style={styles.itemTitle}>March tuition · INV-2026-03</Text>
          <Text style={styles.receiptCount}>2</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.subtle}>transfer-0302.pdf</Text>
          <Text style={styles.receiptStatus}>Received</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.subtle}>transfer-0305.pdf</Text>
          <Text style={styles.receiptStatus}>Received</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => Alert.alert('Demo only', 'Receipt upload will be connected to the file picker.')}
          style={styles.uploadButton}>
          <Text style={styles.uploadText}>＋ Attach another receipt</Text>
        </Pressable>
      </Card>
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
  receiptCount: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptStatus: { color: palette.muted, fontSize: 11, fontWeight: '600' },
  uploadButton: { borderWidth: 1, borderColor: palette.line, borderRadius: 12, padding: 13, alignItems: 'center', marginTop: 2 },
  uploadText: { color: palette.ink, fontSize: 13, fontWeight: '600' },
});
