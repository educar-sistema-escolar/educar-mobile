import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, ScreenShell } from '@/components/screen-shell';
import { SectionTitle } from '@/components/section-title';
import { student } from '@/constants/mock-data';
import { palette } from '@/constants/palette';

export default function HomeScreen() {
  return (
    <ScreenShell>
      <View style={styles.topLine}>
        <View>
          <Text style={styles.eyebrow}>EDUCAR · FAMILY</Text>
          <Text style={styles.greeting}>Good morning</Text>
        </View>
        <Pressable accessibilityLabel="Open account" onPress={() => router.push('/login')} style={styles.avatar}><Text style={styles.avatarText}>{student.initials}</Text></Pressable>
      </View>

      <Card style={styles.studentCard}>
        <Text style={styles.label}>STUDENT</Text>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.muted}>{student.grade}</Text>
        <View style={styles.divider} />
        <Text style={styles.muted}>Viewing information for this student</Text>
      </Card>

      <View style={styles.balanceHeader}><SectionTitle title="Outstanding balance" action="March 2026" /></View>
      <Card>
        <Text style={styles.amount}>$ 42,000</Text>
        <Text style={styles.muted}>1 item awaiting payment</Text>
        <View style={styles.divider} />
        <View style={styles.row}><Text style={styles.body}>March tuition</Text><Text style={styles.due}>Due Mar 10</Text></View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/payments')} style={styles.button}><Text style={styles.buttonText}>Review payments →</Text></Pressable>
      </Card>

      <SectionTitle title="Recent activity" action="See all" />
      <Card style={styles.activityCard}>
        <View style={styles.activityDot} />
        <View style={{ flex: 1 }}><Text style={styles.body}>School lunch payment received</Text><Text style={styles.muted}>Mar 02 · Receipt available</Text></View>
        <Text style={styles.paid}>Paid</Text>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '700', color: palette.muted },
  greeting: { fontSize: 28, fontWeight: '700', letterSpacing: -0.8, color: palette.ink, marginTop: 5 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.paper, fontSize: 13, fontWeight: '700' },
  studentCard: { backgroundColor: palette.soft, borderColor: palette.soft },
  label: { fontSize: 10, color: palette.muted, fontWeight: '700', letterSpacing: 1.1 },
  studentName: { fontSize: 19, color: palette.ink, fontWeight: '700', marginTop: 8 },
  muted: { color: palette.muted, fontSize: 13, marginTop: 4 },
  divider: { height: 1, backgroundColor: palette.line, marginVertical: 16 },
  balanceHeader: { marginBottom: -10 },
  amount: { fontSize: 30, fontWeight: '700', letterSpacing: -0.8, color: palette.ink },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  body: { fontSize: 14, fontWeight: '600', color: palette.ink },
  due: { fontSize: 12, color: palette.muted },
  button: { backgroundColor: palette.ink, borderRadius: 12, padding: 14, marginTop: 18, alignItems: 'center' },
  buttonText: { color: palette.paper, fontSize: 14, fontWeight: '600' },
  activityCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.ink },
  paid: { fontSize: 12, fontWeight: '600', color: palette.ink },
});
