import { useEffect,useState } from 'react';
import * as Linking from 'expo-linking';
import { Redirect } from 'expo-router';
import { Text } from 'react-native';
import { ScreenShell } from '@/components/screen-shell';
import { acceptRecovery } from '@/lib/api';
export default function Recovery(){const url=Linking.useURL();const [state,setState]=useState('Waiting for a password recovery link…');const [done,setDone]=useState(false);useEffect(()=>{if(!url)return;const hash=url.split('#')[1]??url.split('?')[1]??'';const parameters=new URLSearchParams(hash);const access=parameters.get('access_token');const refresh=parameters.get('refresh_token');if(!access||!refresh)return;acceptRecovery(access,refresh).then(()=>setDone(true)).catch(()=>setState('This recovery link is invalid or expired. Request another email.'));},[url]);if(done)return <Redirect href="/account"/>;return <ScreenShell><Text>{state}</Text></ScreenShell>}
