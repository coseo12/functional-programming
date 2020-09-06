import * as fn from './functional';

const { go, map, filter, take, find, join, pipe, reduce, curry, log, L } = fn;

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
console.time('Immediately');
go(range(10000), take(5), reduce(add), log);
console.timeEnd('Immediately');

console.time('Lazy');
go(LAZY.range(10000), take(5), reduce(add), log);
console.timeEnd('Lazy');

// TODO: queryStr, join function

const queryStr = pipe(
  L.entries,
  L.map(([k, v]) => `${k}=${v}`),
  join('&')
);

log('queryStr: ', queryStr({ limit: 10, offset: 10, type: 'notice' }));

// TODO: take, find function
const users = [
  { age: 20 },
  { age: 21 },
  { age: 22 },
  { age: 23 },
  { age: 24 },
  { age: 25 },
];

console.time('I find');
log(
  'I find: ',
  users.find(u => u.age > 20)
);
console.timeEnd('I find');
console.time('L find');
log(
  'L find: ',
  find(u => u.age > 20, users)
);
console.timeEnd('L find');

go(
  users,
  L.map(u => u.age),
  find(n => n < 23),
  log
);

log(
  'map: ',
  map(a => a + 10, LAZY.range(4))
);
log(
  'filter: ',
  filter(a => a > 2, LAZY.range(4))
);
