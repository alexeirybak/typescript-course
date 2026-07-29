Оформление и уровень детализации сохранены по образцу из прикреплённого решения. 

# Домашнее задание. Решение

## Контрольные вопросы

### 1. Чем именованный экспорт отличается от `default export`?

Именованный экспорт позволяет экспортировать из одного модуля несколько сущностей под их собственными именами.

```ts
export type Product = {
  id: number;
  title: string;
};

export function createProduct(
  id: number,
  title: string,
): Product {
  return {
    id,
    title,
  };
}
```

При импорте необходимо использовать те же имена:

```ts
import {
  createProduct,
  type Product,
} from "./product.js";
```

Переименовать именованный импорт можно с помощью `as`:

```ts
import {
  createProduct as makeProduct,
} from "./product.js";
```

`default export` экспортирует одну основную сущность модуля.

```ts
export default class ProductService {
  getAll(): string[] {
    return [];
  }
}
```

При импорте имя можно выбрать самостоятельно:

```ts
import ProductService
  from "./product-service.js";
```

Можно использовать другое имя:

```ts
import StoreProductService
  from "./product-service.js";
```

Основное отличие:

* именованных экспортов в одном модуле может быть несколько;
* `default export` в одном модуле может быть только один;
* имя именованного импорта должно совпадать с экспортом;
* имя `default`-импорта выбирает импортирующий код.

---

### 2. Как импортировать сущность, экспортированную через `default export`?

Рассмотрим файл:

```text
src/services/product-service.ts
```

В нём класс экспортируется по умолчанию:

```ts
export default class ProductService {
  getAll(): string[] {
    return [];
  }
}
```

Импорт выполняется без фигурных скобок:

```ts
import ProductService
  from "./services/product-service.js";
```

Имя при импорте может отличаться:

```ts
import StoreProductService
  from "./services/product-service.js";
```

Оба варианта импортируют один и тот же класс.

Следующая запись неправильная:

```ts
// Ошибка TypeScript:
// import {
//   ProductService,
// } from "./services/product-service.js";
```

Фигурные скобки используются для именованных экспортов, а не для `default export`.

---

### 3. Для чего в проекте создают публичную точку входа `index.ts`?

Публичная точка входа объединяет экспортируемые сущности библиотеки в одном модуле.

Без `index.ts` внешний код вынужден знать внутреннюю структуру проекта:

```ts
import {
  createProduct,
} from "./domain/product.js";

import {
  createOrder,
} from "./domain/order.js";

import ProductService
  from "./services/product-service.js";

import {
  OrderService,
} from "./services/order-service.js";
```

Создадим файл:

```text
src/index.ts
```

В нём переэкспортируем публичные сущности:

```ts
export {
  createProduct,
} from "./domain/product.js";

export type {
  Product,
} from "./domain/product.js";

export {
  createOrder,
} from "./domain/order.js";

export type {
  Order,
  OrderItem,
} from "./domain/order.js";

export {
  default as ProductService,
} from "./services/product-service.js";

export {
  OrderService,
} from "./services/order-service.js";
```

После этого внешний код использует один импорт:

```ts
import {
  createOrder,
  createProduct,
  OrderService,
  ProductService,
  type OrderItem,
  type Product,
} from "./index.js";
```

`index.ts` определяет публичный API библиотеки.

---

### 4. Почему внешнему коду лучше импортировать сущности из `index.ts`, а не из внутренних файлов библиотеки?

Импорт из внутренних файлов связывает внешний код со структурой проекта.

Например:

```ts
import {
  createProduct,
} from "./domain/product.js";
```

Если файл переместить:

```text
src/domain/product.ts
```

в:

```text
src/models/product.ts
```

все внешние импорты придётся изменить.

При использовании публичной точки входа внешний код продолжает импортировать:

```ts
import {
  createProduct,
} from "./index.js";
```

Изменить нужно только переэкспорт внутри `index.ts`.

Кроме того, публичная точка входа позволяет скрыть внутренние сущности.

Например, функция экспортируется из внутреннего файла:

```ts
export function validateProductPrice(
  price: number,
): boolean {
  return price > 0;
}
```

Но если её не переэкспортировать из `index.ts`, она не станет частью публичного API библиотеки.

Таким образом, `index.ts`:

* упрощает импорты;
* скрывает внутреннюю структуру;
* уменьшает связанность;
* определяет публичный API;
* позволяет менять внутренние файлы без изменения внешнего кода.

