import { _, L, C, log } from './functional';

export const etcExample = () => {
  // TODO: Pick, indexBy function
  const obj = { a: 1, b: 3, c: 2 };

  //   log(_.pick(['a', 'b'], obj));

  const users1 = [
    { id: 5, name: 'aa', age: 35 },
    { id: 10, name: 'bb', age: 21 },
    { id: 15, name: 'cc', age: 24 },
    { id: 20, name: 'dd', age: 54 },
  ];

  //   const users2 = _.indexBy(u => u.id, users1);

  //   _.go(
  //     users2,
  //     L.entries,
  //     L.filter(([_, { age }]) => age > 30),
  //     _.take(2),
  //     _.object,
  //     log
  //   );

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

  log(coll.at(1).get('name'));

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
  //   L.map(a => a),
  //   _.take(3),
  //   _.each(log)
  // );
};
