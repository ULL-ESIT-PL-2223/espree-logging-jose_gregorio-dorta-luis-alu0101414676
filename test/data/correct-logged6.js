function daBuenosDias(a) {
    console.log(`Entering daBuenosDias(${ a }) at line 1`);
    a = 'Buenos dias';
}
const funcionCool = function (numero1, numero2) {
    console.log(`Entering <anonymous function>(${ numero1 }, ${ numero2 }) at line 5`);
    let variable = numero1 * numero2;
    let cadena;
    daBuenosDias(cadena);
    ++variable;
};
funcionCool(10, 10);