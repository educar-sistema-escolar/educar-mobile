export function schoolDate(value: string): string;
export function invoiceStatus(dueDate: string, outstanding: number, today: string): 'paid' | 'overdue' | 'pending';
