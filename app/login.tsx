import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { configured, login, resetPassword } from '@/lib/api';
import { palette } from '@/constants/palette';
export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const validEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    async function signIn() { if (!validEmail() || !password) {
        setError('Enter a valid email address and password.');
        return;
    } setBusy(true); setError(''); try {
        await login(email, password);
        router.replace('/(tabs)');
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'Sign in failed.');
    }
    finally {
        setBusy(false);
    } }
    return <SafeAreaView style={styles.page}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}><View style={styles.mark}><Text style={styles.markText}>E</Text></View><Text style={styles.eyebrow}>EDUCAR · FAMILY</Text><Text style={styles.title}>Welcome back.</Text><Text style={styles.subtitle}>Sign in to see your family&apos;s school information.</Text><View style={styles.fields}><Text style={styles.label}>EMAIL</Text><TextInput accessibilityLabel="Email" placeholder="you@example.com" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={email} onChangeText={setEmail} style={styles.input}/><Text style={styles.label}>PASSWORD</Text><TextInput accessibilityLabel="Password" placeholder="Enter your password" placeholderTextColor="#999" secureTextEntry autoComplete="current-password" value={password} onChangeText={setPassword} style={styles.input}/><Pressable accessibilityRole="button" disabled={busy || !configured} onPress={async () => { if (!validEmail()) {
        setError('Enter your email first.');
        return;
    } setBusy(true); try {
        await resetPassword(email);
        setError('If your account exists, recovery instructions have been sent.');
    }
    catch {
        setError('Recovery could not be requested.');
    }
    finally {
        setBusy(false);
    } }}><Text style={styles.forgot}>Forgot password?</Text></Pressable></View>{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || !configured }} disabled={busy || !configured} onPress={signIn} style={[styles.button, (busy || !configured) && { opacity: .45 }]}><Text style={styles.buttonText}>{busy ? 'Signing in…' : 'Sign in'}</Text></Pressable><Text style={styles.note}>{configured ? 'Secure access for registered families' : 'Setup required · Configure the public Supabase connection'}</Text></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: palette.paper }, content: { flexGrow: 1, justifyContent: 'center', padding: 28, gap: 14 }, mark: { width: 44, height: 44, backgroundColor: palette.ink, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }, markText: { color: palette.paper, fontSize: 22, fontWeight: '700' }, eyebrow: { color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 }, title: { color: palette.ink, fontSize: 34, fontWeight: '700', letterSpacing: -1.2 }, subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21 }, fields: { gap: 8, marginTop: 20 }, label: { color: palette.muted, fontSize: 10, letterSpacing: 1, fontWeight: '700', marginTop: 8 }, input: { height: 50, borderColor: palette.line, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontSize: 14, color: palette.ink }, forgot: { color: palette.ink, fontSize: 12, fontWeight: '600', textAlign: 'right', marginTop: 8, paddingVertical: 8 }, error: { color: palette.ink, fontSize: 12, lineHeight: 18 }, button: { backgroundColor: palette.ink, borderRadius: 12, padding: 16, marginTop: 16 }, buttonText: { color: palette.paper, textAlign: 'center', fontSize: 14, fontWeight: '600' }, note: { color: palette.muted, textAlign: 'center', fontSize: 11, lineHeight: 17, marginTop: 12 } });
