import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDemoPayment } from '../lib/demo-transfer.mjs';

test('la demo admite pagos parciales y coma decimal, y rechaza importes y fechas inválidos', () => {
  const input = { amount: '1250,50', date: '2026-10-13', filename: 'demo.pdf', max: 64500 };
  assert.equal(validateDemoPayment(input), 1250.5);
  for (const amount of ['0', '-1', '64501', '1.234,56', '0.001', 'Infinity', '']) {
    assert.throws(() => validateDemoPayment({ ...input, amount }));
  }
  for (const date of ['2026-02-30', '2026-10-14', '13/10/2026', '']) {
    assert.throws(() => validateDemoPayment({ ...input, date }));
  }
  assert.throws(() => validateDemoPayment({ ...input, filename: '' }));
});