---

### 5. Для чего нужны файлы деклараций `.d.ts`?

Файлы `.d.ts` описывают типы и публичный API TypeScript- или JavaScript-кода.

Рассмотрим функцию:

```ts
export function createProduct(
  id: number,
  title: string,
): Product {
  return {
    id,
    title,
  };
}
```

После генерации декларации TypeScript создаст примерно такой файл:

```ts
export declare function createProduct(
  id: number,
  title: string,
): Product;
```

В декларации сохраняются:

* параметры;
* типы параметров;
* возвращаемый тип;
* экспортируемые типы;
* классы;
* интерфейсы;
* публичные свойства и методы.

Реализация функции в `.d.ts` отсутствует.

Файлы деклараций нужны, чтобы другой TypeScript-проект мог:

* проверять правильность вызовов;
* получать автодополнение;
* видеть документацию типов;
* обнаруживать ошибки;
* использовать библиотеку без доступа к её исходному TypeScript-коду.

---

### 6. Чем файл `.d.ts` отличается от обычного файла `.ts`?

Обычный файл `.ts` может содержать типы и исполняемый код.

```ts
export function add(
  first: number,
  second: number,
): number {
  return first + second;
}
```

После компиляции из него будет создан JavaScript:

```js
export function add(
  first,
  second,
) {
  return first + second;
}
```

Файл `.d.ts` содержит только объявления:

```ts
export declare function add(
  first: number,
  second: number,
): number;
```

В нём нет тела функции.

Главное отличие:

* `.ts` может содержать реализацию;
* `.d.ts` описывает существующую реализацию;
* `.ts` компилируется в JavaScript;
* `.d.ts` не создаёт исполняемый код.

---

### 7. Какие настройки `tsconfig.json` включают генерацию деклараций и карт деклараций?

Генерацию файлов `.d.ts` включает параметр:

```json
"declaration": true
```

Генерацию карт деклараций включает:

```json
"declarationMap": true
```

Пример:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  }
}
```

После выполнения:

```bash
npx tsc
```

TypeScript создаст:

```text
product.js
product.d.ts
product.d.ts.map
```

`declarationMap` связывает декларацию с исходным TypeScript-файлом.

Это позволяет редактору переходить от использования библиотечного типа к исходному коду, если исходники доступны.

---

### 8. Что означает ключевое слово `declare`?

Ключевое слово `declare` сообщает TypeScript, что некоторая сущность существует, но её реализация находится за пределами текущего TypeScript-файла.

Например:

```ts
declare const APP_VERSION: string;
```

После такого объявления TypeScript разрешает использовать переменную:

```ts
const version: string =
  APP_VERSION;
```

Компилятор знает, что `APP_VERSION` имеет тип `string`.

Однако `declare` не создаёт переменную.

Реальное значение должно быть предоставлено другим кодом:

* JavaScript-файлом;
* средой выполнения;
* браузером;
* сборщиком;
* сторонней библиотекой.

`declare` описывает существующий API, но не реализует его.

---

### 9. Почему объявление через `declare` не создаёт JavaScript-код?

Задача `declare` — передать информацию компилятору типов.

Рассмотрим объявление:

```ts
declare const APP_VERSION: string;
```

TypeScript использует его только во время проверки программы.

В итоговый JavaScript это объявление не попадает.

Если выполнить:

```ts
console.log(APP_VERSION);
```

а реальное значение нигде не создано, во время запуска возникнет ошибка:

```text
ReferenceError: APP_VERSION is not defined
```

TypeScript не сообщает об ошибке, потому что декларация обещает компилятору существование переменной.

Но среда выполнения ничего не знает о TypeScript-декларациях.

Следовательно:

* `declare` влияет на проверку типов;
* `declare` не создаёт значение;
* реализация должна существовать отдельно;
* неправильная декларация может скрыть ошибку выполнения.

---

### 10. Откуда TypeScript получает типы для JavaScript-библиотеки `lodash`?

Библиотека `lodash` написана на JavaScript.

Её исполняемый код устанавливается командой:

```bash
npm install lodash
```

Типы для TypeScript устанавливаются отдельным пакетом:

```bash
npm install -D @types/lodash
```

После установки декларации находятся в папке:

```text
node_modules/
    @types/
        lodash/
