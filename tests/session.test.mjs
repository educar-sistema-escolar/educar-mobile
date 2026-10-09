import { test } from 'node:test';
import assert from 'node:assert/strict';
import { singleFlight, parseMoney } from '../lib/session-tools.mjs';
test('refresh concurrent requests exactly once',async()=>{let calls=0;const run=singleFlight(async()=>{calls++;await new Promise(r=>setTimeout(r,10));return 7});assert.deepEqual(await Promise.all([run(),run()]),[7,7]);assert.equal(calls,1);await run();assert.equal(calls,2);});
test('money rejects fractions beyond cents and unsafe integer totals',()=>{assert.equal(parseMoney('42000.01'),4200001);assert.throws(()=>parseMoney('1.001'));assert.throws(()=>parseMoney('Infinity'));assert.throws(()=>parseMoney('9007199254740992'));});
