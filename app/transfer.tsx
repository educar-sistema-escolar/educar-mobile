import { demoEnabled } from '@/lib/demo';
import { DemoTransfer } from '@/components/demo-screens';
import { useRef, useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Pressable, Text, TextInput, StyleSheet, Share } from 'react-native';
import { Card, ScreenShell } from '@/components/screen-shell';
import { useAuth } from '@/lib/auth';
import { money, useInvoices, useFamily } from '@/lib/family';
import { request, uploadReceipt } from '@/lib/api';
import { parseMoney } from '@/lib/session-tools.mjs';
import { validateTransfer } from '@/lib/validation.mjs';
import { mensajeError } from '@/lib/mensaje-error';
export default function ScreenEntry() { const { session } = useAuth(); return demoEnabled ? <DemoTransfer /> : session?.role === 'student' ? <Redirect href="/" /> : <LegacyScreen />; }
function LegacyScreen() { const params=useLocalSearchParams<{invoiceId:string;submissionId?:string}>();const {session}=useAuth();const {childId}=useFamily();return <TransferForm key={JSON.stringify([session?.user.id,childId,params.invoiceId,params.submissionId])}/>; }
function TransferForm() {
    const { session, ready } = useAuth();
    const { invoiceId, submissionId } = useLocalSearchParams<{
        invoiceId: string;
        submissionId?: string;
    }>();
    const { invoices, transfers, loading, error, reload } = useInvoices();
    const invoice = invoices.find(i => i.id === invoiceId);
    const [selected, setSelected] = useState<string[]>([]);
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    const submitting = useRef(false);
    const [confirmation, setConfirmation] = useState('');
    const [uploaded, setUploaded] = useState('');
    if (ready && !session)
        return <Redirect href="/login"/>;
    const submission = transfers.find(t => t.id === submissionId && t.invoice_id === invoiceId && t.status === 'pending');
    const outstanding = invoice?.invoice_items.filter(i => selected.includes(i.id)).reduce((n, i) => n + i.amount_cents - i.paid_cents, 0) ?? 0;
    async function submit() { if (submitting.current)
        return; submitting.current=true; setBusy(true); setMessage(''); try {
        if (!session || !invoice || submissionId && !submission)
            throw new Error('Esta factura o transferencia no está disponible.');
        const cents = submissionId ? 1 : parseMoney(amount);
        if (!file) throw new Error('Adjuntá un comprobante.');
        if (file.size != null && file.size > 5242880) throw new Error('El comprobante supera el límite de 5 MB.');
        setBusy(true);
        const blob = await (await fetch(file.uri)).blob();
        const type = blob.type || file.mimeType || '';
        if (blob.type && file.mimeType && blob.type !== file.mimeType) throw new Error('El tipo de comprobante no coincide con el archivo seleccionado.');
        if (!submissionId)
            validateTransfer(selected, cents, {size: blob.size, type}, reference);
        else
            validateTransfer(['receipt'], 1, {size: blob.size, type}, 'attachment');
        if (!submissionId && cents > outstanding)
            throw new Error('El importe no puede superar la deuda de los conceptos seleccionados.');
        const extension = type === 'application/pdf' ? 'pdf' : type === 'image/png' ? 'png' : 'jpg';
        const path = uploaded || `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        if (!uploaded) {
            await uploadReceipt(path, blob, type);
            setUploaded(path);
        }
        const id = await request<string>(submissionId ? '/rest/v1/rpc/attach_transfer_receipt' : '/rest/v1/rpc/submit_transfer', { method: 'POST', body: JSON.stringify(submissionId ? { p_submission: submissionId, p_path: path, p_filename: file.name } : { p_invoice: invoiceId, p_items: selected, p_amount: cents, p_reference: reference.trim(), p_path: path, p_filename: file.name }) });
        setConfirmation(submissionId ?? id);
    }
    catch (e) {
        setMessage(e instanceof Error && /[áéíóúñ]|^El |^Esta |^Ingresá|^Adjuntá|^Seleccioná/.test(e.message) ? e.message : mensajeError(e, 'No se pudo informar la transferencia.'));
    }
    finally {
        submitting.current=false;
        setBusy(false);
    } }
    return <ScreenShell><Text style={styles.title}>{submissionId ? 'Agregar comprobante' : 'Transferencia bancaria'}</Text>{confirmation ? <><Card><Text style={styles.section}>Presentación recibida</Text><Text style={styles.muted}>Operación {confirmation}</Text><Text style={styles.muted}>Factura {invoiceId} · {invoice?.period.slice(0, 7)}</Text><Text style={styles.muted}>{reference} · {amount ? money(parseMoney(amount)) : 'Comprobante adicional'}</Text><Text style={styles.muted}>{invoice?.invoice_items.filter(i => selected.includes(i.id)).map(i => i.label).join(', ')}</Text><Pressable accessibilityRole="button" onPress={() => Share.share({ message: `EDUCAR · Constancia de presentación\nOperación ${confirmation}\nFactura ${invoiceId}\nReferencia ${reference}\nImporte ARS ${amount}\nPendiente de revisión por la institución; no es una factura pagada.` })}><Text style={{ marginTop: 12, fontWeight: '600' }}>Compartir constancia</Text></Pressable><Text style={styles.muted}>La transferencia está pendiente de revisión. Esta constancia no acredita el pago.</Text></Card><Pressable accessibilityRole="button" style={styles.button} onPress={() => router.replace('/(tabs)/payments')}><Text style={styles.white}>Volver a facturas</Text></Pressable></> : <>{loading ? <Text>Cargando factura…</Text> : null}{error ? <Pressable accessibilityRole="button" onPress={reload}><Text accessibilityRole="alert">{error} Tocá para reintentar.</Text></Pressable> : null}{!loading && !invoice ? <Text>Esta factura no está disponible para el alumno seleccionado.</Text> : null}{invoice ? <><Card><Text style={styles.section}>Factura · {invoice.period.slice(0, 7)}</Text><Text style={styles.muted}>Vence {invoice.due_date}</Text>{!submissionId ? invoice.invoice_items.filter(i => i.amount_cents > i.paid_cents).map(item => <Pressable key={item.id} disabled={busy} accessibilityRole="checkbox" role="checkbox" aria-checked={selected.includes(item.id)} accessibilityState={{ checked: selected.includes(item.id) }} onPress={() => setSelected(list => list.includes(item.id) ? list.filter(id => id !== item.id) : [...list, item.id])} style={styles.item}><Text style={{ flex: 1 }}>{selected.includes(item.id) ? '☑' : '☐'} {item.label}</Text><Text>{money(item.amount_cents - item.paid_cents)}</Text></Pressable>) : <Text style={styles.muted}>Adjuntá otro archivo a la presentación pendiente.</Text>}</Card>{!submissionId ? <Card><Text style={styles.section}>Datos de la transferencia</Text><Text style={styles.muted}>Saldo de los conceptos seleccionados: {money(outstanding)}</Text><TextInput editable={!busy} accessibilityLabel="Importe de la transferencia en pesos" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} placeholder="Importe en pesos (ej. 42000.00)" style={styles.input}/><TextInput editable={!busy} accessibilityLabel="Referencia bancaria" value={reference} onChangeText={setReference} maxLength={100} placeholder="Referencia de la transferencia" style={styles.input}/></Card> : null}<Card><Text style={styles.section}>Comprobante de transferencia</Text><Text style={styles.muted}>PDF, JPG o PNG · Máximo 5 MB</Text><Pressable accessibilityRole="button" disabled={busy} style={styles.secondary} onPress={async () => { try {
        const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/jpeg', 'image/png'], copyToCacheDirectory: true, multiple: false });
        if (!result.canceled) {
            setFile(result.assets[0]);
            setUploaded('');
            setMessage('');
        }
    }
    catch {
        setMessage('No se pudo seleccionar el archivo. Intentá nuevamente.');
    } }}><Text>{file?.name ?? 'Seleccionar archivo'}</Text></Pressable></Card>{message ? <Text accessibilityRole="alert">{message}</Text> : null}<Pressable accessibilityRole="button" disabled={busy} style={styles.button} onPress={submit}><Text style={styles.white}>{busy ? 'Enviando…' : 'Enviar para revisión'}</Text></Pressable></> : null}</>}</ScreenShell>;
}
const styles = StyleSheet.create({ title: { color: '#172B4D', fontSize: 28, fontWeight: '700' }, section: { color: '#172B4D', fontSize: 16, fontWeight: '600' }, muted: { fontSize: 13, color: '#607089', lineHeight: 20, marginTop: 8 }, item: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderColor: '#E5ECF5', paddingTop: 14, marginTop: 14 }, input: { borderWidth: 1, borderColor: '#E5ECF5', borderRadius: 12, padding: 14, marginTop: 14 }, button: { minHeight: 50, backgroundColor: '#245FC6', padding: 16, borderRadius: 14, alignItems: 'center' }, white: { color: '#fff', fontWeight: '600' }, secondary: { borderWidth: 1, borderColor: '#E5ECF5', padding: 14, borderRadius: 12, marginTop: 14 } });
