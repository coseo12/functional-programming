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
  C,
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
  // go(
  //   [1, 2, 3, 4, 5],
  //   L.map(a => Promise.resolve(a * a)),
  //   L.filter(a => Promise.resolve(a % 2)),
  //   reduce((a, b) => a + b),
  //   log
  // );

  // TODO: Lazy + Promise of efficiency
  // go(
  //   [1, 2, 3, 4, 5, 6, 7, 8],
  //   L.map(a => {
  //     log('map', a);
  //     return new Promise(resolve =>
  //       setTimeout(() => {
  //         resolve(a * a);
  //       }, 1000)
  //     );
  //   }),
  //   L.filter(a => {
  //     log('filter', a);
  //     return new Promise(resolve =>
  //       setTimeout(() => {
  //         resolve(a % 2);
  //       }, 1000)
  //     );
  //   }),
  //   take(2),
  //   log
  // );

  // TODO: Evaluating to parallel on lazy function : C.reduce, C.take
  const delay1000 = a =>
    new Promise(resolve => {
      setTimeout(() => resolve(a), 1000);
    });

  // console.time('reduce');
  // go(
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   L.map(a => delay1000(a * a)),
  //   L.filter(a => a % 2),
  //   reduce((a, b) => a + b),
  //   log,
  //   _ => console.timeEnd('reduce')
  // );

  // console.time('C.reduce');
  // go(
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   L.map(a => delay1000(a * a)),
  //   L.filter(a => delay1000(a % 2)),
  //   // C.take(2),
  //   // reduce((a, b) => a + b),
  //   C.reduce((a, b) => a + b),
  //   log,
  //   _ => console.timeEnd('C.reduce')
  // );

  // TODO: Evaluating to parallel on immediately : C.map, C.filter

  // map(a => delay1000(a * a), [1, 2, 3, 4, 5]).then(log);
  // C.map(a => delay1000(a * a), [1, 2, 3, 4, 5]).then(log);
  // filter(a => delay1000(a % 2), [1, 2, 3, 4, 5]).then(log);
  // C.filter(a => delay1000(a % 2), [1, 2, 3, 4, 5]).then(log);

  // TODO: Immediately, Lazy, Promise, Combine to parallel
  const delay500 = (a, name) =>
    new Promise(resolve => {
      console.log(`${name}: ${a}`);
      setTimeout(() => resolve(a), 500);
    });

  // console.time('');
  // go(
  //   [1, 2, 3, 4, 5, 6, 7, 8],
  //   map(a => delay500(a * a, 'map1')),
  //   filter(a => delay500(a % 2, 'filter2')),
  //   map(a => delay500(a + 1, 'map3')),
  //   take(2),
  //   log,
  //   _ => console.timeEnd('')
  // );

  // console.time('');
  // go(
  //   [1, 2, 3, 4, 5, 6, 7, 8],
  //   L.map(a => delay500(a * a, 'map1')),
  //   L.filter(a => delay500(a % 2, 'filter2')),
  //   L.map(a => delay500(a + 1, 'map3')),
  //   take(2),
  //   log,
  //   _ => console.timeEnd('')
  // );

  // console.time('');
  // go(
  //   [1, 2, 3, 4, 5, 6, 7, 8],
  //   L.map(a => delay500(a * a, 'map1')),
  //   L.filter(a => delay500(a % 2, 'filter2')),
  //   L.map(a => delay500(a + 1, 'map3')),
  //   // take(2),
  //   C.reduce((a, b) => a + b),
  //   log,
  //   _ => console.timeEnd('')
  // );

  //? Simplify code
  //? Get efficiency on evaluating to parallel for SQL in Node.js
  // TODO: Async, Await
  const delay = a => new Promise(resolve => setTimeout(() => resolve(a), 500));

  // const f1 = async () => {
  //   const a = await delay(10);
  //   const b = await delay(20);
  //   log(a + b);
  // };
  // f1();

  //* QnA. Array.prototype.map 이 있는데 왜 FxJS 의 map 함수가 필요한가?
  const delayI = a => new Promise(resolve => setTimeout(() => resolve(a), 1));

  const f2 = async () => {
    const list = [1, 2, 3, 4];
    const res = await list.map(a => delayI(a * a));
    log(res);
  };
  // f2();

  const f3 = async () => {
    const list = [1, 2, 3, 4];
    const res = await map(a => delayI(a * a), list);
    log(res);
  };
  // f3();

  //* QnA. 이제 비동기는 async, await으로 제어할 수 있는데 왜 파이프라인이 필요한가?
  const list = [1, 2, 3, 4, 5, 6, 7, 8];

  const f5 = list =>
    go(
      list,
      L.map(a => delayI(a * a)),
      L.filter(a => delayI(a % 2)),
      L.map(a => delayI(a + 1)),
      take(3),
      reduce((a, b) => delayI(a + b))
    );

  // log(f5(list));
  // go(f5(list), log);

  const f6 = async list => {
    const tmp = [];
    for (const a of list) {
      const b = await delayI(a * a);
      if (await delayI(b % 2)) {
        const c = await delayI(b + 1);
        tmp.push(c);
        if (tmp.length === 3) break;
      }
    }
    let res = 0;
    for (const d of tmp) {
      res = await delayI(res + d);
    }
    return res;
  };

  // log(f6(list));
  // go(f6(list), log);

  //* QnA. async, await 와 파이프라인을 같이 사용하기도 하는가?

  const f52 = async list => {
    const r1 = await go(
      list,
      L.map(a => delayI(a * a)),
      L.filter(a => delayI(a % 2)),
      L.map(a => delayI(a + 1)),
      take(3),
      reduce((a, b) => delayI(a + b))
    );
    const r2 = await await go(
      list,
      L.map(a => delayI(a * a)),
      L.filter(a => delayI(a % 2)),
      L.map(a => delayI(a + 1)),
      take(3),
      reduce((a, b) => delayI(a + b))
    );

    const r3 = await delayI(r1 + r2);
    return r3 + 10;
  };

  // go(f52(list), log);

  //* QnA. 동기 상황에서 에러 핸들링은 어떻게 해야 하는가?
  const f7 = list => {
    try {
      return list
        .map(a => a + 10)
        .filter(a => a % 2)
        .slice(0, 2);
    } catch (error) {
      return [];
    }
  };

  // log(f7(null));

  //* QnA. 비동기 상황에서 에러 핸들링은 어떻게 해야 하는가?
  const f8 = list => {
    try {
      return list
        .map(a => new Promise(resolve => resolve(JSON.parse(a))))
        .filter(a => a % 2)
        .slice(0, 2);
    } catch (error) {
      return [];
    }
  };

  // log(f8(['1', '2', '3', '4', '{']));
  //* QnA. 동기 / 비동기 에러 핸들링에서의 파이프라인의 이점은?
  const f9 = async list => {
    try {
      return await go(
        list,
        map(a => new Promise(resolve => resolve(JSON.parse(a)))),
        filter(a => a % 2),
        take(2)
      );
    } catch (error) {
      console.log('---');
      return [];
    }
  };
  f9(['1', '2', '{']).then(log);
  // .catch(e => log('???'));
  // log(f9(['1', '2', '3', '4', '{']));
};
