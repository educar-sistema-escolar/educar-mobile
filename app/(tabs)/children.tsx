import { demoEnabled } from '@/lib/demo';
import { DemoChildren } from '@/components/demo-screens';
import { Redirect } from 'expo-router';
export default function Children() { return demoEnabled ? <DemoChildren /> : <Redirect href="/" />; }