```

Внутри находятся файлы `.d.ts`, которые описывают функции библиотеки.

Например, благодаря декларациям TypeScript понимает вызов:

```ts
import {
  chunk,
} from "lodash";

const groups =
  chunk([1, 2, 3, 4], 2);
```

Тип результата:

```ts
number[][]
```

Неправильный аргумент вызывает ошибку:

```ts
// Ошибка TypeScript:
// chunk([1, 2, 3], "2");
```

Таким образом:

* пакет `lodash` содержит реализацию;
* пакет `@types/lodash` содержит декларации;
* TypeScript объединяет реализацию библиотеки с информацией о её типах.

---

# Практическое задание

## Задание 1. Структура проекта

Создадим структуру:

```text
typescript-course/
    src/
        app.ts
        index.ts
        domain/
            product.ts
            order.ts
        services/
            product-service.ts
            order-service.ts
    types/
        environment.d.ts
    package.json
    tsconfig.json
```

Установим зависимости:

```bash
npm install lodash
```

```bash
npm install -D typescript tsx @types/lodash
```

---

## Задание 2. Модель товара

Создадим файл:

```text
src/domain/product.ts
```

Опишем категорию товара:

```ts
export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books";
```

Теперь создадим модель:

```ts
export type Product = {
  readonly id: number;
  title: string;
  price: number;
  category: ProductCategory;
  available: boolean;
};
```

Создадим отдельный тип данных для функции:

```ts
export type CreateProductData = {
  id: number;
  title: string;
  price: number;
  category: ProductCategory;
  available: boolean;
};
```

Реализуем функцию:

```ts
export function createProduct(
  data: CreateProductData,
): Product {
  return {
    id: data.id,
    title: data.title,
    price: data.price,
    category: data.category,
    available: data.available,
  };
}
```

Добавим вспомогательную функцию:

```ts
export function validateProductPrice(
  price: number,
): boolean {
  return price > 0;
}
```

Пока не будем добавлять её в публичную точку входа.

Полный файл:

```ts
export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books";

export type Product = {
  readonly id: number;
  title: string;
  price: number;
  category: ProductCategory;
  available: boolean;
};

export type CreateProductData = {
  id: number;
  title: string;
  price: number;
  category: ProductCategory;
  available: boolean;
};

export function createProduct(
  data: CreateProductData,
): Product {
  return {
    id: data.id,
    title: data.title,
    price: data.price,
    category: data.category,
    available: data.available,
  };
}

export function validateProductPrice(
  price: number,
): boolean {
  return price > 0;
}
```

---

## Задание 3. Модель заказа

Создадим файл:

```text
src/domain/order.ts
```

Импортируем модель товара:

```ts
import {
  type Product,
} from "./product.js";
```

Создадим позицию заказа:

```ts
export type OrderItem = {
  product: Product;
  quantity: number;
};
```

Создадим заказ:

```ts
export type Order = {
  readonly id: string;
  items: OrderItem[];
  createdAt: Date;
};
```

Реализуем функцию создания заказа:

```ts
export function createOrder(
  id: string,
  items: OrderItem[],
): Order {
  return {
    id,
    items,
    createdAt: new Date(),
  };
}
```

Полный файл:

```ts
import {
  type Product,
} from "./product.js";

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  readonly id: string;
  items: OrderItem[];
  createdAt: Date;
};

export function createOrder(
  id: string,
  items: OrderItem[],
): Order {
  return {
    id,
    items,
    createdAt: new Date(),
  };
}
```

---

## Задание 4. Сервис товаров

Создадим файл:

```text
src/services/product-service.ts
```

Импортируем тип товара:

```ts
import {
  type Product,
} from "../domain/product.js";
```

Создадим класс:

```ts
export default class ProductService {
  constructor(
    private readonly products:
      Product[],
  ) {}

  getAll(): Product[] {
    return this.products;
  }

  findById(
    id: Product["id"],
  ): Product | undefined {
    return this.products.find(
      (product) =>
        product.id === id,
    );
  }

  getAvailable(): Product[] {
    return this.products.filter(
      (product) =>
        product.available,
    );
  }
}
```

Метод `getAll` возвращает все товары.

Метод `findById` возвращает найденный товар или `undefined`.

Метод `getAvailable` возвращает только доступные товары.

---

## Задание 5. Использование `default export`

Класс экспортируется по умолчанию:

```ts
export default class ProductService
```

Поэтому при прямом импорте имя можно выбрать самостоятельно:

```ts
import StoreProductService
  from "./services/product-service.js";
