export const log = console.log;
export const curry = f => (a, ..._) =>
  _.length ? f(a, ..._) : (..._) => f(a, ..._);
export const go = (...args) => reduce((a, f) => f(a), args);
export const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

export const map = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(f(a));
  }
  return res;
});
export const filter = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    if (f(a)) res.push(a);
  }
  return res;
});
export const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    acc = f(acc, a);
  }
  return acc;
});

export const L = {
  map: curry(function* (f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      yield f(a);
    }
  }),
  filter: curry(function* (f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (f(a)) {
        yield a;
      }
    }
  }),
  entries: curry(function* () {
    for (const k in obj) yield [k, obj[k]];
  }),
};
