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
  const res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length == l) break;
  }
  return res;
});
export const join = curry((sep = ',', iter) =>
  reduce((a, b) => `${a}${sep}${b}`, iter)
);
export const L = {
  map: curry(function* (f, iter) {
    for (const a of iter) yield f(a);
  }),
  filter: curry(function* (f, iter) {
    for (const a of iter) if (f(a)) yield a;
  }),
  find: curry(function* (f, iter) {}),
  entries: function* (obj) {
    for (const k in obj) yield [k, obj[k]];
  },
  keys: function* (obj) {
    for (const k in obj) yield k;
  },
  values: function* (obj) {
    for (const v of obj) yield v;
  },
};
export const takeAll = take(Infinity);
export const takeOne = take(1);
export const map = curry(pipe(L.map, takeAll));
export const filter = curry(pipe(L.filter, takeAll));
export const find = curry(pipe(L.filter, takeOne, ([a]) => a));
export const some = curry(
  pipe(L.filter, takeOne, a => (a.length > 0 ? true : false))
);
export const every = curry(
  pipe(
    L.map,
    L.filter(a => !a),
    takeOne,
    a => (a.length > 0 ? false : true)
  )
);
