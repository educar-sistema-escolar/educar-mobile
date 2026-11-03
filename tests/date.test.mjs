import {test} from 'node:test';
import assert from 'node:assert/strict';
import {schoolDate, invoiceStatus} from '../lib/date.mjs';
test('timestamps use Buenos Aires business date at UTC midnight',()=>assert.equal(schoolDate('2026-10-09T01:31:00Z'),'2026-10-08'));
test('invalid timestamps fail safely',()=>assert.equal(schoolDate('bad'),'Date unavailable'));

test('invoice status respects the due date and approved balance',()=>{assert.equal(invoiceStatus('2026-11-03',100,'2026-11-03'),'pending');assert.equal(invoiceStatus('2026-11-02',100,'2026-11-03'),'overdue');assert.equal(invoiceStatus('2026-11-02',0,'2026-11-03'),'paid');});
