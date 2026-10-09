import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, TextInput, StyleSheet } from 'react-native';
import { ScreenShell, Card } from '@/components/screen-shell';
import { changePassword, logout } from '@/lib/api';
import { useAuth } from '@/lib/auth';
export default function Account() {
    const { session } = useAuth();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    return <ScreenShell><Text style={styles.title}>Your account</Text><Card><Text>{session?.name}</Text><Text style={styles.muted}>Family access · Your linked children only</Text></Card><Card><Text style={styles.label}>Change password</Text><TextInput accessibilityLabel="New password" secureTextEntry value={password} onChangeText={setPassword} placeholder="At least 12 characters" style={styles.input}/><Pressable disabled={busy} accessibilityRole="button" style={styles.button} onPress={async () => { if (password.length < 12) {
        setMessage('Use at least 12 characters.');
        return;
    } setBusy(true); try {
        await changePassword(password);
        setPassword('');
        setMessage('Password updated.');
    }
    catch {
        setMessage('Password could not be updated.');
    }
    finally {
        setBusy(false);
    } }}><Text style={styles.white}>Update password</Text></Pressable></Card>{message ? <Text accessibilityRole="alert">{message}</Text> : null}<Pressable accessibilityRole="button" style={styles.button} onPress={async () => { try {
        await logout();
    }
    catch {
        setMessage('Local session cleared; server logout could not be confirmed.');
    } router.replace('/login'); }}><Text style={styles.white}>Sign out</Text></Pressable></ScreenShell>;
}
const styles = StyleSheet.create({ title: { fontSize: 30, fontWeight: '700' }, muted: { color: '#777', marginTop: 8 }, label: { fontWeight: '600' }, input: { borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 12, marginVertical: 14 }, button: { backgroundColor: '#111', padding: 16, borderRadius: 12, alignItems: 'center' }, white: { color: '#fff', fontWeight: '600' } });
