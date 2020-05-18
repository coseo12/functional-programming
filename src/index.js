// import {  } from './functional.js';
const fn = require('./functional.js');

const product = [0, 1, 2, 3, 4, 5];
const prev = [0, 1, 2, 3, 4, 5];
const next = [1, 2, 3];

const range = fn.currying((start, end) => {
  const res = [];
  while (start < end) res.push(start++);
  return res;
});
const L = {};
L.range = fn.currying(function* (start, end) {
  while (start < end) yield start++;
});

const rangeIter1 = range(0, 10);
const rangeIter2 = L.range(0, 10);

const add = fn.currying((a, b) => a + b);
const odd = (a) => a % 2;
const head = (coll) => coll[Symbol.iterator]().next().value;

console.log(
  fn.go(
    product,
    fn.L.filter((a) => a > 2),
    fn.L.map((a) => a + 2),
    // fn.every((a) => a === 5)
    fn.takeAll
  )
);
console.log(
  fn.go(
    product,
    fn.I.filter((a) => a > 2),
    fn.I.map((a) => a + 3)
    // fn.I.take(3)
  )
);

console.time('immediately');
fn.go(
  range(0, 10000),
  fn.I.map(add(1)),
  fn.I.filter(odd),
  fn.I.map(add(1000)),
  head,
  console.log
);
console.timeEnd('immediately');

console.time('lazy');
fn.go(
  L.range(0, 10000),
  fn.L.map(add(1)),
  fn.L.filter(odd),
  fn.L.map(add(1000)),
  head,
  console.log
);
console.timeEnd('lazy');
