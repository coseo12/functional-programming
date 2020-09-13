export const log = console.log;
export const _ = {};

_.curry = f => (a, ...arg) =>
  arg.length ? f(a, ...arg) : (...arg) => f(a, ...arg);
_.go = (...args) => _.reduce((a, f) => f(a), args);
_.go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
_.pipe = (f, ...fs) => (...as) => _.go(f(...as), ...fs);
const nop = Symbol('nop');
const reduceF = (acc, a, f) =>
  a instanceof Promise
    ? a.then(
        a => f(acc, a),
        e => (e === nop ? acc : Promise.reject(e))
      )
    : f(acc, a);
const head = iter => _.go1(_.take(1, iter), ([h]) => h);
_.reduce = _.curry((f, acc, iter) => {
  if (!iter) return _.reduce(f, head((iter = acc[Symbol.iterator]())), iter);
  iter = iter[Symbol.iterator]();
  return _.go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, f);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
});
_.take = _.curry((l, iter) => {
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
_.join = _.curry((sep = ',', iter) =>
  _.reduce((a, b) => `${a}${sep}${b}`, iter)
);
_.range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};

export const L = {};
L.map = _.curry(function* (f, iter) {
  for (const a of iter) yield _.go1(a, f);
});
L.filter = _.curry(function* (f, iter) {
  for (const a of iter) {
    const b = _.go1(a, f);
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

const isIterable = a => a && a[Symbol.iterator];

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
L.flatMap = _.curry(_.pipe(L.map, L.flatten));
L.range = function* (l) {
  let i = -1;
  while (++i < l) {
    yield i;
  }
};

export const C = {};
const noop = () => {};
const catchNoop = arr => {
  arr.forEach(a => (a instanceof Promise ? a.catch(noop) : a));
  return arr;
};

C.reduce = _.curry((f, acc, iter) =>
  iter
    ? _.reduce(f, acc, catchNoop([...iter]))
    : _.reduce(f, catchNoop([...acc]))
);
C.take = _.curry((l, iter) => _.take(l, catchNoop([...iter])));
C.takeAll = C.take(Infinity);
C.map = _.curry(_.pipe(L.map, C.takeAll));
C.filter = _.curry(_.pipe(L.filter, C.takeAll));

_.takeAll = _.take(Infinity);
_.takeOne = _.take(1);
_.map = _.curry(_.pipe(L.map, _.takeAll));
_.filter = _.curry(_.pipe(L.filter, _.takeAll));
_.find = _.curry(_.pipe(L.filter, _.takeOne, ([a]) => a));
_.flatten = _.pipe(L.flatten, _.takeAll);
_.deepFlat = _.pipe(L.deepFlat, _.takeAll);
_.flatMap = _.curry(_.pipe(L.flatMap, _.flatten));
_.each = _.curry((f, iter) => {
  for (const a of iter) f(a);
});
_.object = entries =>
  _.reduce((obj, [k, v]) => ((obj[k] = v), obj), {}, entries);
_.mapObject = (f, obj) =>
  _.go(
    obj,
    L.entries,
    L.map(([k, v]) => [k, f(v)]),
    _.object
  );
_.pick = (ks, obj) =>
  _.go(
    ks,
    _.map(k => [k, obj[k]]),
    _.filter(([k, v]) => v !== undefined),
    _.object
  );
_.indexBy = (f, iter) => _.reduce((obj, a) => ((obj[f(a)] = a), obj), {}, iter);
