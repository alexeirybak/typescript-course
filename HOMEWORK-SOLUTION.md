# Домашнее задание. Решение

## Контрольные вопросы

### 1. Чем `<T>` отличается от `any`?

`any` отключает проверку типов.

```ts
function firstAny(items: any[]): any {
  return items[0];
}

const value = firstAny(["Анна", "Борис"]);

value.nonExistingMethod();
```

TypeScript разрешит вызвать несуществующий метод, потому что значение имеет тип `any`.

Ошибка обнаружится только во время выполнения программы.

Дженерик сохраняет информацию о конкретном типе:

```ts
function first<T>(
  items: readonly T[],
): T | undefined {
  return items[0];
}

const value = first(["Анна", "Борис"]);
```

Тип переменной `value`:

```ts
string | undefined
```

TypeScript понимает, что в функцию был передан массив строк.

Поэтому вызвать несуществующий метод нельзя:

```ts
if (value) {
  console.log(value.toUpperCase());

  // Ошибка TypeScript:
  // value.nonExistingMethod();
}
```

Основное различие:

* `any` удаляет информацию о типе и отключает проверки;
* `<T>` временно обозначает неизвестный тип, который будет определён при использовании функции, класса или интерфейса;
* дженерик сохраняет связь между входными и выходными типами.

---

### 2. Что даёт ограничение `T extends HasId`?

Ограничение указывает, каким минимальным требованиям должен соответствовать параметр типа.

Создадим тип:

```ts
type HasId = {
  id: string | number;
};
```

Теперь ограничим параметр типа:

```ts
function logId<T extends HasId>(
  value: T,
): T {
  console.log(value.id);

  return value;
}
```

TypeScript знает, что у значения обязательно существует свойство `id`.

Такой объект передать можно:

```ts
const product = logId({
  id: 1,
  title: "Клавиатура",
  price: 7500,
});
```

При этом полный тип объекта сохраняется:

```ts
console.log(product.title);
console.log(product.price);
```

Такое значение передать нельзя:

```ts
// Ошибка TypeScript:
// logId({
//   title: "Клавиатура",
// });
```

В объекте отсутствует обязательное поле `id`.

Ограничение `T extends HasId`:

* запрещает передавать типы без свойства `id`;
* позволяет безопасно обращаться к `value.id`;
* сохраняет остальные свойства конкретного типа;
* не заменяет тип `T` на `HasId`, а только устанавливает минимальный контракт.

---

### 3. Как связаны `K extends keyof T` и `T[K]`?

`keyof T` создаёт объединение ключей типа `T`.

Например:

```ts
type User = {
  id: number;
  name: string;
  active: boolean;
};
```

Выражение:

```ts
keyof User
```

создаёт тип:

```ts
"id" | "name" | "active"
```

Ограничение:

```ts
K extends keyof T
```

означает, что `K` может быть только существующим ключом объекта.

Конструкция:

```ts
T[K]
```

возвращает тип значения, которое находится по выбранному ключу.

```ts
function getProperty<
  T,
  K extends keyof T,
>(
  object: T,
  key: K,
): T[K] {
  return object[key];
}
```

Использование:

```ts
const user: User = {
  id: 1,
  name: "Анна",
  active: true,
};

const name = getProperty(user, "name");
const active = getProperty(user, "active");
```

Типы результатов:

```ts
// name: string
// active: boolean
```

Связь выглядит так:

* `T` — тип объекта;
* `keyof T` — все допустимые ключи объекта;
* `K` — конкретный выбранный ключ;
* `T[K]` — тип значения по этому ключу.

---

### 4. Когда параметр типа не нужен?

Параметр типа не нужен, если он не сохраняет связь между несколькими частями контракта.

Например:

```ts
function length<
  T extends { length: number },
>(
  value: T,
): number {
  return value.length;
}
```

Параметр `T` используется только в одном месте.

Функция не возвращает `T` и не связывает его с другим аргументом.

Поэтому дженерик можно убрать:

