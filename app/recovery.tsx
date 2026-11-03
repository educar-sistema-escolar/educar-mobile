import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { Redirect } from 'expo-router';
import { Text } from 'react-native';
import { ScreenShell } from '@/components/screen-shell';
import { acceptRecovery } from '@/lib/api';
import { recoveryTokens } from '@/lib/recovery.mjs';
export default function Recovery() {
 const url=Linking.useURL();const [state,setState]=useState('Esperando un enlace para recuperar tu contraseña…');const [done,setDone]=useState(false);
 useEffect(()=>{let active=true;if(!url)return;Promise.resolve().then(async()=>{const {access,refresh}=recoveryTokens(url);await acceptRecovery(access,refresh,()=>active);if(active)setDone(true);}).catch(()=>{if(active)setState('El enlace es inválido o venció. Solicitá otro correo.');});return ()=>{active=false;};},[url]);
 if(done)return <Redirect href="/account"/>;return <ScreenShell><Text accessibilityRole="alert">{state}</Text></ScreenShell>;
}
