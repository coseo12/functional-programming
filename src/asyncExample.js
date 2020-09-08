import {
  go,
  map,
  filter,
  take,
  find,
  flatten,
  deepFlat,
  flatMap,
  join,
  pipe,
  reduce,
  curry,
  log,
  L,
} from './functional';

export const asyncExample = () => {
  // TODO: callback, promise
  //? callback
  const add10 = (a, callback) => {
    setTimeout(() => callback(a + 10), 100);
  };
  // add10(5, res => {
  //   add10(res, res => {
  //     add10(res, res => {
  //       log('callback: ', res);
  //     });
  //   });
  // });

  //? promise
  const add20 = a =>
    new Promise(resolve => setTimeout(() => resolve(a + 20), 100));
  // add20(5)
  //   .then(add20)
  //   .then(add20)
  //   .then(res => log('promise: ', res));

  // TODO: Promise used
  const delay100 = a =>
    new Promise(resolve => setTimeout(() => resolve(a), 100));

  const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
  const add5 = a => a + 5;

  // const r1 = go(10, add5);
  // log(r1);
  // const r2 = go1(delay100(5), add5);
  // r2.then(log);

  // TODO: Promise of aspect in synthesis and Monad
  //! f . g
  //! f(g(x))

  // const g = a => a + 1;
  // const f = a => a * a;
  // log(f(g(1)));
  // log(f(g()));

  // Array.of(1)
  //   .map(g)
  //   .map(f)
  //   .forEach(r => log(r));

  // Promise.resolve(1)
  //   .then(g)
  //   .then(f)
  //   .then(r => log(r));

  // TODO: Promise of aspect in Kleisli Composition
  //! f . g
  //! f(g(x)) = f(g(x))
  //! f(g(x)) = g(x)

  var users = [
    { id: 1, name: 'aa' },
    { id: 2, name: 'bb' },
    { id: 3, name: 'cc' },
  ];

  const getUserById = id =>
    find(u => u.id === id, users) || Promise.reject('Error!');

  const f = ({ name }) => name;
  const g = getUserById;

  const fg = id => Promise.resolve(id).then(g).then(f);

  // fg(2).then(log);

  // users.pop();
  // users.pop();

  // fg(2).then(log).catch(log);
  // g(2).then(log).catch(log);

  // const fg = id => f(g(id));
  // const r = fg(2);
  // log(r);
  // users.pop();
  // users.pop();
  // const r2 = fg(2);
  // log(r2);

  // TODO: Async constrol at go or pipe or reduce
  // go(
  //   Promise.resolve(1),
  //   a => a + 10,
  //   a => Promise.resolve(a + 100),
  //   a => a + 1000,
  //   log
  // );

  // go(
  //   Promise.reject('error'),
  //   a => a + 10,
  //   a => Promise.resolve(a + 100),
  //   a => a + 1000,
  //   log
  // ).catch(log);

  // TODO: Rule of promise.then
  // Promise.resolve(Promise.resolve(Promise.resolve(1))).then(log);
  // new Promise(resolve => resolve(new Promise(resolve => resolve(1)))).then(log);

  // TODO: Lazy + Promise - L.map, map, take
  // go(
  //   [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
  //   L.map(a => Promise.resolve(a + 10)),
  //   take(2),
  //   log
  // );

  // go(
  //   [1, 2, 3],
  //   L.map(a => Promise.resolve(a + 10)),
  //   take(2),
  //   log
  // );

  // go(
  //   [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
  //   L.map(a => a + 10),
  //   take(2),
  //   log
  // );

  // TODO: Kleisli Composition = L.filter, filter, nop, take
  // go(
  //   [1, 2, 3, 4, 5, 6],
  //   L.map(a => Promise.resolve(a * a)),
  //   L.filter(a => a % 2),
  //   take(3),
  //   log
  // );

  // go(
  //   [1, 2, 3, 4, 5, 6],
  //   L.map(a => Promise.resolve(a * a)),
  //   L.filter(a => Promise.resolve(a % 2)),
  //   take(3),
  //   log
  // );

  // go(
  //   [1, 2, 3, 4, 5, 6],
  //   L.map(a => a * a),
  //   L.filter(a => Promise.resolve(a % 2)),
  //   take(3),
  //   log
  // );

  // TODO: Support in nop of reduce

  // TODO: Lazy + Promise of efficiency

  // TODO: Evaluating to parallel on lazy function [1] C.reduce, C.take

  // TODO: Evaluating to parallel on lazy function [2] C.reduce, C.take

  // TODO: Evaluating to parallel on immediately

  // TODO: Immediately, Lazy, Promise, Combine to parallel

  // TODO: Simplify code

  // TODO: Get efficiency on evaluating to parallel for SQL in Node.js
};
