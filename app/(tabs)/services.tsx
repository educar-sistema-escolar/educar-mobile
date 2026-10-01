import { StyleSheet, Text, View } from 'react-native';

import { Card, ScreenShell } from '@/components/screen-shell';
import { SectionTitle } from '@/components/section-title';
import { services, student } from '@/constants/mock-data';
import { palette } from '@/constants/palette';

export default function ServicesScreen() {
  return (
    <ScreenShell>
      <View style={styles.heading}><Text style={styles.eyebrow}>STUDENT PROFILE</Text><Text style={styles.title}>Services</Text><Text style={styles.subtitle}>Current enrollments for {student.name}.</Text></View>
      <Card style={styles.studentCard}><Text style={styles.student}>{student.name}</Text><Text style={styles.detail}>{student.grade}</Text></Card>
      <SectionTitle title="Enrolled services" />
      {services.map((service, index) => (
        <Card key={service.title} style={styles.serviceCard}>
          <View style={styles.icon}><Text style={styles.iconText}>{['S', 'T', 'L'][index]}</Text></View>
          <View style={styles.copy}><Text style={styles.serviceTitle}>{service.title}</Text><Text style={styles.detail}>{service.detail}</Text></View>
          <Text style={styles.status}>{service.status}</Text>
        </Card>
      ))}
      <Text style={styles.footnote}>Changes to service enrollment are managed by the school.</Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 5, marginBottom: 2 },
  eyebrow: { fontSize: 10, letterSpacing: 1.4, color: palette.muted, fontWeight: '700' },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.8, color: palette.ink },
  subtitle: { fontSize: 14, color: palette.muted },
  studentCard: { backgroundColor: palette.soft, borderColor: palette.soft },
  student: { fontSize: 16, fontWeight: '700', color: palette.ink },
  detail: { fontSize: 12, color: palette.muted, marginTop: 5, flexShrink: 1 },
  serviceCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.soft, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 14, fontWeight: '700', color: palette.ink },
  copy: { flex: 1 },
  serviceTitle: { fontSize: 15, fontWeight: '600', color: palette.ink },
  status: { fontSize: 10, fontWeight: '600', color: palette.muted },
  footnote: { fontSize: 12, lineHeight: 18, color: palette.muted, textAlign: 'center', marginHorizontal: 20 },
});
