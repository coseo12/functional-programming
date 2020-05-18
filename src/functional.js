//* currying function
const currying = (f, len = f.length) => {
  return (function recur(prevArgs) {
    return (...curArgs) => {
      const args = [...prevArgs, ...curArgs];
      return args.length >= len ? f(...args) : recur(args);
    };
  })([]);
};
//* reduce function
const reduce = currying((f, acc, iter) => {
  if (iter === undefined) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const i of iter) acc = f(acc, i);
  return acc;
});
//* pipe function
const pipe = (f1, ...fs) => (...iter) =>
  reduce((acc, f) => f(acc), f1(...iter), fs);
//* go function
const go = (iter, ...fs) => pipe(...fs)(iter);
// const go = (ac, ...fs) => reduce((acc, f) => f(acc), ac, fs);
//* compose function
const compose = (...fns) => (args) =>
  fns.reduceRight((arg, fn) => fn(arg), args);
const _push = (val, arr = []) => (arr.push(val), arr);

//* take function
const take = currying((len, iter) => {
  const res = [];
  for (const i of iter) {
    res.push(i);
    if (res.length == len) break;
  }
  return res;
});
//* takeAll function
const takeAll = take(Infinity);
//* head function
const head = pipe(take(1), ([v]) => v);
//* find function
const find = currying((f, coll) => go(coll, L.filter(f), head));
//* any function
const any = currying((f, coll) =>
  go(coll, find(f)) === undefined ? false : true
);
//* none function
const none = currying((f, coll) =>
  go(coll, find(f)) === undefined ? true : false
);
//* every function
const every = currying((f, coll) =>
  go(
    coll,
    L.map(f),
    find((a) => a === false)
  ) === undefined
    ? true
    : false
);
//* Immediately functional javascript
const I = {
  //* map function
  map: currying((f, iter) =>
    reduce((acc, cur) => _push(f(cur), acc), [], iter)
  ),
  //* filter function
  filter: currying((f, iter) =>
    reduce((acc, cur) => (f(cur) ? _push(cur, acc) : acc), [], iter)
  ),
};
//* Lazy functional javascript
const L = {
  filter: currying(function* (f, iter) {
    for (const i of iter) if (f(i)) yield i;
  }),
  map: currying(function* (f, iter) {
    for (const i of iter) yield f(i);
  }),
};

module.exports = {
  currying,
  take,
  takeAll,
  find,
  any,
  none,
  every,
  reduce,
  compose,
  pipe,
  go,
  I,
  L,
};
