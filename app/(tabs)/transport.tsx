import { demoEnabled } from '@/lib/demo';
import { DemoTransport } from '@/components/demo-screens';
import { Redirect } from 'expo-router';
export default function Transport() { return demoEnabled ? <DemoTransport /> : <Redirect href="/" />; }