```

Создать экземпляр можно так:

```ts
const productService =
  new StoreProductService(
    products,
  );
```

Имя `StoreProductService` отсутствует в исходном модуле.

Оно выбрано при импорте `default export`.

Позже приложение будет переведено на импорт из `index.ts`.

---

## Задание 6. Сервис заказов

Создадим файл:

```text
src/services/order-service.ts
```

Импортируем тип заказа:

```ts
import {
  type Order,
} from "../domain/order.js";
```

Создадим класс:

```ts
export class OrderService {
  calculateTotal(
    order: Order,
  ): number {
    return order.items.reduce(
      (total, item) =>
        total +
        item.product.price *
          item.quantity,
      0,
    );
  }
}
```

Метод проходит по позициям заказа и вычисляет сумму:

```ts
item.product.price
```

умноженную на:

```ts
item.quantity
```

---

## Задание 7. Публичная точка входа

Создадим файл:

```text
src/index.ts
```

Переэкспортируем типы товара:

```ts
export type {
  CreateProductData,
  Product,
  ProductCategory,
} from "./domain/product.js";
```

Переэкспортируем функцию создания товара:

```ts
export {
  createProduct,
} from "./domain/product.js";
```

Функцию `validateProductPrice` пока не экспортируем.

Переэкспортируем сущности заказа:

```ts
export type {
  Order,
  OrderItem,
} from "./domain/order.js";

export {
  createOrder,
} from "./domain/order.js";
```

Переэкспортируем `default export` под именем:

```ts
export {
  default as ProductService,
} from "./services/product-service.js";
```

Переэкспортируем сервис заказов:

```ts
export {
  OrderService,
} from "./services/order-service.js";
```

Полный файл:

```ts
export {
  createProduct,
} from "./domain/product.js";

export type {
  CreateProductData,
  Product,
  ProductCategory,
} from "./domain/product.js";

export {
  createOrder,
} from "./domain/order.js";

export type {
  Order,
  OrderItem,
} from "./domain/order.js";

export {
  default as ProductService,
} from "./services/product-service.js";

export {
  OrderService,
} from "./services/order-service.js";
```

---

## Задание 8. Импорт через публичную точку входа

В файле:

```text
src/app.ts
```

все сущности импортируем из:

```ts
"./index.js"
```

Импорт:

```ts
import {
  createOrder,
  createProduct,
  OrderService,
  ProductService,
  type OrderItem,
  type Product,
} from "./index.js";
```

Теперь приложение не зависит от расположения файлов:

```text
domain/
```

и:

```text
services/
```

Внешний код знает только о публичной точке входа.

---

## Задание 9. Тестовые товары

Создадим товар `keyboard`:

```ts
const keyboard: Product =
  createProduct({
    id: 1,
    title: "Клавиатура",
    price: 7500,
    category: "electronics",
    available: true,
  });
```

Создадим товар `mouse`:

```ts
const mouse: Product =
  createProduct({
    id: 2,
    title: "Мышь",
    price: 3200,
    category: "electronics",
    available: true,
  });
```

Создадим книгу:

```ts
const book: Product =
  createProduct({
    id: 3,
    title:
      "Изучаем TypeScript",
    price: 1800,
    category: "books",
    available: true,
  });
```

Создадим недоступную футболку:

```ts
const tshirt: Product =
  createProduct({
    id: 4,
    title:
      "Футболка TypeScript",
    price: 2400,
    category: "clothing",
    available: false,
  });
```

Объединим товары в массив:

```ts
const products: Product[] = [
  keyboard,
  mouse,
  book,
  tshirt,
];
```

---

## Задание 10. Создание заказа

Создадим позиции заказа:

```ts
const items: OrderItem[] = [
  {
    product: keyboard,
    quantity: 1,
  },
  {
    product: mouse,
    quantity: 2,
  },
  {
    product: book,
    quantity: 3,
  },
];
```

Создадим заказ:

```ts
const order = createOrder(
  "order-001",
  items,
);
```

Создадим сервис:

```ts
const orderService =
  new OrderService();
```

Вычислим стоимость:

```ts
const total =
  orderService.calculateTotal(
    order,
  );
