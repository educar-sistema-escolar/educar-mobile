import React, { createContext, useContext, useState, type PropsWithChildren } from 'react';

export const demoEnabled = process.env.EXPO_PUBLIC_DEMO === 'true';
export type DemoRole = 'family' | 'student';
export const students = [
  { id: 'sofia', name: 'Sofía Martínez', initials: 'SM', grade: '3.º B', level: 'Primaria', color: '#DDD9FC', sport: 'Vóley', teacher: 'Prof. Lucía Fernández', schedule: 'Martes y jueves · 16:00 a 17:00', bus: '04', route: 'Recorrido Norte', lunch: 'Menú completo' },
  { id: 'lucas', name: 'Lucas Martínez', initials: 'LM', grade: '1.º A', level: 'Secundaria', color: '#CDEDEA', sport: 'Básquet', teacher: 'Prof. Diego López', schedule: 'Lunes y miércoles · 17:00 a 18:00', bus: '07', route: 'Recorrido Centro', lunch: 'Menú vegetariano' },
];
export type DemoInvoice = { id: string; studentId: string; title: string; period: string; due: string; amount: number; status: 'Pagada' | 'Pendiente' | 'Vencida'; concepts: { name: string; amount: number }[] };
export const invoices: DemoInvoice[] = students.flatMap((s, i) => [
  { id: `${s.id}-oct`, studentId: s.id, title: 'Cuota de octubre', period: 'Octubre 2026', due: '2026-10-20', amount: 64500 + i * 8000, status: 'Pendiente' as const, concepts: [{ name: 'Cuota escolar', amount: 42000 + i * 8000 }, { name: 'Comedor', amount: 8500 }, { name: 'Transporte', amount: 14000 }] },
  { id: `${s.id}-sep`, studentId: s.id, title: 'Cuota de septiembre', period: 'Septiembre 2026', due: '2026-09-20', amount: 14000, status: 'Vencida' as const, concepts: [{ name: 'Transporte pendiente', amount: 14000 }] },
  { id: `${s.id}-ago`, studentId: s.id, title: 'Cuota de agosto', period: 'Agosto 2026', due: '2026-08-20', amount: 64500 + i * 8000, status: 'Pagada' as const, concepts: [{ name: 'Cuota escolar', amount: 42000 + i * 8000 }, { name: 'Comedor', amount: 8500 }, { name: 'Transporte', amount: 14000 }] },
]);
export const moneyDemo = (amount: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
export const dateDemo = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
export type DemoPayment = { id: string; invoiceId: string; studentId: string; amount: number; date: string; filename: string };
type DemoState = { role: DemoRole | null; signIn: (role: DemoRole) => void; signOut: () => void; student: typeof students[number]; selectStudent: (id: string) => void; bills: DemoInvoice[]; payments: DemoPayment[]; addPayment: (payment: Omit<DemoPayment, 'id'>) => void; stop: number; nextStop: () => void; resetStops: () => void };
const DemoContext = createContext<DemoState | null>(null);
export function DemoProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<DemoRole | null>(null);
  const [studentId, setStudentId] = useState('sofia');
  const [payments, setPayments] = useState<DemoPayment[]>([]);
  const [stop, setStop] = useState(1);
  const student = students.find(s => s.id === studentId)!;
  return <DemoContext.Provider value={{ role, signIn: r => { setRole(r); setStudentId('sofia'); setStop(1); }, signOut: () => { setRole(null); setStudentId('sofia'); }, student, selectStudent: id => { if (role === 'family' && students.some(s => s.id === id)) { setStudentId(id); setStop(1); } }, bills: role === 'family' ? invoices.filter(i => i.studentId === studentId) : [], payments: role === 'family' ? payments.filter(p => p.studentId === studentId) : [], addPayment: p => { if (role === 'family' && p.studentId === studentId) setPayments(all => [{ ...p, id: `TR-${Date.now().toString().slice(-6)}` }, ...all]); }, stop, nextStop: () => setStop(s => Math.min(4, s + 1)), resetStops: () => setStop(0) }}>{children}</DemoContext.Provider>;
}
export function useDemo() { const value = useContext(DemoContext); if (!value) throw new Error('La demo necesita DemoProvider'); return value; }
