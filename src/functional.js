export const log = console.log;
export const curry = f => (a, ..._) =>
  _.length ? f(a, ..._) : (..._) => f(a, ..._);
export const go = (...args) => reduce((a, f) => f(a), args);
export const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);
export const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  for (const a of iter) acc = f(acc, a);
  return acc;
});
export const take = curry((l, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length == l) break;
  }
  return res;
});
export const L = {
  map: curry(function* (f, iter) {
    for (const a of iter) yield f(a);
  }),
  filter: curry(function* (f, iter) {
    for (const a of iter) if (f(a)) yield a;
  }),
  entries: curry(function* () {
    for (const k in obj) yield [k, obj[k]];
  }),
};
const takeAll = take(Infinity);
export const map = curry(pipe(L.map, takeAll));
export const filter = curry(pipe(L.filter, takeAll));
