import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <View style={styles.mark}><Text style={styles.markText}>E</Text></View>
        <Text style={styles.eyebrow}>EDUCAR · FAMILY</Text>
        <Text style={styles.title}>Welcome back.</Text>
        <Text style={styles.subtitle}>Sign in to see your family&apos;s school information.</Text>
        <View style={styles.fields}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput accessibilityLabel="Email" placeholder="you@example.com" placeholderTextColor="#999999" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput accessibilityLabel="Password" placeholder="Enter your password" placeholderTextColor="#999999" secureTextEntry style={styles.input} />
          <Text style={styles.forgot}>Forgot password?</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)')} style={styles.button}><Text style={styles.buttonText}>Sign in</Text></Pressable>
        <Text style={styles.note}>Mock screen · Authentication is not connected</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.paper, justifyContent: 'center', paddingHorizontal: 28 },
  content: { gap: 14 },
  mark: { width: 44, height: 44, backgroundColor: palette.ink, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  markText: { color: palette.paper, fontSize: 22, fontWeight: '700' },
  eyebrow: { color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: palette.ink, fontSize: 34, fontWeight: '700', letterSpacing: -1.2 },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  fields: { gap: 8, marginTop: 20 },
  label: { color: palette.muted, fontSize: 10, letterSpacing: 1, fontWeight: '700', marginTop: 8 },
  input: { height: 50, borderColor: palette.line, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontSize: 14, color: palette.ink },
  forgot: { color: palette.ink, fontSize: 12, fontWeight: '600', textAlign: 'right', marginTop: 4 },
  button: { backgroundColor: palette.ink, borderRadius: 12, padding: 16, marginTop: 16 },
  buttonText: { color: palette.paper, textAlign: 'center', fontSize: 14, fontWeight: '600' },
  note: { color: palette.muted, textAlign: 'center', fontSize: 11, marginTop: 12 },
});
