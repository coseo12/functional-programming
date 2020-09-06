import * as fn from './functional';

const {
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
} = fn;

const add = (a, b) => a + b;

export const lazeExample = () => {
  // TODO: Lazy testing
  const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
      res.push(i);
    }
    return res;
  };
  const LAZY = {
    range: function* (l) {
      let i = -1;
      while (++i < l) {
        yield i;
      }
    },
  };
  console.time('Immediately');
  go(range(10000), take(5), reduce(add), log);
  console.timeEnd('Immediately');

  console.time('Lazy');
  go(LAZY.range(10000), take(5), reduce(add), log);
  console.timeEnd('Lazy');

  // TODO: queryStr, join function

  const queryStr = pipe(
    L.entries,
    L.map(([k, v]) => `${k}=${v}`),
    join('&')
  );

  log('queryStr: ', queryStr({ limit: 10, offset: 10, type: 'notice' }));

  // TODO: take, find function
  const users = [
    { age: 20 },
    { age: 21 },
    { age: 22 },
    { age: 23 },
    { age: 24 },
    { age: 25 },
  ];
  const user = { name: 'seo', age: 35 };

  console.time('I find');
  log(
    'I find: ',
    users.find(u => u.age > 20)
  );
  console.timeEnd('I find');
  console.time('L find');
  log(
    'L find: ',
    find(u => u.age > 20, users)
  );
  console.timeEnd('L find');

  // go(
  //   users,
  //   L.map(u => u.age),
  //   find(n => n < 23),
  //   log
  // );

  log(
    'map: ',
    map(a => a + 10, LAZY.range(4))
  );
  log(
    'filter: ',
    filter(a => a > 2, LAZY.range(4))
  );

  // TODO: flatten, L.flatten, deepFlat, L.deepFlat function
  const fArr = [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8, 9],
  ];
  const fArrD = [1, [2, [3, 4], [[5]]]];
  const it = L.flatten(fArr);
  // log(it.next());
  // log(it.next());
  // log([...it]);
  log(take(3, L.flatten(fArr)));
  log(flatten(fArr));
  // log([...L.deepFlat(fArrD)]);

  // TODO: flatMap, L.flatMap function

  const itLFM = L.flatMap(
    map(a => a * a),
    fArr
  );
  // const itFM = flatMap(
  //   map(a => a * a),
  //   fArr
  // );

  log('L flatMap: ', [...itLFM]);
  // log(itFM);

  // TODO: 2D Array control
  const arr1 = [
    [1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10],
  ];

  go(
    arr1,
    L.flatten,
    L.filter(a => a % 2),
    take(3),
    log
  );

  // TODO: 실무적 이터러블 코드
  const items = [
    {
      name: 'a',
      age: 21,
      family: [
        { name: 'a1', age: 53 },
        { name: 'a2', age: 47 },
        { name: 'a3', age: 16 },
        { name: 'a4', age: 15 },
      ],
    },
    {
      name: 'b',
      age: 24,
      family: [
        { name: 'b1', age: 58 },
        { name: 'b2', age: 51 },
        { name: 'b3', age: 19 },
        { name: 'b4', age: 22 },
      ],
    },
    {
      name: 'c',
      age: 31,
      family: [
        { name: 'c1', age: 64 },
        { name: 'c2', age: 62 },
      ],
    },
    {
      name: 'd',
      age: 20,
      family: [
        { name: 'd1', age: 42 },
        { name: 'd2', age: 42 },
        { name: 'd3', age: 11 },
        { name: 'd4', age: 7 },
      ],
    },
  ];

  go(
    items,
    // L.map(u => u.family),
    // L.flatten,
    L.flatMap(u => u.family),
    L.filter(u => u.age < 20),
    L.map(u => u.age),
    take(3),
    reduce((a, b) => a + b),
    log
  );
};
