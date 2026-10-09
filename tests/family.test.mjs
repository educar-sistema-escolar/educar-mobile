import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {scopedValue} from '../lib/data-scope.mjs';
function hook(){let session={},childId='a',cursor=0;const states=[],effects=[],jobs=[],requests=[];
 const react={createContext:value=>value,useContext:()=>({childId}),useState:value=>{const index=cursor++;if(!(index in states))states[index]=value;return [states[index],value=>{states[index]=typeof value==='function'?value(states[index]):value}]},useEffect:(fn,deps)=>{const index=cursor++;const previous=effects[index];if(!previous||deps.some((dep,n)=>dep!==previous.deps[n])){jobs.push(()=>{previous?.cleanup?.();effects[index]={deps,cleanup:fn()}})}}};
 const module={exports:{}};const output=ts.transpileModule(fs.readFileSync('lib/family.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(output,{module,exports:module.exports,__DEV__:false,Promise,Intl,console,require:name=>name==='react'?react:name.includes('jsx-runtime')?{}:name==='./api'?{request:path=>new Promise(resolve=>requests.push({path,resolve}))}:name==='./auth'?{useAuth:()=>({session})}:{scopedValue}});
 return {render:()=>{cursor=0;return module.exports.useInvoices()},flush:async()=>{jobs.splice(0).forEach(job=>job());await Promise.resolve();await Promise.resolve()},requests,child:value=>{childId=value},login:()=>{session={}}};
}
test('actual invoice hook hides prior child data before effects and discards late replies',async()=>{const h=hook();h.render();await h.flush();const old=h.requests.splice(0);h.child('b');assert.equal(h.render().invoices.length,0);await h.flush();old[0].resolve([{id:'old',invoice_items:[]}]);old[1].resolve([]);await h.flush();assert.equal(h.render().invoices.length,0);h.requests[0].resolve([{id:'new',invoice_items:[]}]);h.requests[1].resolve([]);await h.flush();assert.equal(h.render().invoices[0].id,'new');});
test('actual invoice hook cannot reuse data when another session selects the same child',async()=>{const h=hook();h.render();await h.flush();h.requests[0].resolve([{id:'old',invoice_items:[]}]);h.requests[1].resolve([]);await h.flush();assert.equal(h.render().invoices[0].id,'old');h.login();assert.equal(h.render().invoices.length,0);await h.flush();assert.equal(h.requests.length,4);});
