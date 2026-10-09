import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recoveryTokens} from '../lib/recovery.mjs';
test('only complete recovery links are accepted',()=>{assert.deepEqual(recoveryTokens('educar://recovery#access_token=a&refresh_token=b&type=recovery'),{access:'a',refresh:'b'});assert.throws(()=>recoveryTokens('educar://recovery#error=expired'),/invalid or expired/);assert.throws(()=>recoveryTokens('educar://recovery#access_token=a'),/invalid or expired/);assert.throws(()=>recoveryTokens('educar://recovery#access_token=a&refresh_token=b&type=signup'),/invalid or expired/);});
