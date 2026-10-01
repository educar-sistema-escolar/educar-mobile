import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/palette';

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: palette.ink, fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  action: { color: palette.muted, fontSize: 13, fontWeight: '600' },
});
