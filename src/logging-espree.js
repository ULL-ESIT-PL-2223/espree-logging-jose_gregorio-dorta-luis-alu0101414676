import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

/**
 * función que se encarga de la transpilación
 * @param {*} inputFile fichero de entrada donde se va a extraer el código
 * @param {*} outputFile fichero donde se imprimirá el código resultante
 * @returns 
 */
export async function transpile(inputFile, outputFile) {
  let input = await fs.readFile(inputFile, 'utf-8');
  let output = addLogging(input);
  if (outputFile === undefined) {
    console.log(output);
    return;
  }
  await fs.writeFile(outputFile, output);
}

/**
 * función que se encarga ingresar en el arbol generado, recorrer sus nodo y 
 * detenerce en aquellos que hacen referencia a funciones, funciones flecha ó
 * expresiones de funciones
 * @param {*} code 
 * @returns 
 */
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

/**
 * función que se encarga de insertar el console log al inicio de cada función
 * @param {*} node nodo del árbol
 */
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