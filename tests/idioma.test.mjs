import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(path){const module={exports:{}};const output=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(output,{module,exports:module.exports,Error});return module.exports;}
test('nombres institucionales conocidos se muestran en español y se conservan nombres propios',()=>{const {nombreNivel}=load('lib/nombre-nivel.ts');assert.equal(nombreNivel('Secondary'),'Secundaria');assert.equal(nombreNivel('Primary'),'Primaria');assert.equal(nombreNivel('Taller especial'),'Taller especial');});
test('mensajes de autenticación y red se muestran en español sin exponer errores desconocidos',()=>{const {mensajeError}=load('lib/mensaje-error.ts');assert.match(mensajeError(new Error('Invalid login credentials')),/incorrectos/);assert.match(mensajeError(new Error('Failed to fetch')),/conexión/);assert.doesNotMatch(mensajeError(new Error('internal secret')),/secret/);});
