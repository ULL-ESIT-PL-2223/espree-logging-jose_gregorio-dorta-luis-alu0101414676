[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-f4981d0f882b2a3f0472912d15f9806d57e124e0fc890972558857b51b24a6f9.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=10283511)
# Práctica Espree logging

## Resumen de lo aprendido

...

## Indicar los valores de los argumentos

Se ha modificado el código de `logging-espree.js` para que el log también indique los valores de los argumentos que se pasaron a la función. 
Ejemplo:

```javascript
function foo(a, b) {
  var x = 'blah';
  var y = (function (z) {
    return z+3;
  })(2);
}
foo(1, 'wut', 3);
```

```javascript
function foo(a, b) {
    console.log(`Entering foo(${ a }, ${ b })`);
    var x = 'blah';
    var y = function (z) {
        console.log(`Entering <anonymous function>(${ z })`);
        return z + 3;
    }(2);
}
foo(1, 'wut', 3);
```
## Package.json

```js
{
    "name": "@alu0101414676/constant-folding",
    "version": "1.0.0",
    "author": "Jose Gregorio Dorta Luis <alu0101414676@ull.edu.es>",
    "description": "Adds logs to javascript code",
    "type": "module",
    "bin": {
        "funlog": "bin/log.js"
    },
    "scripts": {
        "test": "mocha test/test.mjs",
        "cov": "c8 npm test",
        "docs": "npx c8 --reporter=html --reporter=text --report-dir docs mocha"
    },
    "dependencies": {
        "acorn": "^8.8.2",
        "commander": "^10.0.0",
        "escodegen": "^2.0.0",
        "espree": "^9.4.1",
        "estraverse": "^5.2.0",
        "underscore": "^1.12.0"
    },
    "devDependencies": {
        "mocha": "^10.2.0"
    }
}
```

## CLI con [Commander.js](https://www.npmjs.com/package/commander)

![commander](readme_docs/comandos)
...

## Retos 1 y 2

 - Funciones fichero logging donde se cumplen los retos:

```js
export async function transpile(inputFile, outputFile) {
  let input = await fs.readFile(inputFile, 'utf-8');
  let output = addLogging(input);
  if (outputFile === undefined) {
    console.log(output);
    return;
  }
  await fs.writeFile(outputFile, output);
}
```

```js
export function addLogging(code) {
  var ast = espree.parse(code, {ecmaVersion: 12, loc: true});
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.type === 'FunctionDeclaration' ||
          node.type === 'ArrowFunctionExpression' ||
          node.type === 'FunctionExpression') {
            addBeforeCode(node);
          }
      }
    });
  return escodegen.generate(ast);
}
```

```js
function addBeforeCode(node) {
  const name = node.id ? node.id.name : '<anonymous function>';
  let paramNames = "";
  if (node.params.length) { 
    paramNames = "${" + node.params.map(param => param.name).join("}, ${") + "}";
  }
  const lineN = node.loc.start.line;
  const beforeCode = "console.log(`Entering " + name + "(" + paramNames + ") at line " + lineN + "`);"
  const beforeNodes = espree.parse(beforeCode, { ecmaVersion: 12}).body;
  node.body.body = beforeNodes.concat(node.body.body);
}
```

## Tests and Covering

 - test-description.mjs:
```js
export default [
  {
    input: 'test1.js',
    output: 'logged1.js',
    correctLogged: 'correct-logged1.js',
    correctOut: 'logged-out1.txt'
  },
  {
    input: 'test2.js',
    output: 'logged2.js',
    correctLogged: 'correct-logged2.js',
    correctOut: 'logged-out2.txt'
  },
  {
    input: 'test3.js',
    output: 'logged3.js',
    correctLogged: 'correct-logged3.js',
    correctOut: 'logged-out3.txt'
  },
  {
    input: 'test4.js',
    output: 'logged4.js',
    correctLogged: 'correct-logged4.js',
    correctOut: 'logged-out4.txt'
  },
  {
    input: 'test5.js',
    output: 'logged5.js',
    correctLogged: 'correct-logged5.js',
    correctOut: 'logged-out5.txt'
  },
  {
    input: 'test6.js',
    output: 'logged6.js',
    correctLogged: 'correct-logged6.js',
    correctOut: 'logged-out6.txt'
  },
]
```
 - test.mjs
```js
import { transpile } from "../src/logging-espree.js";
import assert from 'assert';
import * as fs from "fs/promises";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
import Tst from './test-description.mjs';

const Test = Tst.map(t => ({
  input: __dirname + '/data/' + t.input,
  output: __dirname + '/data/' + t.output,
  correctLogged: __dirname + '/data/' + t.correctLogged,
  correctOut: __dirname + '/data/' + t.correctOut,
})
)

function removeSpaces(s) {
  return s.replace(/\s/g, '');
}

for (let i = 0; i < Test.length; i++) {
  it(`transpile(${Tst[i].input}, ${Tst[i].output})`, async () => {
    // Compile the input and check the output program is what expected
    await transpile(Test[i].input, Test[i].output); 
    let output = await fs.readFile(Test[i].output, 'utf-8') 
    let correctLogged = await fs.readFile(Test[i].correctLogged, 'utf-8') 
    assert.equal(removeSpaces(output), removeSpaces(correctLogged)); 
    await fs.unlink(Test[i].output);

    // Run the output program and check the logged output is what expected
    let correctOut = await fs.readFile(Test[i].correctOut, 'utf-8') 
    let oldLog = console.log;
    let result = ""; 
    console.log = function (...s) { result += s.join('') } 
      eval(output); 
      assert.equal(removeSpaces(result), removeSpaces(correctOut)) 
    console.log = oldLog;
  });  
}
```
 - Covering:
![commander](readme_docs/cov)

## Publicación del paquete en npmjs
![paquete_publicado](readme_docs/paquete)