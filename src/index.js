// import {  } from './functional.js';
const fn = require('./functional.js');

const product = [0, 1, 2, 3, 4, 5];

console.log(
  fn.go(
    product,
    fn.L.filter((a) => a > 2),
    fn.L.map((a) => a + 2),
    fn.L.take(2)
  )
);
console.log(
  fn.go(
    product,
    (product) => fn.I.filter((a) => a > 2, product),
    (filterItems) => fn.I.map((a) => a + 3, filterItems)
    // fn.I.take(3)
  )
);
