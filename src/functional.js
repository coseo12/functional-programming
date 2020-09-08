const nop = Symbol('nop');
const reduceF = (acc, a, f) =>
  a instanceof Promise
    ? a.then(
        a => f(acc, a),
        e => (e === nop ? acc : Promise.reject(e))
      )
    : f(acc, a);
const head = iter => go1(take(1, iter), ([h]) => h);
export const log = console.log;
export const curry = f => (a, ..._) =>
  _.length ? f(a, ..._) : (..._) => f(a, ..._);
export const go = (...args) => reduce((a, f) => f(a), args);
export const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
export const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);
export const reduce = curry((f, acc, iter) => {
  if (!iter) return reduce(f, head((iter = acc[Symbol.iterator]())), iter);

  iter = iter[Symbol.iterator]();
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, f);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
});
export const take = curry((l, iter) => {
  const res = [];
  iter = iter[Symbol.iterator]();
  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (a instanceof Promise)
        return a
          .then(a => ((res.push(a), res).length === l ? res : recur()))
          .catch(e => (e === nop ? recur() : Promise.reject(e)));
      res.push(a);
      if (res.length === l) return res;
    }
    return res;
  })();
});
export const join = curry((sep = ',', iter) =>
  reduce((a, b) => `${a}${sep}${b}`, iter)
);
export const isIterable = a => a && a[Symbol.iterator];
export const L = {};
L.map = curry(function* (f, iter) {
  for (const a of iter) yield go1(a, f);
});
L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    const b = go1(a, f);
    if (b instanceof Promise) yield b.then(b => (b ? a : Promise.reject(nop)));
    else if (b) yield a;
  }
});
L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};
L.keys = function* (obj) {
  for (const k in obj) yield k;
};
L.values = function* (obj) {
  for (const k in obj) yield obj[k];
};
L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
};
L.deepFlat = function* f(iter) {
  for (const a of iter)
    if (isIterable(a)) yield* f(a);
    else yield a;
};
L.flatMap = curry(pipe(L.map, L.flatten));
export const C = {};
export const takeAll = take(Infinity);
export const takeOne = take(1);
export const map = curry(pipe(L.map, takeAll));
export const filter = curry(pipe(L.filter, takeAll));
export const find = curry(pipe(L.filter, takeOne, ([a]) => a));
export const flatten = pipe(L.flatten, takeAll);
export const deepFlat = pipe(L.deepFlat, takeAll);
export const flatMap = curry(pipe(L.flatMap, flatten));