```ts
function length(
  value: { length: number },
): number {
  return value.length;
}
```

Обе функции выполняют одну и ту же задачу.

Параметр типа обычно нужен, когда связывает:

* аргумент и результат;
* несколько аргументов;
* элементы массива и результат преобразования;
* объект и его ключ;
* ключ и тип значения;
* сущность и тип идентификатора.

Если обычный тип решает задачу без потери информации, дженерик добавлять не следует.

---

### 5. Почему `parse<T>` без валидации небезопасен?

Рассмотрим функцию:

```ts
function parse<T>(text: string): T {
  return JSON.parse(text) as T;
}
```

Параметр `T` никак не связан с содержимым строки.

Вызывающий код может указать любой тип:

```ts
type Product = {
  id: number;
  title: string;
};

const product = parse<Product>("null");
```

TypeScript считает, что переменная `product` содержит `Product`.

Но фактическое значение:

```ts
null
```

Следующее обращение приведёт к ошибке во время выполнения:

```ts
console.log(product.title);
```

Проблема заключается в утверждении:

```ts
as T
```

Оно заставляет TypeScript поверить разработчику, но не проверяет реальные данные.

Безопаснее вернуть `unknown`:

```ts
function parse(text: string): unknown {
  return JSON.parse(text);
}
```

После этого данные необходимо проверить во время выполнения.

Можно также передать функцию валидации:

```ts
function parseWithValidation<T>(
  text: string,
  isValid: (value: unknown) => value is T,
): T {
  const value: unknown = JSON.parse(text);

  if (!isValid(value)) {
    throw new Error(
      "Структура данных не соответствует ожидаемому типу",
    );
  }

  return value;
}
```

Такой вариант связывает `T` с реальной runtime-проверкой.

---

# Практическое задание

## Задание 1. Модели данных

### Интерфейс `Entity`

Создадим универсальный интерфейс сущности:

```ts
interface Entity<TId> {
  readonly id: TId;
}
```

Параметр `TId` определяет тип идентификатора.

---

### Интерфейс `Product`

У товара будет числовой идентификатор:

```ts
interface Product extends Entity<number> {
  title: string;
  price: number;
  categoryId: string;
  available: boolean;
}
```

Поле `categoryId` является строкой, потому что категории будут использовать строковые идентификаторы.

---

### Интерфейс `Category`

У категории будет строковый идентификатор:

```ts
interface Category extends Entity<string> {
  title: string;
  description: string;
}
```

Теперь TypeScript различает типы идентификаторов:

```ts
const product: Product = {
  id: 1,
  title: "Клавиатура",
  price: 7500,
  categoryId: "keyboards",
  available: true,
};

const category: Category = {
  id: "keyboards",
  title: "Клавиатуры",
  description: "Механические и мембранные клавиатуры",
};
```

---

## Задание 2. Generic-класс репозитория

### Класс `Repository`

```ts
class Repository<
  TEntity extends Entity<TId>,
  TId = string,
> {
  private readonly items =
    new Map<TId, TEntity>();

  save(entity: TEntity): void {
    this.items.set(entity.id, entity);
  }

  findById(id: TId): TEntity | undefined {
    return this.items.get(id);
  }

  findAll(): TEntity[] {
    return [...this.items.values()];
  }

  remove(id: TId): boolean {
    return this.items.delete(id);
  }

  has(id: TId): boolean {
    return this.items.has(id);
  }
}
```

Параметр:

```ts
TEntity
```

определяет тип хранимой сущности.

Параметр:

```ts
TId
```

определяет тип идентификатора.

Ограничение:

```ts
TEntity extends Entity<TId>
```

гарантирует наличие у сущности свойства `id` правильного типа.

---

### Репозиторий товаров

```ts
const productRepository =
  new Repository<Product, number>();
```

Здесь:

```text
TEntity = Product
TId = number
```

Сохраним товары:

