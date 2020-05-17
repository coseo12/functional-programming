//* currying function
const currying = (f, len = f.length) => {
  return (function recur(prevArgs) {
    return (...curArgs) => {
      const args = [...prevArgs, ...curArgs];
      return args.length >= len ? f(...args) : recur(args);
    };
  })([]);
};
//* pipe function
const pipe = (f1, ...fs) => (...iter) =>
  L.reduce((acc, f) => f(acc), f1(...iter), fs);
//* go function
const go = (iter, ...fs) => pipe(...fs)(iter);
// const go = (ac, ...fs) => reduce((acc, f) => f(acc), ac, fs);

//* compose function
const compose = (...fns) => (args) =>
  fns.reduceRight((arg, fn) => fn(arg), args);
const _push = (val, arr = []) => (arr.push(val), arr);

//* Immediately functional javascript
const I = {
  //* map function
  // map(fn, iter) {
  //   const res = [];
  //   for (const item of iter) {
  //     res.push(fn(item));
  //   }
  //   return res;
  // },
  map: currying((f, iter) =>
    L.reduce((acc, cur) => _push(f(cur), acc), [], iter)
  ),
  //* filter function
  // filter(fn, iter) {
  //   const res = [];
  //   for (const item of iter) fn(item) && res.push(item);
  //   return res;
  // },
  filter: currying((f, iter) =>
    L.reduce((acc, cur) => (f(cur) ? _push(cur, acc) : acc), [], iter)
  ),
  //* reduce function
  reduce(fn, acc, coll) {
    if (coll === undefined) {
      coll = acc[Symbol.iterator]();
      acc = coll.next().value;
    }
    for (const item of coll) acc = fn(acc, item);
    return acc;
  },
};
//* Lazy functional javascript
const L = {
  filter: currying(function* (f, iter) {
    for (const i of iter) if (f(i)) yield i;
  }),
  map: currying(function* (f, iter) {
    for (const i of iter) yield f(i);
  }),
  take: currying((len, iter) => {
    const res = [];
    for (const i of iter) {
      res.push(i);
      if (res.length == len) break;
    }
    return res;
  }),
  reduce: currying((f, acc, iter) => {
    if (iter === undefined) {
      iter = acc[Symbol.iterator]();
      acc = iter.next().value;
    }
    for (const i of iter) acc = f(acc, i);
    return acc;
  }),
};

module.exports = { currying, compose, pipe, go, I, L };
