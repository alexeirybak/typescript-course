// import { addMoney, createMoney, type Money } from "./domain/money.js";

// import { type Product } from "./domain/product.js";
import { chunk } from "lodash";

import { someFunction } from "some-library";

import { addMoney, createMoney, type Money, type Product } from "./index.js";

const keyboard: Product = {
  id: 1,
  title: "Клавиатура",
  price: createMoney(7500.456),
};

const delivery: Money = createMoney(500.257);

const total = addMoney(keyboard.price, delivery);

console.log(keyboard);
console.log(total);

chunk(["a", "b", "c", "d"], 2);

const result = someFunction("Hello");

console.log(result);