```ts
productRepository.save({
  id: 1,
  title: "Клавиатура",
  price: 7500,
  categoryId: "keyboards",
  available: true,
});

productRepository.save({
  id: 2,
  title: "Мышь",
  price: 3500,
  categoryId: "mice",
  available: true,
});
```

Найти товар можно только по числовому идентификатору:

```ts
const foundProduct =
  productRepository.findById(1);
```

Строковый идентификатор не подойдёт:

```ts
// Ошибка TypeScript:
// productRepository.findById("1");
```

---

### Репозиторий категорий

```ts
const categoryRepository =
  new Repository<Category>();
```

Второй параметр не указан, поэтому используется значение по умолчанию:

```ts
TId = string
```

Сохраним категории:

```ts
categoryRepository.save({
  id: "keyboards",
  title: "Клавиатуры",
  description:
    "Механические и мембранные клавиатуры",
});

categoryRepository.save({
  id: "mice",
  title: "Компьютерные мыши",
  description:
    "Проводные и беспроводные мыши",
});
```

Поиск выполняется по строковому идентификатору:

```ts
const foundCategory =
  categoryRepository.findById("keyboards");
```

Число передать нельзя:

```ts
// Ошибка TypeScript:
// categoryRepository.findById(1);
```

---

### Проверка методов репозитория

```ts
console.log(
  productRepository.has(1),
);

console.log(
  productRepository.findById(1),
);

console.log(
  productRepository.findAll(),
);

console.log(
  productRepository.remove(2),
);

console.log(
  productRepository.has(2),
);
```

---

## Задание 3. Универсальные функции работы с объектами

### Функция получения свойства

```ts
function getProperty<
  T,
  K extends keyof T,
>(
  object: T,
  key: K,
): T[K] {
  return object[key];
}
```

Использование:

```ts
const currentProduct: Product = {
  id: 1,
  title: "Клавиатура",
  price: 7500,
  categoryId: "keyboards",
  available: true,
};

const productTitle = getProperty(
  currentProduct,
  "title",
);

const productPrice = getProperty(
  currentProduct,
  "price",
);

const productAvailable = getProperty(
  currentProduct,
  "available",
);
```

Полученные типы:

```ts
// productTitle: string
// productPrice: number
// productAvailable: boolean
```

Несуществующий ключ использовать нельзя:

```ts
// Ошибка TypeScript:
// getProperty(currentProduct, "discount");
```

---

### Функция обновления свойства

```ts
function setProperty<
  T,
  K extends keyof T,
>(
  object: T,
  key: K,
  value: T[K],
): T {
  return {
    ...object,
    [key]: value,
  };
}
```

Изменим цену:

```ts
const productWithNewPrice =
  setProperty(
    currentProduct,
    "price",
    6990,
  );
```

Изменим доступность:

```ts
const unavailableProduct =
  setProperty(
    currentProduct,
    "available",
    false,
  );
```

Изменим название:

```ts
const renamedProduct =
  setProperty(
    currentProduct,
    "title",
    "Игровая клавиатура",
  );
```

Передать значение неправильного типа нельзя:

```ts
// Ошибка TypeScript:
// setProperty(
//   currentProduct,
//   "price",
//   "6990",
// );
```

```ts
// Ошибка TypeScript:
// setProperty(
//   currentProduct,
//   "available",
//   "да",
// );
```

Исходный объект не изменяется:

```ts
console.log(currentProduct.price);
console.log(productWithNewPrice.price);
```

Результат:

```text
7500
6990
```

---

## Задание 4. Универсальный тип ответа API

### Успешный ответ

```ts
type ApiSuccess<TData> = {
  status: "success";
  data: TData;
};
```

### Ответ с ошибкой

```ts
type ApiFailure = {
  status: "error";
  message: string;
  code: number;
};
```

### Общий тип ответа

```ts
type ApiResponse<TData> =
  | ApiSuccess<TData>
  | ApiFailure;
```

Поле `status` является дискриминатором.

По нему TypeScript сможет определить конкретный вариант ответа.

---

### Ответ со списком товаров

