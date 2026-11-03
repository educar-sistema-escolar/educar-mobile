import { demoEnabled } from '@/lib/demo';
import { DemoAccount } from '@/components/demo-screens';
import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, TextInput, StyleSheet } from 'react-native';
import { ScreenShell, Card } from '@/components/screen-shell';
import { changePassword, logout } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useFamily } from '@/lib/family';
export default function ScreenEntry() { return demoEnabled ? <DemoAccount /> : <LegacyScreen />; }
function LegacyScreen() {
    const { session } = useAuth();
    const { children, childId } = useFamily();
    const persona = children.find(child => child.id === childId)?.people;
    const nombre = session?.name?.trim() || (persona ? `${persona.first_name} ${persona.last_name}` : 'Mi cuenta');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    return <ScreenShell><Text style={styles.title}>Mi cuenta</Text><Card><Text>{nombre}</Text><Text style={styles.muted}>{session?.role === 'student' ? 'Acceso de estudiante' : 'Acceso familiar · Solo alumnos vinculados'}</Text></Card><Card><Text style={styles.label}>Cambiar contraseña</Text><TextInput accessibilityLabel="Nueva contraseña" secureTextEntry value={password} onChangeText={setPassword} placeholder="Al menos 12 caracteres" style={styles.input}/><Pressable disabled={busy} accessibilityRole="button" style={styles.button} onPress={async () => { if (password.length < 12) {
        setMessage('Usá al menos 12 caracteres.');
        return;
    } setBusy(true); try {
        await changePassword(password);
        setPassword('');
        setMessage('Contraseña actualizada.');
    }
    catch {
        setMessage('No se pudo actualizar la contraseña.');
    }
    finally {
        setBusy(false);
    } }}><Text style={styles.white}>Actualizar contraseña</Text></Pressable></Card>{message ? <Text accessibilityRole="alert">{message}</Text> : null}<Pressable accessibilityRole="button" style={styles.button} onPress={async () => { try {
        await logout();
    }
    catch {
        setMessage('Se cerró la sesión local, pero no se pudo confirmar el cierre en el servidor.');
    } router.replace('/login'); }}><Text style={styles.white}>Cerrar sesión</Text></Pressable></ScreenShell>;
}
const styles = StyleSheet.create({ title: { color: '#172B4D', fontSize: 28, fontWeight: '700' }, muted: { color: '#607089', marginTop: 8 }, label: { fontWeight: '600' }, input: { borderWidth: 1, borderColor: '#E5ECF5', padding: 14, borderRadius: 12, marginVertical: 14 }, button: { minHeight: 50, backgroundColor: '#245FC6', padding: 16, borderRadius: 14, alignItems: 'center' }, white: { color: '#fff', fontWeight: '600' } });
