export function validatePeriod(start, end) {
  for (const value of [start, end]) { const date=new Date(value); if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== value) throw new Error('Enter valid dates (YYYY-MM-DD).'); }
  if (start > end) throw new Error('Start date must not follow end date.');
}
export function validateTransfer(items, cents, file, reference) {
  if (!items.length || new Set(items).size !== items.length) throw new Error('Select pending concepts.');
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error('Enter a positive amount with at most two decimals.');
  if (!file || !['application/pdf','image/jpeg','image/png'].includes(file.type) || file.size <= 0 || file.size > 5242880) throw new Error('Attach a PDF, JPG or PNG up to 5 MB.');
  if (!reference.trim() || reference.trim().length > 100) throw new Error('Enter the bank transfer reference (up to 100 characters).');
  return cents;
}