```ts
const productsResponse:
  ApiResponse<Product[]> = {
    status: "success",
    data: [
      {
        id: 1,
        title: "Клавиатура",
        price: 7500,
        categoryId: "keyboards",
        available: true,
      },
      {
        id: 2,
        title: "Мышь",
        price: 3500,
        categoryId: "mice",
        available: false,
      },
    ],
  };
```

---

### Ответ со списком категорий

```ts
const categoriesResponse:
  ApiResponse<Category[]> = {
    status: "success",
    data: [
      {
        id: "keyboards",
        title: "Клавиатуры",
        description:
          "Механические и мембранные клавиатуры",
      },
      {
        id: "mice",
        title: "Компьютерные мыши",
        description:
          "Проводные и беспроводные мыши",
      },
    ],
  };
```

---

### Ответ с ошибкой

```ts
const errorResponse:
  ApiResponse<Product[]> = {
    status: "error",
    message:
      "Не удалось загрузить каталог товаров",
    code: 500,
  };
```

---

### Обработка ответа

```ts
function printApiResponse<T>(
  response: ApiResponse<T>,
): void {
  if (response.status === "success") {
    console.log(response.data);
    return;
  }

  console.log(
    `Ошибка ${response.code}: ${response.message}`,
  );
}
```

Использование:

```ts
printApiResponse(productsResponse);
printApiResponse(categoriesResponse);
printApiResponse(errorResponse);
```

---

## Задание 5. Generic-класс кэша

### Класс `Cache`

Добавим в начало файла:

```ts
export {};
```

Это превращает файл в модуль и предотвращает возможный конфликт с глобальным браузерным интерфейсом `Cache`.

Теперь реализуем собственный класс:

```ts
class Cache<TKey, TValue> {
  private readonly items =
    new Map<TKey, TValue>();

  set(
    key: TKey,
    value: TValue,
  ): void {
    this.items.set(key, value);
  }

  get(
    key: TKey,
  ): TValue | undefined {
    return this.items.get(key);
  }

  delete(key: TKey): boolean {
    return this.items.delete(key);
  }

  has(key: TKey): boolean {
    return this.items.has(key);
  }

  getOrSet(
    key: TKey,
    factory: () => TValue,
  ): TValue {
    const existingValue =
      this.items.get(key);

    if (existingValue !== undefined) {
      return existingValue;
    }

    const newValue = factory();

    this.items.set(key, newValue);

    return newValue;
  }
}
```

---

### Кэш товаров

```ts
const productCache =
  new Cache<number, Product>();
```

Сохраним товар:

```ts
productCache.set(1, {
  id: 1,
  title: "Клавиатура",
  price: 7500,
  categoryId: "keyboards",
  available: true,
});
```

Получим товар:

```ts
const cachedProduct =
  productCache.get(1);
```

Тип результата:

```ts
Product | undefined
```

Поэтому отсутствие значения необходимо учитывать:

```ts
if (cachedProduct) {
  console.log(cachedProduct.title);
}
```

---

### Метод `getOrSet`

```ts
const productFromCache =
  productCache.getOrSet(
    2,
    () => ({
      id: 2,
      title: "Мышь",
      price: 3500,
      categoryId: "mice",
      available: true,
    }),
  );
```

Если ключ `2` уже существует, фабрика не вызывается.

Если ключ отсутствует:

1. вызывается функция-фабрика;
2. создаётся значение;
3. значение помещается в кэш;
4. значение возвращается из метода.

---

### Кэш строковых значений

Один и тот же класс можно использовать с другими типами:

```ts
const settingsCache =
  new Cache<string, boolean>();

settingsCache.set("darkMode", true);

console.log(
  settingsCache.get("darkMode"),
);
```

Ключ имеет тип `string`, а значение — `boolean`.

---

## Задание 6. Параметры типов по умолчанию

### Стандартная метаинформация

```ts
type DefaultPaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
```

### Универсальный постраничный ответ

