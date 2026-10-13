import { demoEnabled, DemoProvider } from '@/lib/demo';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { FamilyProvider } from '@/lib/family';
import { AuthProvider } from '@/lib/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
export default function RootLayout() { return demoEnabled ? <DemoProvider><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F6F8FC' }, animation: 'slide_from_right' }} /><StatusBar style='dark' /></DemoProvider> : <LegacyRootLayout />; }
export const unstable_settings = {
    anchor: '(tabs)',
};
function LegacyRootLayout() {
    const colorScheme = useColorScheme();
    return (<AuthProvider><FamilyProvider><ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <Stack screenOptions={{ contentStyle: { backgroundColor: '#FFFFFF' }, headerStyle: { backgroundColor: '#FFFFFF' }, headerTintColor: '#111111', headerShadowVisible: false }}>

        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>

        <Stack.Screen name="login" options={{ headerShown: false }}/>

        <Stack.Screen name="account" options={{ title: 'Your account', headerBackTitle: 'Back' }}/>
        <Stack.Screen name="transfer" options={{ title: 'Bank transfer', headerBackTitle: 'Back' }}/>
        <Stack.Screen name="recovery" options={{ title: 'Password recovery' }}/>
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }}/>

      </Stack>

      <StatusBar style="dark"/>

    </ThemeProvider></FamilyProvider></AuthProvider>);
}