```

Расчёт:

```text
7500 × 1 = 7500
3200 × 2 = 6400
1800 × 3 = 5400
```

Итог:

```text
19300
```

Создадим сервис товаров:

```ts
const productService =
  new ProductService(products);
```

Получим доступные товары:

```ts
const availableProducts =
  productService.getAvailable();
```

Товар `tshirt` в результат не попадёт, потому что:

```ts
available: false
```

---

## Задание 11. Подключение `lodash`

Установим библиотеку:

```bash
npm install lodash
```

Установим декларации:

```bash
npm install -D @types/lodash
```

Импортируем функцию:

```ts
import {
  chunk,
} from "lodash";
```

Разделим товары на группы по два:

```ts
const productGroups =
  chunk(products, 2);
```

Результат имеет тип:

```ts
Product[][]
```

При четырёх товарах получится две группы:

```ts
[
  [
    keyboard,
    mouse,
  ],
  [
    book,
    tshirt,
  ],
]
```

---

## Задание 12. Проверка типизации `lodash`

Создадим массив:

```ts
const numbers = [
  1,
  2,
  3,
  4,
  5,
  6,
];
```

Разделим его на группы:

```ts
const numberGroups =
  chunk(numbers, 3);
```

TypeScript выводит тип:

```ts
number[][]
```

Можно проверить его явно:

```ts
const checkedNumberGroups:
  number[][] = numberGroups;
```

Неправильный вызов:

```ts
// Ошибка TypeScript:
// chunk(numbers, "3");
```

Второй параметр должен иметь тип:

```ts
number
```

Декларации из `@types/lodash` позволяют TypeScript обнаружить эту ошибку.

---

## Задание 13. Настройка генерации деклараций

Файл:

```text
tsconfig.json
```

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*.ts",
    "types/**/*.d.ts"
  ]
}
```

Параметр:

```json
"declaration": true
```

создаёт `.d.ts`.

Параметр:

```json
"declarationMap": true
```

создаёт `.d.ts.map`.

Папка `types` добавлена в `include`, чтобы TypeScript видел пользовательские декларации.

---

## Задание 14. Генерация деклараций

Запустим компилятор:

```bash
npx tsc
```

После компиляции получится структура:

```text
dist/
    app.js
    app.js.map
    app.d.ts
    app.d.ts.map
    index.js
    index.js.map
    index.d.ts
    index.d.ts.map
    domain/
        product.js
        product.js.map
        product.d.ts
        product.d.ts.map
        order.js
        order.js.map
        order.d.ts
        order.d.ts.map
    services/
        product-service.js
        product-service.js.map
        product-service.d.ts
        product-service.d.ts.map
        order-service.js
        order-service.js.map
        order-service.d.ts
        order-service.d.ts.map
```

Точный набор файлов зависит от настроек `sourceMap` и содержимого проекта.

---

## Задание 15. Изучение созданных `.d.ts`

Файл:

```text
dist/index.d.ts
```

будет содержать переэкспорты:

```ts
export {
  createProduct,
} from "./domain/product.js";

export type {
  CreateProductData,
  Product,
  ProductCategory,
} from "./domain/product.js";

export {
  createOrder,
} from "./domain/order.js";

export type {
  Order,
  OrderItem,
} from "./domain/order.js";

export {
  default as ProductService,
} from "./services/product-service.js";

export {
  OrderService,
} from "./services/order-service.js";
```

Файл:

```text
dist/domain/product.d.ts
```

будет выглядеть примерно так:

```ts
export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books";

export type Product = {
  readonly id: number;
  title: string;
  price: number;
  category: ProductCategory;
  available: boolean;
};

export type CreateProductData = {
  id: number;
  title: string;
  price: number;
  category: ProductCategory;
  available: boolean;
};

export declare function createProduct(
  data: CreateProductData,
): Product;

export declare function validateProductPrice(
  price: number,
): boolean;
```

Ответы на вопросы:

```ts
// 1. Есть ли в .d.ts реализация
// функции createProduct?
//
// Нет. Сохраняется только сигнатура.
```

```ts
// 2. Сохранился ли тип
// возвращаемого значения?
//
// Да. Функция возвращает Product.
```

```ts
// 3. Сохранились ли
// экспортируемые типы?
//
// Да. Product, ProductCategory
// и CreateProductData присутствуют
// в декларации.
```

```ts
// 4. Содержится ли в .d.ts
// исполняемый JavaScript-код?
//
// Нет. Файл содержит только
// описание публичного API.
```