```ts
type PaginatedResponse<
  TItem,
  TMeta = DefaultPaginationMeta,
> = {
  items: TItem[];
  meta: TMeta;
};
```

Параметр `TItem` является обязательным.

Параметр `TMeta` имеет значение по умолчанию:

```ts
DefaultPaginationMeta
```

---

### Стандартная пагинация

```ts
type ProductPage =
  PaginatedResponse<Product>;
```

Создадим страницу товаров:

```ts
const productPage: ProductPage = {
  items: [
    {
      id: 1,
      title: "Клавиатура",
      price: 7500,
      categoryId: "keyboards",
      available: true,
    },
    {
      id: 2,
      title: "Мышь",
      price: 3500,
      categoryId: "mice",
      available: true,
    },
  ],
  meta: {
    page: 1,
    pageSize: 10,
    total: 2,
    totalPages: 1,
  },
};
```

Поскольку второй параметр не передан, используется стандартный тип метаданных.

---

### Собственная структура метаданных

Некоторые API используют курсор вместо номера страницы.

```ts
type CursorPaginationMeta = {
  nextCursor: string | null;
  hasMore: boolean;
};
```

Передадим собственный тип:

```ts
type CursorProductPage =
  PaginatedResponse<
    Product,
    CursorPaginationMeta
  >;
```

Создадим значение:

```ts
const cursorProductPage:
  CursorProductPage = {
    items: [
      {
        id: 3,
        title: "Монитор",
        price: 32000,
        categoryId: "monitors",
        available: true,
      },
    ],
    meta: {
      nextCursor: "product-3",
      hasMore: true,
    },
  };
```

В этом случае стандартный тип метаданных не используется.

---

## Задание 7. Плохие дженерики

### Пример 1. Небезопасный `parse<T>`

Исходная сигнатура:

```ts
function parse<T>(text: string): T;
```

Параметр `T` используется только в возвращаемом типе и никак не связан со входными данными.

Вызывающий код может потребовать любой результат:

```ts
const product =
  parse<Product>("null");
```

TypeScript поверит, что результат является `Product`, хотя реальное значение может быть любым.

Более безопасные варианты:

* возвращать `unknown`;
* проверять результат после `JSON.parse`;
* принимать функцию-валидатор;
* использовать библиотеку runtime-валидации.

Например, функция может возвращать:

```ts
unknown
```

А конкретный тип должен быть подтверждён отдельной проверкой.

---

### Пример 2. Бесполезный параметр типа

Исходная сигнатура:

```ts
function length<
  T extends { length: number },
>(
  value: T,
): number;
```

Функция использует только свойство `length` и возвращает обычное число.

Полный тип `T` нигде больше не применяется.

Следовательно, никакой связи между типами не сохраняется.

Достаточно обычного параметра:

```ts
value: { length: number }
```

Дженерик понадобился бы, если бы функция возвращала исходное значение или связывала его с другой частью контракта.

---

### Пример 3. Слишком много параметров типов

Исходная сигнатура:

```ts
function process<
  T,
  U,
  V,
  W,
  X,
  Y,
  Z
>(...);
```

Большое количество параметров типов не является автоматической ошибкой.

Однако такая сигнатура часто указывает на проблемы проектирования:

* функция выполняет слишком много обязанностей;
* параметры имеют неинформативные названия;
* связанные параметры можно объединить;
* API трудно читать и использовать;
* разработчику сложно понять назначение каждого типа.

Вместо однобуквенных названий лучше использовать понятные:

```text
TInput
TOutput
TError
TContext
```

Часть параметров можно объединить в именованный интерфейс конфигурации.

Саму функцию можно разделить на несколько меньших функций.

Каждый параметр типа должен выражать отдельную полезную связь.

---

# Полный код решения

