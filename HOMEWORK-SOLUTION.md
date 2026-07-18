# Решение домашнего задания

## Контрольные вопросы

### 1. Чем необязательный параметр отличается от `string | undefined`?

Необязательный параметр можно не передавать при вызове функции:

```ts
function greet(name: string, title?: string): string {
  return title === undefined ? `Здравствуйте, ${name}` : `Здравствуйте, ${title} ${name}`;
}

greet("Анна");
greet("Анна", "доктор");
```

А параметр типа `string | undefined` всё равно нужно передать по позиции:

```ts
function greetExplicit(name: string, title: string | undefined): string {
  return title === undefined ? `Здравствуйте, ${name}` : `Здравствуйте, ${title} ${name}`;
}

greetExplicit("Анна", undefined);
```

Главное отличие: `title?: string` можно пропустить, а `title: string | undefined` нужно передать явно.

### 2. Когда перегрузка лучше объединения?

Перегрузка лучше, когда возвращаемый тип зависит от того, какие аргументы передали.

```ts
function parseValue(value: string, kind: "number"): number;
function parseValue(value: string, kind: "boolean"): boolean;

function parseValue(value: string, kind: "number" | "boolean"): number | boolean {
  return kind === "number" ? Number(value) : value === "true";
}

const count = parseValue("42", "number");
const enabled = parseValue("true", "boolean");
```

TypeScript понимает, что `count` — это `number`, а `enabled` — это `boolean`.

### 3. Почему callback может объявить меньше параметров, чем ему передают?

Потому что функция не обязана использовать все аргументы, которые ей передают.

```ts
products.map((product) => {
  return product.title;
});
```

Метод `map` передаёт ещё индекс и массив, но callback может их не объявлять. Лишние аргументы просто игнорируются.

### 4. Что происходит с псевдопараметром `this` после компиляции?

Псевдопараметр `this` существует только в TypeScript и нужен только для проверки типов.

```ts
type Counter = {
  value: number;
  increment(this: Counter, amount: number): void;
};
```

После компиляции этот параметр исчезает. Функцию всё равно вызывают так:

```ts
counter.increment(5);
```

а не так:

```ts
counter.increment(counter, 5);
```

### 5. Как дженерик сохраняет связь между входом и выходом?

Дженерик позволяет использовать один и тот же параметр типа в разных частях функции.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

Если передать массив чисел, `T` станет `number`. Если передать массив строк, `T` станет `string`. Так TypeScript сохраняет связь: какой тип был внутри массива, такой же тип будет у результата.

---

## Практическое задание

```ts
type Product = {
  id: number;
  title: string;
  price: number;
};

const products: Product[] = [
  {
    id: 1,
    title: "Клавиатура",
    price: 4500,
  },
  {
    id: 2,
    title: "Монитор",
    price: 18_000,
  },
  {
    id: 3,
    title: "Ноутбук",
    price: 85_000,
  },
  {
    id: 4,
    title: "Мышь",
    price: 2500,
  },
];
```

### Задание 1. Необязательный параметр

```ts
function formatProduct(product: Product, currency = "RUB"): string {
  return `${product.title} — ${product.price} ${currency}`;
}

const formattedKeyboard = formatProduct(products[0]!);
const formattedMonitor = formatProduct(products[1]!, "USD");

console.log(formattedKeyboard);
console.log(formattedMonitor);
```

### Задание 2. Callback-функция

```ts
function filterProducts(
  products: Product[],
  predicate: (product: Product) => boolean,
): Product[] {
  return products.filter(predicate);
}

const expensiveProducts = filterProducts(products, (product) => {
  return product.price > 10_000;
});

const cheapProducts = filterProducts(products, (product) => {
  return product.price < 5_000;
});

console.log(expensiveProducts);
console.log(cheapProducts);
```

### Задание 3. Перегрузка

```ts
function findProduct(id: number): Product | undefined;
function findProduct(title: string): Product | undefined;

function findProduct(value: number | string): Product | undefined {
  if (typeof value === "number") {
    return products.find((product) => product.id === value);
  }

  return products.find((product) => product.title === value);
}

const productById = findProduct(2);
const productByTitle = findProduct("Монитор");

console.log(productById);
console.log(productByTitle);
```

### Задание 4. Параметр-объект

```ts
type CreateProductInput = {
  title: string;
  price: number;
};

function createProduct(input: CreateProductInput): Product {
  return {
    id: Date.now(),
    title: input.title,
    price: input.price,
  };
}

const newProduct = createProduct({
  title: "Веб-камера",
  price: 7000,
});

console.log(newProduct);
```

### Задание 5. Дженерик

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = first([10, 20, 30]);
const firstName = first(["Анна", "Борис"]);
const firstProduct = first(products);

console.log(firstNumber);
console.log(firstName);
console.log(firstProduct);
```

TypeScript автоматически определяет типы:

```ts
const firstNumber: number | undefined;
const firstName: string | undefined;
const firstProduct: Product | undefined;
```

---

## Полный код одним блоком

```ts
type Product = {
  id: number;
  title: string;
  price: number;
};

const products: Product[] = [
  {
    id: 1,
    title: "Клавиатура",
    price: 4500,
  },
  {
    id: 2,
    title: "Монитор",
    price: 18_000,
  },
  {
    id: 3,
    title: "Ноутбук",
    price: 85_000,
  },
  {
    id: 4,
    title: "Мышь",
    price: 2500,
  },
];

function formatProduct(product: Product, currency = "RUB"): string {
  return `${product.title} — ${product.price} ${currency}`;
}

function filterProducts(
  products: Product[],
  predicate: (product: Product) => boolean,
): Product[] {
  return products.filter(predicate);
}

function findProduct(id: number): Product | undefined;
function findProduct(title: string): Product | undefined;

function findProduct(value: number | string): Product | undefined {
  if (typeof value === "number") {
    return products.find((product) => product.id === value);
  }

  return products.find((product) => product.title === value);
}

type CreateProductInput = {
  title: string;
  price: number;
};

function createProduct(input: CreateProductInput): Product {
  return {
    id: Date.now(),
    title: input.title,
    price: input.price,
  };
}

function first<T>(items: T[]): T | undefined {
  return items[0];
}

const formattedKeyboard = formatProduct(products[0]!);
const formattedMonitor = formatProduct(products[1]!, "USD");

const expensiveProducts = filterProducts(products, (product) => {
  return product.price > 10_000;
});

const cheapProducts = filterProducts(products, (product) => {
  return product.price < 5_000;
});

const productById = findProduct(2);
const productByTitle = findProduct("Монитор");

const newProduct = createProduct({
  title: "Веб-камера",
  price: 7000,
});

const firstNumber = first([10, 20, 30]);
const firstName = first(["Анна", "Борис"]);
const firstProduct = first(products);

console.log(formattedKeyboard);
console.log(formattedMonitor);
console.log(expensiveProducts);
console.log(cheapProducts);
console.log(productById);
console.log(productByTitle);
console.log(newProduct);
console.log(firstNumber);
console.log(firstName);
console.log(firstProduct);
```