---

## Задание 16. Проверка публичной точки входа

Функция объявлена и экспортирована в:

```text
src/domain/product.ts
```

```ts
export function validateProductPrice(
  price: number,
): boolean {
  return price > 0;
}
```

Но в `src/index.ts` её пока нет.

Поэтому импорт из публичной точки входа вызовет ошибку:

```ts
// Ошибка TypeScript:
// import {
//   validateProductPrice,
// } from "./index.js";
```

Добавим функцию в `src/index.ts`:

```ts
export {
  createProduct,
  validateProductPrice,
} from "./domain/product.js";
```

Теперь импорт разрешён:

```ts
import {
  validateProductPrice,
} from "./index.js";
```

Использование:

```ts
console.log(
  validateProductPrice(7500),
);
```

Результат:

```text
true
```

Это показывает, что экспорт из внутреннего файла и публикация через `index.ts` — разные действия.

---

## Задание 17. Использование `declare`

Создадим файл:

```text
types/environment.d.ts
```

Добавим объявление:

```ts
declare const APP_VERSION:
  string;
```

Теперь в `src/app.ts` TypeScript понимает:

```ts
APP_VERSION
```

Например:

```ts
const version: string =
  APP_VERSION;
```

TypeScript не сообщает об ошибке типа.

Ответ:

```ts
// Создаёт ли declare реальное
// значение APP_VERSION
// во время выполнения?
//
// Нет. declare только сообщает
// TypeScript, что такое значение
// должно существовать.
```

Чтобы основной пример запускался, обращение к переменной оставим закомментированным:

```ts
// console.log(APP_VERSION);
```

---

## Задание 18. Разница между объявлением и реализацией

Временно добавим:

```ts
console.log(APP_VERSION);
```

Запустим:

```bash
npx tsx src/app.ts
```

Во время выполнения возникнет ошибка:

```text
ReferenceError:
APP_VERSION is not defined
```

Объяснение:

```ts
// TypeScript не показывал ошибку,
// потому что файл environment.d.ts
// объявил глобальную переменную
// APP_VERSION с типом string.
```

```ts
// Ошибка появилась при запуске,
// потому что среда выполнения
// не создала реальную переменную.
```

```ts
// declare является описанием,
// а не реализацией.
```

После проверки строку необходимо закомментировать:

```ts
// console.log(APP_VERSION);
```

---

## Задание 19. Итоговая проверка

В выполненном проекте:

* `Product` и `Order` находятся в отдельных модулях;
* типы и функции используют именованные экспорты;
* `ProductService` использует `default export`;
* `index.ts` является публичной точкой входа;
* `app.ts` импортирует сущности библиотеки из `index.ts`;
* `lodash` установлен вместе с `@types/lodash`;
* `chunk` сохраняет тип элементов массива;
* `npx tsc` создаёт `.js` и `.d.ts`;
* декларации содержат сигнатуры, но не реализацию;
* `declare` сообщает TypeScript о внешней сущности;
* `declare` не создаёт значение во время выполнения.

---

# Полный код решения

## `src/domain/product.ts`

```ts
export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books";

export type Product = {
  readonly id: number;
  title: string;
  price: number;
  category: ProductCategory;
  available: boolean;
};

export type CreateProductData = {
  id: number;
  title: string;
  price: number;
  category: ProductCategory;
  available: boolean;
};

export function createProduct(
  data: CreateProductData,
): Product {
  return {
    id: data.id,
    title: data.title,
    price: data.price,
    category: data.category,
    available: data.available,
  };
}

export function validateProductPrice(
  price: number,
): boolean {
  return price > 0;
}
```

## `src/domain/order.ts`

```ts
import {
  type Product,
} from "./product.js";

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  readonly id: string;
  items: OrderItem[];
  createdAt: Date;
};

export function createOrder(
  id: string,
  items: OrderItem[],
): Order {
  return {
    id,
    items,
    createdAt: new Date(),
  };
}
```

## `src/services/product-service.ts`

```ts
import {
  type Product,
} from "../domain/product.js";

export default class ProductService {
  constructor(
    private readonly products:
      Product[],
  ) {}

  getAll(): Product[] {
    return this.products;
  }

  findById(
    id: Product["id"],
  ): Product | undefined {
    return this.products.find(
      (product) =>
        product.id === id,
    );
  }

  getAvailable(): Product[] {
    return this.products.filter(
      (product) =>
        product.available,
    );
  }
}
```