```ts
export {};

interface Entity<TId> {
  readonly id: TId;
}

interface Product extends Entity<number> {
  title: string;
  price: number;
  categoryId: string;
  available: boolean;
}

interface Category extends Entity<string> {
  title: string;
  description: string;
}

class Repository<
  TEntity extends Entity<TId>,
  TId = string,
> {
  private readonly items =
    new Map<TId, TEntity>();

  save(entity: TEntity): void {
    this.items.set(entity.id, entity);
  }

  findById(id: TId): TEntity | undefined {
    return this.items.get(id);
  }

  findAll(): TEntity[] {
    return [...this.items.values()];
  }

  remove(id: TId): boolean {
    return this.items.delete(id);
  }

  has(id: TId): boolean {
    return this.items.has(id);
  }
}

function getProperty<
  T,
  K extends keyof T,
>(
  object: T,
  key: K,
): T[K] {
  return object[key];
}

function setProperty<
  T,
  K extends keyof T,
>(
  object: T,
  key: K,
  value: T[K],
): T {
  return {
    ...object,
    [key]: value,
  };
}

type ApiSuccess<TData> = {
  status: "success";
  data: TData;
};

type ApiFailure = {
  status: "error";
  message: string;
  code: number;
};

type ApiResponse<TData> =
  | ApiSuccess<TData>
  | ApiFailure;

function printApiResponse<TData>(
  response: ApiResponse<TData>,
): void {
  if (response.status === "success") {
    console.log(response.data);
    return;
  }

  console.log(
    `Ошибка ${response.code}: ${response.message}`,
  );
}

class Cache<TKey, TValue> {
  private readonly items =
    new Map<TKey, TValue>();

  set(
    key: TKey,
    value: TValue,
  ): void {
    this.items.set(key, value);
  }

  get(
    key: TKey,
  ): TValue | undefined {
    return this.items.get(key);
  }

  delete(key: TKey): boolean {
    return this.items.delete(key);
  }

  has(key: TKey): boolean {
    return this.items.has(key);
  }

  getOrSet(
    key: TKey,
    factory: () => TValue,
  ): TValue {
    const existingValue =
      this.items.get(key);

    if (existingValue !== undefined) {
      return existingValue;
    }

    const newValue = factory();

    this.items.set(key, newValue);

    return newValue;
  }
}

type DefaultPaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type PaginatedResponse<
  TItem,
  TMeta = DefaultPaginationMeta,
> = {
  items: TItem[];
  meta: TMeta;
};

type CursorPaginationMeta = {
  nextCursor: string | null;
  hasMore: boolean;
};

const productRepository =
  new Repository<Product, number>();

const categoryRepository =
  new Repository<Category>();

const keyboardCategory: Category = {
  id: "keyboards",
  title: "Клавиатуры",
  description:
    "Механические и мембранные клавиатуры",
};

const mouseCategory: Category = {
  id: "mice",
  title: "Компьютерные мыши",
  description:
    "Проводные и беспроводные мыши",
};

categoryRepository.save(
  keyboardCategory,
);

categoryRepository.save(
  mouseCategory,
);

const keyboard: Product = {
  id: 1,
  title: "Клавиатура",
  price: 7500,
  categoryId: "keyboards",
  available: true,
};

const mouse: Product = {
  id: 2,
  title: "Мышь",
  price: 3500,
  categoryId: "mice",
  available: true,
};

productRepository.save(keyboard);
productRepository.save(mouse);

console.log(
  "Все товары:",
  productRepository.findAll(),
);

console.log(
  "Товар с id 1:",
  productRepository.findById(1),
);

console.log(
  "Существует товар с id 2:",
  productRepository.has(2),
);

console.log(
  "Все категории:",
  categoryRepository.findAll(),
);

const keyboardTitle =
  getProperty(
    keyboard,
    "title",
  );

const keyboardPrice =
  getProperty(
    keyboard,
    "price",
  );

console.log(
  "Название:",
  keyboardTitle,
);

console.log(
  "Цена:",
  keyboardPrice,
);

const discountedKeyboard =
  setProperty(
    keyboard,
    "price",
    6990,
  );

const unavailableKeyboard =
  setProperty(
    discountedKeyboard,
    "available",
    false,
  );

console.log(
  "Исходный товар:",
  keyboard,
);

console.log(
  "Обновлённый товар:",
  unavailableKeyboard,
);

// Ожидаемые ошибки TypeScript:

// @ts-expect-error:
// свойства discount нет у Product
getProperty(
  keyboard,
  "discount",
);

// @ts-expect-error:
// price ожидает number
setProperty(
  keyboard,
  "price",
  "6990",
);

// @ts-expect-error:
// available ожидает boolean
setProperty(
  keyboard,
  "available",
  "да",
);

const productsResponse:
  ApiResponse<Product[]> = {
    status: "success",
    data: productRepository.findAll(),
  };

const categoriesResponse:
  ApiResponse<Category[]> = {
    status: "success",
    data: categoryRepository.findAll(),
  };

const errorResponse:
  ApiResponse<Product[]> = {
    status: "error",
    message:
      "Не удалось загрузить каталог",
    code: 500,
  };

printApiResponse(productsResponse);
printApiResponse(categoriesResponse);
printApiResponse(errorResponse);

const productCache =
  new Cache<number, Product>();

productCache.set(
  keyboard.id,
  keyboard,
);

console.log(
  "Товар из кэша:",
  productCache.get(1),
);

const cachedMouse =
  productCache.getOrSet(
    mouse.id,
    () => mouse,
  );

console.log(
  "Созданное значение:",
  cachedMouse,
);

const secondCachedMouse =
  productCache.getOrSet(
    mouse.id,
    () => ({
      id: mouse.id,
      title: "Другое значение",
      price: 1,
      categoryId: "other",
      available: false,
    }),
  );

console.log(
  "Существующее значение:",
  secondCachedMouse,
);

console.log(
  "Кэш содержит ключ 2:",
  productCache.has(2),
);

console.log(
  "Удаление ключа 2:",
  productCache.delete(2),
);

console.log(
  "Кэш содержит ключ 2:",
  productCache.has(2),
);

const productPage:
  PaginatedResponse<Product> = {
    items:
      productRepository.findAll(),
    meta: {
      page: 1,
      pageSize: 10,
      total: 2,
      totalPages: 1,
    },
  };

console.log(
  "Стандартная пагинация:",
  productPage,
);

const cursorProductPage:
  PaginatedResponse<
    Product,
    CursorPaginationMeta
  > = {
    items: [
      {
        id: 3,
        title: "Монитор",
        price: 32000,
        categoryId: "monitors",
        available: true,
      },
    ],
    meta: {
      nextCursor: "product-3",
      hasMore: true,
    },
  };

console.log(
  "Курсорная пагинация:",
  cursorProductPage,
);
```

