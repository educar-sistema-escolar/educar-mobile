export function validateDemoPayment({ amount, date, filename, max, today = '2026-10-13' }) {
  const input = amount.trim();
  const value = Number(input.replace(',', '.'));
  if (!/^\d+([,.]\d{1,2})?$/.test(input) || !Number.isFinite(value) || value <= 0 || value > max) {
    throw new Error('Ingresá un importe mayor que cero, sin puntos de miles y con hasta dos decimales. No puede superar el saldo de la factura.');
  }
  const parsedDate = new Date(`${date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date || date > today) {
    throw new Error('Ingresá una fecha válida hasta el 13 de octubre de 2026 (AAAA-MM-DD).');
  }
  if (!filename) throw new Error('Adjuntá un comprobante o usá el de ejemplo.');
  return value;
}
