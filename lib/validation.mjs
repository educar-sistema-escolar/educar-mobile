export function validatePeriod(start, end) {
  for (const value of [start, end]) { const date=new Date(value); if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== value) throw new Error('Ingresá fechas válidas (AAAA-MM-DD).'); }
  if (start > end) throw new Error('La fecha inicial no puede ser posterior a la final.');
}
export function validateTransfer(items, cents, file, reference) {
  if (!items.length || new Set(items).size !== items.length) throw new Error('Seleccioná conceptos pendientes.');
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error('Ingresá un importe positivo con hasta dos decimales.');
  if (!file || !['application/pdf','image/jpeg','image/png'].includes(file.type) || !Number.isSafeInteger(file.size) || file.size <= 0 || file.size > 5242880) throw new Error('Adjuntá un PDF, JPG o PNG de hasta 5 MB.');
  if (!reference.trim() || reference.trim().length > 100) throw new Error('Ingresá la referencia bancaria (hasta 100 caracteres).');
  return cents;
}
