import { Ionicons } from '@expo/vector-icons';
import { demoEnabled } from '@/lib/demo';
import { DemoLogin } from '@/components/demo-screens';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { configured, login, resetPassword } from '@/lib/api';
import { palette } from '@/constants/palette';
import { mensajeError } from '@/lib/mensaje-error';
export default function ScreenEntry() { return demoEnabled ? <DemoLogin /> : <LegacyScreen />; }
function LegacyScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const quickStudentPassword = process.env.EXPO_PUBLIC_QA_STUDENT_PASSWORD;
    const quickFamilyPassword = process.env.EXPO_PUBLIC_QA_FAMILY_PASSWORD;
    const validEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    async function signIn() { if (!validEmail() || !password) {
        setError('Ingresá un correo válido y tu contraseña.');
        return;
    } setBusy(true); setError(''); try {
        await login(email, password);
        router.replace('/(tabs)');
    }
    catch (e) {
        setError(mensajeError(e, 'No se pudo iniciar sesión. Intentá nuevamente.'));
    }
    finally {
        setBusy(false);
    } }
    return <SafeAreaView style={styles.page}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}><View style={styles.mark}><Ionicons name="school-outline" size={32} color="#FFF"/></View><Text style={styles.eyebrow}>educar para transformar</Text><Text style={styles.title}>La escuela, más cerca.</Text><Text style={styles.subtitle}>Ingresá para consultar la información escolar.</Text>{__DEV__ && (process.env.EXPO_PUBLIC_QA_FAMILY_EMAIL || process.env.EXPO_PUBLIC_QA_STUDENT_EMAIL) ? <View style={styles.quick}><Text style={styles.quickTitle}>Acceso de prueba · Supabase</Text><Text style={styles.subtitle}>Elegí una cuenta para completar el formulario.</Text>{process.env.EXPO_PUBLIC_QA_FAMILY_EMAIL ? <Pressable accessibilityRole="button" style={styles.quickButton} onPress={() => { setEmail(process.env.EXPO_PUBLIC_QA_FAMILY_EMAIL || ''); setPassword(quickFamilyPassword || ''); setError(''); }}><Text style={styles.quickText}>Completar cuenta Familia</Text></Pressable> : null}{process.env.EXPO_PUBLIC_QA_STUDENT_EMAIL ? <Pressable accessibilityRole="button" style={styles.quickButton} onPress={() => { setEmail(process.env.EXPO_PUBLIC_QA_STUDENT_EMAIL || ''); setPassword(quickStudentPassword || ''); setError(''); }}><Text style={styles.quickText}>Completar cuenta Estudiante</Text></Pressable> : null}</View> : null}<View style={styles.fields}><Text style={styles.label}>CORREO ELECTRÓNICO</Text><TextInput accessibilityLabel="Correo electrónico" placeholder="nombre@ejemplo.com" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={email} onChangeText={setEmail} style={styles.input}/><Text style={styles.label}>CONTRASEÑA</Text><TextInput accessibilityLabel="Contraseña" placeholder="Ingresá tu contraseña" placeholderTextColor="#999" secureTextEntry autoComplete="current-password" value={password} onChangeText={setPassword} style={styles.input}/><Pressable accessibilityRole="button" disabled={busy || !configured} onPress={async () => { if (!validEmail()) {
        setError('Ingresá primero tu correo electrónico.');
        return;
    } setBusy(true); try {
        await resetPassword(email);
        setError('Si la cuenta existe, recibirás instrucciones para recuperar tu contraseña.');
    }
    catch {
        setError('No se pudo solicitar la recuperación.');
    }
    finally {
        setBusy(false);
    } }}><Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text></Pressable></View>{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || !configured }} disabled={busy || !configured} onPress={signIn} style={[styles.button, (busy || !configured) && { opacity: .45 }]}><Text style={styles.buttonText}>{busy ? 'Ingresando…' : 'Ingresar'}</Text></Pressable><Text style={styles.note}>{configured ? 'Acceso seguro para familias y estudiantes' : 'Falta configurar la conexión con la escuela'}</Text></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ quick: { backgroundColor: palette.paper, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: palette.line, gap: 8 }, quickTitle: { color: palette.ink, fontSize: 15, fontWeight: '700' }, quickButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 10, backgroundColor: palette.soft }, quickText: { color: palette.primary, fontWeight: '600' }, page: { flex: 1, backgroundColor: palette.soft }, content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical:48, gap: 14, width:'100%',maxWidth:520,alignSelf:'center' }, mark: { width: 64, height: 64, backgroundColor: palette.primary, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }, markText: { color: palette.paper, fontSize: 22, fontWeight: '700' }, eyebrow: { color: palette.muted, fontSize: 15, fontWeight: '600' }, title: { color: palette.ink, fontSize: 42, lineHeight:46, fontWeight: '800', letterSpacing: -1.8 }, subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21 }, fields: { gap: 8, marginTop: 20 }, label: { color: palette.muted, fontSize: 12, letterSpacing: 1, fontWeight: '700', marginTop: 8 }, input: { minHeight: 50, backgroundColor: palette.paper, borderColor: palette.line, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontSize: 16, color: palette.ink }, forgot: { color: palette.ink, fontSize: 12, fontWeight: '600', textAlign: 'right', marginTop: 8, paddingVertical: 8 }, error: { color: palette.ink, fontSize: 12, lineHeight: 18 }, button: { backgroundColor: palette.primary, borderRadius: 14, padding: 16, marginTop: 16 }, buttonText: { color: palette.paper, textAlign: 'center', fontSize: 14, fontWeight: '600' }, note: { color: palette.muted, textAlign: 'center', fontSize: 13, lineHeight: 19, marginTop: 12 } });
