import * as fn from './functional';

const { go, map, filter, take, pipe, reduce, curry, log, L } = fn;

const add = (a, b) => a + b;

// TODO: Lazy testing
export const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};
const LAZY = {
  range: function* (l) {
    let i = -1;
    while (++i < l) {
      yield i;
    }
  },
};
console.time('');
go(range(10000), take(5), reduce(add), log);
console.timeEnd('');

console.time('');
go(LAZY.range(10000), take(5), reduce(add), log);
console.timeEnd('');

// TODO: queryStr, join function

const join = curry((sep = ',', iter) =>
  reduce((a, b) => `${a}${sep}${b}`, iter)
);

const queryStr = obj =>
  pipe(
    obj,
    // Object.entries,
    L.entries,
    // map(([k, v]) => `${k}=${v}`),
    L.map(([k, v]) => `${k}=${v}`),
    a => {
      console.log(a);
      return a;
    },
    // reduce((a, b) => `${a}&${b}`),
    join('&')
  );

log(queryStr({ limit: 10, offset: 10, type: 'notice' }));

const joinTest = function* () {
  yield 10;
  yield 20;
  yield 30;
  yield 40;
  yield 50;
};
log(join('-', joinTest()));

// TODO: take, find function
const users = [
  { age: 20 },
  { age: 21 },
  { age: 22 },
  { age: 23 },
  { age: 24 },
  { age: 25 },
];

const find = curry((f, iter) => go(iter, L.filter(f), take(1), ([a]) => a));

console.log(find(u => u.age < 23)(users));

go(
  users,
  L.map(u => u.age),
  find(n => n < 23),
  log
);

log(map(a => a + 10, LAZY.range(4)));
log(filter(a => a > 2, LAZY.range(4)));
