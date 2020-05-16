const currying = (f, len = f.length) => {
  return (function recur(prevArgs) {
    return (...curArgs) => {
      const args = [...prevArgs, ...curArgs];
      return args.length >= len ? f(...args) : recur(args);
    };
  })([]);
};
// const currying = f => {
//   return (a, ...bs) => {
//     bs.length ? f(a, ...bs) : (...bs) => f(a, ...bs);
//   };
// };
const filter = currying(function*(f, iter) {
  for (const i of iter) if (f(i)) yield i;
});
const map = currying(function*(f, iter) {
  for (const i of iter) yield f(i);
});
const take = currying((len, iter) => {
  const res = [];
  for (const i of iter) {
    res.push(i);
    if (res.length == len) break;
  }
  return res;
});
const reduce = currying((f, acc, iter) => {
  if (iter === undefined) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const i of iter) acc = f(acc, i);
  return acc;
});
const go = (ac, ...fs) => reduce((acc, f) => f(acc), ac, fs);
console.log(
  go(
    [0, 1, 2, 3, 4, 5],
    filter(a => a > 2),
    map(a => a + 2),
    take(3),
  ),
);

// console.log(reduce((a, b) => a + b)([0, 1, 2, 3, 4, 5])(undefined));

// const test = reduce((a, b) => a + b, [0, 1, 2, 3, 4, 5]);
// console.log(test());
