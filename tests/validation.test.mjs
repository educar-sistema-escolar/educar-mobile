import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTransfer, validatePeriod } from '../lib/validation.mjs';
test('rejects empty concepts, invalid money and receipt types',()=>{assert.throws(()=>validateTransfer([],0,{size:2,type:'text/html'},''));});
test('accepts selected items and bounded PDF',()=>{assert.equal(validateTransfer(['one'],4200000,{size:100,type:'application/pdf'},'BANK-1'),4200000);});
test('rejects reversed and invalid dates',()=>{assert.throws(()=>validatePeriod('2026-02-30','2026-03-01'));assert.throws(()=>validatePeriod('2026-10-02','2026-10-01'));});
test('receipt metadata must contain a finite positive byte count',()=>{assert.throws(()=>validateTransfer(['a'],100,{size:NaN,type:'application/pdf'},'ref'),/Attach/);});
