import { log } from './functional';
import * as _ from 'fxjs';
import * as L from 'fxjs/Lazy';
import * as C from 'fxjs/Concurrency';

export const etcExample = () => {
  // TODO: Pick, indexBy function
  const obj = { a: 1, b: 3, c: 2 };

  // log(_.pick(['a', 'b'], obj));

  const users1 = [
    { id: 5, name: 'aa', age: 35 },
    { id: 10, name: 'bb', age: 21 },
    { id: 15, name: 'cc', age: 24 },
    { id: 20, name: 'dd', age: 54 },
  ];

  // const users2 = _.indexBy(u => u.id, users1);

  // _.go(
  //   users2,
  //   L.entries,
  //   L.filter(([_, { age }]) => age > 30),
  //   _.take(2),
  //   _.object,
  //   log
  // );

  // TODO: Map, Set
  let m = new Map();
  m.set('a', 1);
  m.set('b', 2);
  m.set('c', 3);

  //   _.go(
  //     m,
  //     L.filter(([k, v]) => v % 2),
  //     _.takeAll,
  //     entries => new Map(entries),
  //     log
  //   );

  let s = new Set();
  s.add(10);
  s.add(20);
  s.add(30);
  const add = (a, b) => a + b;

  // log(_.reduce(add, s));

  // TODO: Model, Collection
  class Model {
    constructor(attrs = {}) {
      this._attrs = attrs;
    }
    get(k) {
      return this._attrs[k];
    }
    set(k, v) {
      this._attrs[k] = v;
      return this;
    }
  }
  class Collection {
    constructor(models = []) {
      this._models = models;
    }
    at(idx) {
      return this._models[idx];
    }
    add(model) {
      this._models.push(model);
      return this;
    }
    *[Symbol.iterator]() {
      yield* this._models;
    }
    // [Symbol.iterator]() {
    //   return this._models[Symbol.iterator]();
    // }
  }

  const coll = new Collection();
  coll.add(new Model({ id: 1, name: 'aa' }));
  coll.add(new Model({ id: 2, name: 'bb' }));
  coll.add(new Model({ id: 3, name: 'cc' }));
  coll.add(new Model({ id: 4, name: 'dd' }));

  // log(coll.at(1).get('name'));

  const LAZY = {
    range: function* (l) {
      let i = -1;
      while (++i < l) {
        yield i;
      }
    },
  };
  //   _.go(
  //     LAZY.range(3),
  //     L.map(i => coll.at(i)),
  //     L.map(m => m.get('name')),
  //     _.takeAll,
  //     log
  //   );

  //   _.go(
  //     coll,
  //     L.map(m => m.get('name')),
  //     _.take(3),
  //     log
  //   );

  // TODO: Product, Products
  class Product extends Model {}
  class Products extends Collection {
    totalPrice() {
      return _.go(
        this,
        L.map(p => p.get('price')),
        _.reduce((a, b) => a + b)
      );

      // let total = 0;
      // this._models.forEach(product => {
      //   total += product.get('price');
      // });
      // return total;
    }
  }
  // const products = new Products();
  // products.add(new Product({ id: 1, price: 10000 }));
  // log(products.totalPrice());
  // products.add(new Product({ id: 2, price: 25000 }));
  // log(products.totalPrice());
  // products.add(new Product({ id: 3, price: 35000 }));
  // log(products.totalPrice());

  // TODO: range, take function
  // _.go(_.range(10), _.take(3), _.each(log));

  // _.go(
  //   L.range(10),
  //   L.map(a => _.delay(500 * a, a)),
  //   L.filter(a => a % 2),
  //   L.map(_ => new Date()),
  //   _.take(3),
  //   _.each(log)
  // );

  // TODO: takeWhile, takeUntil
  // _.go(
  //   [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
  //   _.takeWhile(a => a),
  //   _.each(log)
  // );

  // _.go(
  //   [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
  //   _.takeUntil(a => a),
  //   _.each(log)
  // );

  // _.go(
  //   [0, false, undefined, null, 10, 20, 30],
  //   _.takeUntil(a => a),
  //   _.each(log)
  // );

  // TODO: cars racing
  const track = [
    { cars: ['철수', '영희', '철희', '영수'] },
    { cars: ['하든', '커리', '듀란트', '탐슨'] },
    { cars: ['폴', '어빙', '릴라드', '맥컬럼'] },
    { cars: ['스파이더맨', '아이언맨'] },
    { cars: [] },
  ];

  // _.go(
  //   L.range(Infinity),
  //   L.map(i => track[i]),
  //   L.map(({ cars }) => cars),
  //   L.map(_.delay(1000)),
  //   L.takeWhile(({ length: l }) => l === 4),
  //   // L.takeUntil(({ length: l }) => l < 4),
  //   L.flat,
  //   L.map(car => `${car} go!!`),
  //   _.each(log)
  // );

  // TODO: Impt
  const Impt = {
    payments: {
      1: [
        { imp_id: 11, order_id: 1, amount: 15000 },
        { imp_id: 12, order_id: 2, amount: 25000 },
        { imp_id: 13, order_id: 3, amount: 10000 },
      ],
      2: [
        { imp_id: 14, order_id: 4, amount: 25000 },
        { imp_id: 15, order_id: 5, amount: 45000 },
        { imp_id: 16, order_id: 6, amount: 15000 },
      ],
      3: [
        { imp_id: 17, order_id: 7, amount: 20000 },
        { imp_id: 18, order_id: 8, amount: 30000 },
      ],
      4: [],
      5: [],
    },
    getPayments: page => {
      log(`https://...?page=${page}`);
      return _.delay(1000 * 1, Impt.payments[page]);
    },
    cancelPayment: imp_id => Promise.resolve(`${imp_id}: 취소완료!`),
  };

  const DB = {
    getOrders: ids => _.delay(100, [{ id: 1 }, { id: 3 }, { id: 7 }]),
  };

  const job = async () => {
    //* 결제된 결제모듈측 payments 가져온다.
    //* page 단위로 가져와서,
    //* 결제 데이터가 있을 때까지 모두 가져와서 하나로 합친다.
    // const payments = await _.go(
    //   L.range(1, Infinity),
    //   L.map(Impt.getPayments),
    //   L.takeUntil(({ length }) => length < 3),
    //   _.flat
    // );
    //* 결재가 실제로 완료된 가맹점 측 주문서 아이디를 가져온다.
    // const order_ids = await _.go(
    //   payments,
    //   _.map(p => p.order_id),
    //   DB.getOrders,
    //   _.map(({ id }) => id)
    // );
    //* 결제모듈의 payments와 가맹점의 주문서를 비교해서
    //* 결제를 취소해야할 아이디들을 모아서
    //* 결제 취소 api를 실행
    // await _.go(
    //   payments,
    //   L.reject(p => order_ids.includes(p.order_id)),
    //   L.map(p => p.imp_id),
    //   L.map(Impt.cancelPayment),
    //   _.each(log)
    // );
  };

  //* 7초에 한번 실행
  //* 7초보다 더 걸리면, job이 끝날 때까지
  // (function recur() {
  //   Promise.all([_.delay(7000, undefined), job()]).then(recur);
  // })();

  // TODO: ES6 템플릿 리터럴 활용
  const a = 10;
  const b = 5;
  // log(`${a} + ${b} = ${a + b}`);

  // TODO: 이미지 목록 그리기
};