## Пример результата

```text
Все товары: [
  {
    id: 1,
    title: "Клавиатура",
    price: 7500,
    categoryId: "keyboards",
    available: true
  },
  {
    id: 2,
    title: "Мышь",
    price: 3500,
    categoryId: "mice",
    available: true
  }
]

Товар с id 1: {
  id: 1,
  title: "Клавиатура",
  price: 7500,
  categoryId: "keyboards",
  available: true
}

Существует товар с id 2: true

Название: Клавиатура
Цена: 7500

Исходный товар: {
  id: 1,
  title: "Клавиатура",
  price: 7500,
  categoryId: "keyboards",
  available: true
}

Обновлённый товар: {
  id: 1,
  title: "Клавиатура",
  price: 6990,
  categoryId: "keyboards",
  available: false
}

Товар из кэша: {
  id: 1,
  title: "Клавиатура",
  price: 7500,
  categoryId: "keyboards",
  available: true
}

Кэш содержит ключ 2: true
Удаление ключа 2: true
Кэш содержит ключ 2: false

Стандартная пагинация: {
  items: [...],
  meta: {
    page: 1,
    pageSize: 10,
    total: 2,
    totalPages: 1
  }
}

Курсорная пагинация: {
  items: [...],
  meta: {
    nextCursor: "product-3",
    hasMore: true
  }
}
```