## `src/services/order-service.ts`

```ts
import {
  type Order,
} from "../domain/order.js";

export class OrderService {
  calculateTotal(
    order: Order,
  ): number {
    return order.items.reduce(
      (total, item) =>
        total +
        item.product.price *
          item.quantity,
      0,
    );
  }
}
```

## `src/index.ts`

```ts
export {
  createProduct,
  validateProductPrice,
} from "./domain/product.js";

export type {
  CreateProductData,
  Product,
  ProductCategory,
} from "./domain/product.js";

export {
  createOrder,
} from "./domain/order.js";

export type {
  Order,
  OrderItem,
} from "./domain/order.js";

export {
  default as ProductService,
} from "./services/product-service.js";

export {
  OrderService,
} from "./services/order-service.js";
```

## `types/environment.d.ts`

```ts
declare const APP_VERSION:
  string;
```

## `src/app.ts`

```ts
import {
  chunk,
} from "lodash";

import {
  createOrder,
  createProduct,
  OrderService,
  ProductService,
  validateProductPrice,
  type OrderItem,
  type Product,
} from "./index.js";

const keyboard: Product =
  createProduct({
    id: 1,
    title: "Клавиатура",
    price: 7500,
    category: "electronics",
    available: true,
  });

const mouse: Product =
  createProduct({
    id: 2,
    title: "Мышь",
    price: 3200,
    category: "electronics",
    available: true,
  });

const book: Product =
  createProduct({
    id: 3,
    title:
      "Изучаем TypeScript",
    price: 1800,
    category: "books",
    available: true,
  });

const tshirt: Product =
  createProduct({
    id: 4,
    title:
      "Футболка TypeScript",
    price: 2400,
    category: "clothing",
    available: false,
  });

const products: Product[] = [
  keyboard,
  mouse,
  book,
  tshirt,
];

const productService =
  new ProductService(products);

console.log(
  "Все товары:",
  productService.getAll(),
);

console.log(
  "Товар с id 2:",
  productService.findById(2),
);

console.log(
  "Доступные товары:",
  productService.getAvailable(),
);

const items: OrderItem[] = [
  {
    product: keyboard,
    quantity: 1,
  },
  {
    product: mouse,
    quantity: 2,
  },
  {
    product: book,
    quantity: 3,
  },
];

const order = createOrder(
  "order-001",
  items,
);

const orderService =
  new OrderService();

const total =
  orderService.calculateTotal(
    order,
  );

console.log(
  "Заказ:",
  order,
);

console.log(
  "Итоговая стоимость:",
  total,
);

const productGroups =
  chunk(products, 2);

console.log(
  "Группы товаров:",
  productGroups,
);

const numbers = [
  1,
  2,
  3,
  4,
  5,
  6,
];

const numberGroups =
  chunk(numbers, 3);

const checkedNumberGroups:
  number[][] = numberGroups;

console.log(
  "Группы чисел:",
  checkedNumberGroups,
);

console.log(
  "Цена корректна:",
  validateProductPrice(
    keyboard.price,
  ),
);

// Ошибка TypeScript:
// второй аргумент должен
// иметь тип number.
//
// chunk(numbers, "3");

// APP_VERSION объявлена
// через declare, но реального
// значения во время выполнения нет.
//
// console.log(APP_VERSION);
```

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*.ts",
    "types/**/*.d.ts"
  ]
}
```

## Команды запуска

Установка зависимостей:

```bash
npm install lodash
```

```bash
npm install -D typescript tsx @types/lodash
```

Запуск TypeScript-кода:

```bash
npx tsx src/app.ts
```

Компиляция и генерация деклараций:

```bash
npx tsc
```

Запуск скомпилированного JavaScript:

```bash
node dist/app.js
```

## Пример результата

```text
Все товары: [
  {
    id: 1,
    title: "Клавиатура",
    price: 7500,
    category: "electronics",
    available: true
  },
  ...
]

Товар с id 2: {
  id: 2,
  title: "Мышь",
  price: 3200,
  category: "electronics",
  available: true
}

Доступные товары: [
  "Клавиатура",
  "Мышь",
  "Изучаем TypeScript"
]

Итоговая стоимость: 19300

Группы чисел: [
  [1, 2, 3],
  [4, 5, 6]
]

Цена корректна: true
```
