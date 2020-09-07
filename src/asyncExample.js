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

  const r1 = go(10, add5);
  // log(r1);
  const r2 = go1(delay100(5), add5);
  // r2.then(log);

  // TODO: Promise of aspect in synthesis and Monad
  const g = a => a + 1;
  const f = a => a * a;
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

  // TODO: Async constrol at go or pipe or reduce

  // TODO: Rule of promise.then
};
