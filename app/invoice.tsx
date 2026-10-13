import { demoEnabled } from '@/lib/demo';
import { DemoInvoiceDetail } from '@/components/demo-screens';
import { Redirect } from 'expo-router';
export default function Invoice() { return demoEnabled ? <DemoInvoiceDetail /> : <Redirect href="/" />; }
