import {test} from 'node:test';
import assert from 'node:assert/strict';
import {schoolDate} from '../lib/date.mjs';
test('timestamps use Buenos Aires business date at UTC midnight',()=>assert.equal(schoolDate('2026-10-09T01:31:00Z'),'2026-10-08'));
test('invalid timestamps fail safely',()=>assert.equal(schoolDate('bad'),'Date unavailable'));
