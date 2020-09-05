import * as fn from './functional';

const { go, map, filter, pipe, reduce, curry, log, L } = fn;

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
export const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(a);
    if (res.length == l) return res;
  }
  return res;
});
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

// TODO:
