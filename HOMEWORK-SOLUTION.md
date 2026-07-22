# Домашнее задание. Решение

## Контрольные вопросы

### 1. Чем `Partial<T>` отличается от `Required<T>`?

`Partial<T>` делает все свойства исходного типа необязательными.

```ts
type User = {
  id: number;
  name: string;
  email: string;
};

type PartialUser =
  Partial<User>;
```

Получится тип:

```ts
type PartialUser = {
  id?: number;
  name?: string;
  email?: string;
};
```

Объект может содержать только часть свойств:

```ts
const userDraft:
  PartialUser = {
    name: "Анна",
  };
```

`Required<T>` выполняет противоположное преобразование.

Он делает все свойства обязательными.

```ts
type UserDraft = {
  id?: number;
  name?: string;
  email?: string;
};

type CompleteUser =
  Required<UserDraft>;
```

Получится:

```ts
type CompleteUser = {
  id: number;
  name: string;
  email: string;
};
```

Основное отличие:

* `Partial<T>` добавляет необязательность;
* `Required<T>` удаляет необязательность;
* оба utility type сохраняют исходные типы значений свойств.

---

### 2. Почему `Readonly<T>` не делает вложенные объекты полностью неизменяемыми?

`Readonly<T>` выполняет только поверхностное преобразование.

Рассмотрим тип:

```ts
type Product = {
  title: string;
  details: {
    weight: number;
  };
  tags: string[];
};
```

Применим `Readonly`:

```ts
type ReadonlyProduct =
  Readonly<Product>;
```

Теперь нельзя заменить свойства верхнего уровня:

```ts
const product:
  ReadonlyProduct = {
    title: "Клавиатура",
    details: {
      weight: 800,
    },
    tags: [
      "electronics",
    ],
  };
```

Следующая операция запрещена:

```ts
// Ошибка TypeScript:
// product.title = "Мышь";
```

Нельзя заменить объект `details` целиком:

```ts
// Ошибка TypeScript:
// product.details = {
//   weight: 500,
// };
```

Но свойства внутри `details` не стали `readonly`:

```ts
product.details.weight = 900;
```

Массив тоже остаётся изменяемым:

```ts
product.tags.push(
  "computer",
);
```

`Readonly<T>` добавляет `readonly` только к свойствам самого объекта.

Для полной рекурсивной неизменяемости нужен отдельный тип, например `DeepReadonly<T>`.

---

### 3. Когда удобнее использовать `Pick<T, K>`, а когда `Omit<T, K>`?

`Pick<T, K>` выбирает указанные свойства исходного типа.

```ts
type Product = {
  id: number;
  title: string;
  price: number;
  costPrice: number;
  description: string;
};
```

Если нужны только три свойства, удобно использовать `Pick`:

```ts
type ProductListItem =
  Pick<
    Product,
    "id" | "title" | "price"
  >;
```

Результат:

```ts
type ProductListItem = {
  id: number;
  title: string;
  price: number;
};
```

`Omit<T, K>` исключает указанные свойства.

Если нужно оставить почти весь объект и удалить только одно поле, удобнее использовать `Omit`:

```ts
type PublicProduct =
  Omit<Product, "costPrice">;
```

Результат:

```ts
type PublicProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
};
```

Правило выбора:

* `Pick` удобен, когда нужно оставить небольшое количество свойств;
* `Omit` удобен, когда нужно исключить небольшое количество свойств;
* следует выбирать вариант, который яснее показывает структуру нового типа.

---

### 4. Чем `Omit<T, K>` отличается от `Exclude<T, U>`?

`Omit<T, K>` работает с объектными типами.

Он удаляет свойства объекта.

```ts
type Product = {
  id: number;
  title: string;
  price: number;
};

type ProductWithoutId =
  Omit<Product, "id">;
```

Результат:

```ts
type ProductWithoutId = {
  title: string;
  price: number;
};
```

`Exclude<T, U>` работает с объединениями типов.

Он удаляет из объединения указанные варианты.

```ts
type ProductStatus =
  | "draft"
  | "published"
  | "archived";

type ActiveProductStatus =
  Exclude<
    ProductStatus,
    "archived"
  >;
```

Результат:

```ts
type ActiveProductStatus =
  | "draft"
  | "published";
```

Основное отличие:

* `Omit` исключает ключи объекта;
* `Exclude` исключает варианты из union;
* результатом `Omit` является объектный тип;
* результатом `Exclude` является новое объединение.

---

### 5. Для чего используется `Record<K, V>`?

`Record<K, V>` создаёт объектный тип с заданным набором ключей.

Первый параметр определяет ключи объекта.

Второй параметр определяет тип значений.

```ts
type ProductStatus =
  | "draft"
  | "published"
  | "archived";
```

Создадим подписи для всех статусов:

```ts
const statusLabels:
  Record<
    ProductStatus,
    string
  > = {
    draft: "Черновик",
    published:
      "Опубликован",
    archived: "В архиве",
  };
```

TypeScript проверяет:

* наличие всех ключей;
* отсутствие неизвестных ключей;
* тип каждого значения.

Если пропустить один статус, возникнет ошибка:

```ts
// Ошибка TypeScript:
// const incompleteLabels:
//   Record<
//     ProductStatus,
//     string
//   > = {
//     draft: "Черновик",
//     published:
//       "Опубликован",
//   };
```

`Record` удобно использовать для:

* словарей;
* таблиц соответствий;
* настроек;
* обработчиков;
* исчерпывающего описания всех вариантов union.

---

### 6. Чем `Extract<T, U>` отличается от `Exclude<T, U>`?

`Exclude<T, U>` удаляет из объединения варианты, совместимые с `U`.

```ts
type Status =
  | "draft"
  | "published"
  | "archived";

type NotArchived =
  Exclude<
    Status,
    "archived"
  >;
```

Результат:

```ts
type NotArchived =
  | "draft"
  | "published";
```

`Extract<T, U>` оставляет только варианты, совместимые с `U`.

```ts
type FinalStatus =
  Extract<
    Status,
    | "published"
    | "archived"
  >;
```

Результат:

```ts
type FinalStatus =
  | "published"
  | "archived";
```

Разница:

* `Exclude` удаляет совпадающие варианты;
* `Extract` сохраняет совпадающие варианты.

---

### 7. Что удаляет `NonNullable<T>`?

`NonNullable<T>` удаляет из объединения:

```ts
null
```

и:

```ts
undefined
```

Пример:

```ts
type Product = {
  id: number;
  title: string;
};

type SearchResult =
  | Product
  | null
  | undefined;
```

Применим `NonNullable`:

```ts
type ExistingProduct =
  NonNullable<SearchResult>;
```

Результат:

```ts
type ExistingProduct =
  Product;
```

Теперь `null` и `undefined` использовать нельзя:

```ts
const product:
  ExistingProduct = {
    id: 1,
    title: "Клавиатура",
  };
```

```ts
// Ошибка TypeScript:
// const missingProduct:
//   ExistingProduct = null;
```

`NonNullable<T>` не делает свойства объекта обязательными.

Он удаляет `null` и `undefined` только из самого переданного объединения.

---

### 8. Чем `Parameters<T>` отличается от `ReturnType<T>`?

`Parameters<T>` получает типы параметров функции.

Результатом является кортеж.

```ts
function createProduct(
  title: string,
  price: number,
): {
  id: number;
  title: string;
  price: number;
} {
  return {
    id: 1,
    title,
    price,
  };
}
```

Получим параметры:

```ts
type CreateProductParameters =
  Parameters<
    typeof createProduct
  >;
```

Результат:

```ts
type CreateProductParameters = [
  title: string,
  price: number,
];
```

`ReturnType<T>` получает тип возвращаемого значения.

```ts
type CreatedProduct =
  ReturnType<
    typeof createProduct
  >;
```

Результат:

```ts
type CreatedProduct = {
  id: number;
  title: string;
  price: number;
};
```

Основное отличие:

* `Parameters<T>` получает входные параметры;
* `ReturnType<T>` получает результат функции.

---

### 9. Для чего используются `ConstructorParameters<T>` и `InstanceType<T>`?

`ConstructorParameters<T>` получает параметры конструктора класса.

```ts
class Product {
  constructor(
    public readonly id: number,
    public title: string,
  ) {}
}
```

Получим параметры конструктора:

```ts
type ProductConstructorParameters =
  ConstructorParameters<
    typeof Product
  >;
```

Результат:

```ts
type ProductConstructorParameters = [
  id: number,
  title: string,
];
```

`InstanceType<T>` получает тип экземпляра, создаваемого конструктором.

```ts
type ProductInstance =
  InstanceType<
    typeof Product
  >;
```

Результат:

```ts
type ProductInstance =
  Product;
```

Важно различать:

```ts
typeof Product
```

Это тип конструктора класса.

```ts
Product
```

Это тип экземпляра класса.

---

### 10. Чем `ReturnType<T>` отличается от `Awaited<ReturnType<T>>`?

Рассмотрим асинхронную функцию:

```ts
async function loadProducts():
  Promise<string[]> {
  return [
    "Клавиатура",
    "Мышь",
  ];
}
```

`ReturnType` получает полный возвращаемый тип функции:

```ts
type LoadProductsReturn =
  ReturnType<
    typeof loadProducts
  >;
```

Результат:

```ts
type LoadProductsReturn =
  Promise<string[]>;
```

`Awaited` извлекает значение из `Promise`:

```ts
type LoadedProducts =
  Awaited<
    ReturnType<
      typeof loadProducts
    >
  >;
```

Результат:

```ts
type LoadedProducts =
  string[];
```

Разница:

* `ReturnType` сохраняет `Promise`;
* `Awaited<ReturnType<...>>` получает тип значения после выполнения `Promise`.

---

# Практическое задание

## Задание 1. Модель товара

Сначала создадим типы статуса и категории.

```ts
type ProductStatus =
  | "draft"
  | "published"
  | "archived";

type ProductCategory =
  | "electronics"
  | "clothing"
  | "books";
```

Теперь опишем модель товара:

```ts
type Product = {
  readonly id: number;
  title: string;
  description: string;
  price: number;
  costPrice: number;
  status: ProductStatus;
  category: ProductCategory;
  imageUrl?: string;
  readonly createdAt: Date;
};
```

Пример товара:

```ts
const keyboard: Product = {
  id: 1,
  title: "Клавиатура",
  description:
    "Механическая клавиатура",
  price: 7500,
  costPrice: 4800,
  status: "published",
  category: "electronics",
  imageUrl:
    "/images/keyboard.jpg",
  createdAt: new Date(),
};
```

---

## Задание 2. Товар для списка

Для списка нужны только отдельные свойства товара.

Используем `Pick`:

```ts
type ProductListItem =
  Pick<
    Product,
    | "id"
    | "title"
    | "price"
    | "status"
    | "imageUrl"
  >;
```

Получится тип:

```ts
type ProductListItemEquivalent = {
  readonly id: number;
  title: string;
  price: number;
  status: ProductStatus;
  imageUrl?: string;
};
```

Пример объекта:

```ts
const productListItem:
  ProductListItem = {
    id: 1,
    title: "Клавиатура",
    price: 7500,
    status: "published",
    imageUrl:
      "/images/keyboard.jpg",
  };
```

Свойства `description`, `costPrice`, `category` и `createdAt` в этом типе отсутствуют.

---

## Задание 3. Публичная модель товара

В публичной модели нужно удалить внутреннюю себестоимость.

Используем `Omit`:

```ts
type PublicProduct =
  Omit<
    Product,
    "costPrice"
  >;
```

Пример объекта:

```ts
const publicProduct:
  PublicProduct = {
    id: 1,
    title: "Клавиатура",
    description:
      "Механическая клавиатура",
    price: 7500,
    status: "published",
    category: "electronics",
    imageUrl:
      "/images/keyboard.jpg",
    createdAt: new Date(),
  };
```

Передать `costPrice` нельзя:

```ts
// Ошибка TypeScript:
// const wrongPublicProduct:
//   PublicProduct = {
//     id: 1,
//     title: "Клавиатура",
//     description:
//       "Механическая клавиатура",
//     price: 7500,
//     costPrice: 4800,
//     status: "published",
//     category: "electronics",
//     createdAt: new Date(),
//   };
```

---

## Задание 4. Команда добавления товара

При создании товара клиент не передаёт:

* `id`;
* `createdAt`;
* `status`.

Удалим эти свойства:

```ts
type CreateProductCommand =
  Omit<
    Product,
    | "id"
    | "createdAt"
    | "status"
  >;
```

Пример команды:

```ts
const createProductCommand:
  CreateProductCommand = {
    title: "Мышь",
    description:
      "Беспроводная мышь",
    price: 3200,
    costPrice: 1900,
    category: "electronics",
    imageUrl:
      "/images/mouse.jpg",
  };
```

Следующая команда вызовет ошибку, потому что `id` отсутствует в `CreateProductCommand`:

```ts
// Ошибка TypeScript:
// const wrongCreateCommand:
//   CreateProductCommand = {
//     id: 2,
//     title: "Мышь",
//     description:
//       "Беспроводная мышь",
//     price: 3200,
//     costPrice: 1900,
//     category: "electronics",
//   };
```

---

## Задание 5. Команда обновления товара

Сначала выберем разрешённые для изменения свойства:

```ts
type EditableProductFields =
  Pick<
    Product,
    | "title"
    | "description"
    | "price"
    | "category"
    | "imageUrl"
  >;
```

Теперь сделаем их необязательными:

```ts
type ProductUpdatePatch =
  Partial<
    EditableProductFields
  >;
```

Добавим обязательный идентификатор товара:

```ts
type UpdateProductCommand = {
  productId: Product["id"];
} & ProductUpdatePatch;
```

Пример изменения названия:

```ts
const updateTitle:
  UpdateProductCommand = {
    productId: 1,
    title:
      "Игровая клавиатура",
  };
```

Пример изменения цены:

```ts
const updatePrice:
  UpdateProductCommand = {
    productId: 1,
    price: 6900,
  };
```

Пример изменения нескольких полей:

```ts
const updateSeveralFields:
  UpdateProductCommand = {
    productId: 1,
    title:
      "Компактная клавиатура",
    description:
      "Механическая клавиатура без цифрового блока",
    price: 7100,
    category: "electronics",
    imageUrl:
      "/images/compact-keyboard.jpg",
  };
```

Попытка изменить `costPrice` вызовет ошибку:

```ts
// Ошибка TypeScript:
// const wrongCostPriceUpdate:
//   UpdateProductCommand = {
//     productId: 1,
//     costPrice: 3000,
//   };
```

Изменить статус тоже нельзя:

```ts
// Ошибка TypeScript:
// const wrongStatusUpdate:
//   UpdateProductCommand = {
//     productId: 1,
//     status: "archived",
//   };
```

---

## Задание 6. Полностью заполненная модель

Применим `Required`:

```ts
type CompleteProduct =
  Required<Product>;
```

Теперь `imageUrl` является обязательным свойством:

```ts
const completeProduct:
  CompleteProduct = {
    id: 1,
    title: "Клавиатура",
    description:
      "Механическая клавиатура",
    price: 7500,
    costPrice: 4800,
    status: "published",
    category: "electronics",
    imageUrl:
      "/images/keyboard.jpg",
    createdAt: new Date(),
  };
```

Пропустить `imageUrl` нельзя:

```ts
// Ошибка TypeScript:
// const incompleteProduct:
//   CompleteProduct = {
//     id: 1,
//     title: "Клавиатура",
//     description:
//       "Механическая клавиатура",
//     price: 7500,
//     costPrice: 4800,
//     status: "published",
//     category: "electronics",
//     createdAt: new Date(),
//   };
```

Рассмотрим отдельный пример:

```ts
type ProductWithUndefinedImage = {
  imageUrl?:
    string | undefined;
};
```

Применим `Required`:

```ts
type CompleteImage =
  Required<
    ProductWithUndefinedImage
  >;
```

Свойство становится обязательным:

```ts
const image:
  CompleteImage = {
    imageUrl: undefined,
  };
```

Это допустимо, потому что `Required` убирает только знак `?`.

Явно указанный `undefined` остаётся частью типа значения.

---

## Задание 7. Модель только для чтения

Используем `Readonly`:

```ts
type ProductSnapshot =
  Readonly<Product>;
```

Создадим снимок товара:

```ts
const productSnapshot:
  ProductSnapshot = {
    id: 1,
    title: "Клавиатура",
    description:
      "Механическая клавиатура",
    price: 7500,
    costPrice: 4800,
    status: "published",
    category: "electronics",
    imageUrl:
      "/images/keyboard.jpg",
    createdAt: new Date(),
  };
```

Изменять свойства нельзя:

```ts
// Ошибка TypeScript:
// productSnapshot.title =
//   "Новая клавиатура";
```

```ts
// Ошибка TypeScript:
// productSnapshot.price =
//   8000;
```

```ts
// Ошибка TypeScript:
// productSnapshot.status =
//   "archived";
```

Важно помнить, что `Readonly` работает только на верхнем уровне объекта.

---

## Задание 8. Подписи для статусов

Тип статуса можно получить непосредственно из `Product`:

```ts
type ProductStatusFromModel =
  Product["status"];
```

Он эквивалентен:

```ts
type ProductStatusFromModel =
  | "draft"
  | "published"
  | "archived";
```

Создадим карту подписей:

```ts
const productStatusLabels:
  Record<
    ProductStatusFromModel,
    string
  > = {
    draft: "Черновик",
    published:
      "Опубликован",
    archived: "В архиве",
  };
```

Если пропустить ключ, TypeScript покажет ошибку:

```ts
// Ошибка TypeScript:
// const incompleteStatusLabels:
//   Record<
//     ProductStatusFromModel,
//     string
//   > = {
//     draft: "Черновик",
//     published:
//       "Опубликован",
//   };
```

Неизвестный ключ тоже запрещён:

```ts
// Ошибка TypeScript:
// const wrongStatusLabels:
//   Record<
//     ProductStatusFromModel,
//     string
//   > = {
//     draft: "Черновик",
//     published:
//       "Опубликован",
//     archived: "В архиве",
//     deleted: "Удалён",
//   };
```

---

## Задание 9. Настройки отображения категорий

Получим тип категории:

```ts
type ProductCategoryFromModel =
  Product["category"];
```

Опишем значение настройки:

```ts
type CategorySetting = {
  title: string;
  icon: string;
};
```

Теперь создадим словарь:

```ts
type CategorySettings =
  Record<
    ProductCategoryFromModel,
    CategorySetting
  >;
```

Реализация:

```ts
const categorySettings:
  CategorySettings = {
    electronics: {
      title: "Электроника",
      icon: "monitor",
    },
    clothing: {
      title: "Одежда",
      icon: "shirt",
    },
    books: {
      title: "Книги",
      icon: "book",
    },
  };
```

TypeScript требует настройку для каждой категории.

---

## Задание 10. Статусы через `Exclude` и `Extract`

Удалим статус `"archived"`:

```ts
type VisibleProductStatus =
  Exclude<
    ProductStatus,
    "archived"
  >;
```

Результат:

```ts
type VisibleProductStatus =
  | "draft"
  | "published";
```

Проверка:

```ts
const draftStatus:
  VisibleProductStatus =
    "draft";

const publishedStatus:
  VisibleProductStatus =
    "published";
```

Архивный статус использовать нельзя:

```ts
// Ошибка TypeScript:
// const archivedVisibleStatus:
//   VisibleProductStatus =
//     "archived";
```

Теперь оставим только финальные статусы:

```ts
type FinalProductStatus =
  Extract<
    ProductStatus,
    | "published"
    | "archived"
  >;
```

Результат:

```ts
type FinalProductStatus =
  | "published"
  | "archived";
```

Проверка:

```ts
const finalPublished:
  FinalProductStatus =
    "published";

const finalArchived:
  FinalProductStatus =
    "archived";
```

`"draft"` не входит в этот тип:

```ts
// Ошибка TypeScript:
// const wrongFinalStatus:
//   FinalProductStatus =
//     "draft";
```

---

## Задание 11. Команда публикации товара

Тип идентификатора получаем из модели:

```ts
type ProductId =
  Product["id"];
```

Из статусов удаляем `"draft"`:

```ts
type PublishableStatus =
  Exclude<
    Product["status"],
    "draft"
  >;
```

Создаём команду:

```ts
type PublishProductCommand = {
  productId: ProductId;
  status: PublishableStatus;
};
```

Правильная команда:

```ts
const publishCommand:
  PublishProductCommand = {
    productId: 1,
    status: "published",
  };
```

Архивирование тоже допустимо:

```ts
const archiveCommand:
  PublishProductCommand = {
    productId: 1,
    status: "archived",
  };
```

Вернуть товар в статус черновика нельзя:

```ts
// Ошибка TypeScript:
// const draftCommand:
//   PublishProductCommand = {
//     productId: 1,
//     status: "draft",
//   };
```

---

## Задание 12. Удаление `null` и `undefined`

Исходный результат поиска:

```ts
type ProductSearchResult =
  | Product
  | null
  | undefined;
```

Удалим пустые значения:

```ts
type ExistingProduct =
  NonNullable<
    ProductSearchResult
  >;
```

Результат:

```ts
type ExistingProduct =
  Product;
```

Правильное значение:

```ts
const existingProduct:
  ExistingProduct = {
    id: 1,
    title: "Клавиатура",
    description:
      "Механическая клавиатура",
    price: 7500,
    costPrice: 4800,
    status: "published",
    category: "electronics",
    createdAt: new Date(),
  };
```

`null` использовать нельзя:

```ts
// Ошибка TypeScript:
// const nullProduct:
//   ExistingProduct = null;
```

`undefined` тоже запрещён:

```ts
// Ошибка TypeScript:
// const undefinedProduct:
//   ExistingProduct =
//     undefined;
```

---

## Задание 13. Типы функции создания товара

Создадим функцию:

```ts
function createProduct(
  command: CreateProductCommand,
): Product {
  return {
    id: Date.now(),
    title: command.title,
    description:
      command.description,
    price: command.price,
    costPrice:
      command.costPrice,
    status: "draft",
    category:
      command.category,
    imageUrl:
      command.imageUrl,
    createdAt: new Date(),
  };
}
```

Получим параметры функции:

```ts
type CreateProductParameters =
  Parameters<
    typeof createProduct
  >;
```

Результат является кортежем:

```ts
type CreateProductParametersEquivalent = [
  command:
    CreateProductCommand,
];
```

Создадим значение этого типа:

```ts
const createArguments:
  CreateProductParameters = [
    {
      title: "Мышь",
      description:
        "Беспроводная мышь",
      price: 3200,
      costPrice: 1900,
      category:
        "electronics",
    },
  ];
```

Теперь получим возвращаемый тип:

```ts
type CreatedProduct =
  ReturnType<
    typeof createProduct
  >;
```

Он эквивалентен `Product`.

```ts
const createdProduct:
  CreatedProduct =
    createProduct(
      createArguments[0],
    );
```

---

## Задание 14. Функция-обёртка

Создадим универсальную функцию:

```ts
function withLogging<
  TArguments extends unknown[],
  TResult,
>(
  fn: (
    ...args: TArguments
  ) => TResult,
): (
  ...args: TArguments
) => TResult {
  return (
    ...args: TArguments
  ): TResult => {
    console.log(
      "Аргументы:",
      args,
    );

    const result =
      fn(...args);

    console.log(
      "Результат:",
      result,
    );

    return result;
  };
}
```

Применим её к `createProduct`:

```ts
const loggedCreateProduct =
  withLogging(createProduct);
```

Вызов:

```ts
const loggedProduct =
  loggedCreateProduct({
    title: "Монитор",
    description:
      "Монитор с диагональю 27 дюймов",
    price: 28000,
    costPrice: 21000,
    category: "electronics",
  });
```

Тип `loggedProduct`:

```ts
Product
```

TypeScript сохраняет сигнатуру исходной функции.

Неправильная команда вызовет ошибку:

```ts
// Ошибка TypeScript:
// loggedCreateProduct({
//   title: "Монитор",
//   price: "28000",
// });
```

---

## Задание 15. Типы конструктора

Создадим класс:

```ts
class ProductEntity {
  constructor(
    public readonly id: number,
    public title: string,
    public price: number,
    public status:
      ProductStatus,
  ) {}
}
```

Получим параметры конструктора:

```ts
type ProductEntityConstructorParameters =
  ConstructorParameters<
    typeof ProductEntity
  >;
```

Результат:

```ts
type ProductEntityConstructorParametersEquivalent = [
  id: number,
  title: string,
  price: number,
  status: ProductStatus,
];
```

Создадим переменную с аргументами:

```ts
const productEntityArguments:
  ProductEntityConstructorParameters = [
    1,
    "Клавиатура",
    7500,
    "published",
  ];
```

Получим тип экземпляра:

```ts
type ProductEntityInstance =
  InstanceType<
    typeof ProductEntity
  >;
```

Создадим экземпляр:

```ts
const productEntity:
  ProductEntityInstance =
    new ProductEntity(
      ...productEntityArguments,
    );
```

Тип `ProductEntityInstance` эквивалентен `ProductEntity`.

---

## Задание 16. Результат асинхронной функции

Создадим функцию загрузки товаров:

```ts
async function loadProducts():
  Promise<Product[]> {
  return [
    {
      id: 1,
      title: "Клавиатура",
      description:
        "Механическая клавиатура",
      price: 7500,
      costPrice: 4800,
      status: "published",
      category:
        "electronics",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Книга",
      description:
        "Учебник по TypeScript",
      price: 1800,
      costPrice: 900,
      status: "published",
      category: "books",
      createdAt: new Date(),
    },
  ];
}
```

Получим полный возвращаемый тип:

```ts
type LoadProductsReturn =
  ReturnType<
    typeof loadProducts
  >;
```

Результат:

```ts
type LoadProductsReturn =
  Promise<Product[]>;
```

Теперь извлечём внутреннее значение:

```ts
type LoadedProducts =
  Awaited<
    ReturnType<
      typeof loadProducts
    >
  >;
```

Результат:

```ts
type LoadedProducts =
  Product[];
```

Проверка:

```ts
async function runLoadExample():
  Promise<void> {
  const products:
    LoadedProducts =
      await loadProducts();

  console.log(products);
}
```

---

## Задание 17. Состояние каталога

Опишем состояние:

```ts
type CatalogState = {
  products: Product[];
  selectedProduct:
    Product | null;
  loading: boolean;
  error: string | null;
};
```

Создадим тип частичного обновления:

```ts
type CatalogStatePatch =
  Partial<CatalogState>;
```

Теперь реализуем функцию:

```ts
function updateCatalogState(
  current: CatalogState,
  patch: CatalogStatePatch,
): CatalogState {
  return {
    ...current,
    ...patch,
  };
}
```

Исходное состояние:

```ts
const initialCatalogState:
  CatalogState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  };
```

Начало загрузки:

```ts
const loadingCatalogState =
  updateCatalogState(
    initialCatalogState,
    {
      loading: true,
    },
  );
```

Завершение загрузки:

```ts
const loadedCatalogState =
  updateCatalogState(
    loadingCatalogState,
    {
      products: [
        keyboard,
      ],
      loading: false,
    },
  );
```

Выбор товара:

```ts
const selectedCatalogState =
  updateCatalogState(
    loadedCatalogState,
    {
      selectedProduct:
        keyboard,
    },
  );
```

Функция не изменяет исходный объект.

Она возвращает новый объект состояния.

---

## Задание 18. Добавление нового статуса

Расширим тип:

```ts
type ExtendedProductStatus =
  | "draft"
  | "published"
  | "archived"
  | "outOfStock";
```

Если заменить исходный `ProductStatus` на этот тип, автоматически обновятся:

```ts
Product["status"]
```

```ts
VisibleProductStatus
```

```ts
PublishableStatus
```

```ts
FinalProductStatus
```

```ts
PublishProductCommand
```

Объект, объявленный через `Record`, потребует новое значение:

```ts
const extendedStatusLabels:
  Record<
    ExtendedProductStatus,
    string
  > = {
    draft: "Черновик",
    published:
      "Опубликован",
    archived: "В архиве",
    outOfStock:
      "Нет в наличии",
  };
```

Если не добавить `outOfStock`, TypeScript покажет ошибку.

Это демонстрирует преимущество `Record`.

При расширении union компилятор помогает найти все исчерпывающие таблицы, которые необходимо обновить.

---

# Полный код решения

```ts
export {};

type ProductStatus =
  | "draft"
  | "published"
  | "archived";

type ProductCategory =
  | "electronics"
  | "clothing"
  | "books";

type Product = {
  readonly id: number;
  title: string;
  description: string;
  price: number;
  costPrice: number;
  status: ProductStatus;
  category: ProductCategory;
  imageUrl?: string;
  readonly createdAt: Date;
};

const keyboard: Product = {
  id: 1,
  title: "Клавиатура",
  description:
    "Механическая клавиатура",
  price: 7500,
  costPrice: 4800,
  status: "published",
  category: "electronics",
  imageUrl:
    "/images/keyboard.jpg",
  createdAt: new Date(),
};

type ProductListItem =
  Pick<
    Product,
    | "id"
    | "title"
    | "price"
    | "status"
    | "imageUrl"
  >;

const productListItem:
  ProductListItem = {
    id: 1,
    title: "Клавиатура",
    price: 7500,
    status: "published",
    imageUrl:
      "/images/keyboard.jpg",
  };

type PublicProduct =
  Omit<
    Product,
    "costPrice"
  >;

const publicProduct:
  PublicProduct = {
    id: 1,
    title: "Клавиатура",
    description:
      "Механическая клавиатура",
    price: 7500,
    status: "published",
    category: "electronics",
    imageUrl:
      "/images/keyboard.jpg",
    createdAt: new Date(),
  };

type CreateProductCommand =
  Omit<
    Product,
    | "id"
    | "createdAt"
    | "status"
  >;

const createProductCommand:
  CreateProductCommand = {
    title: "Мышь",
    description:
      "Беспроводная мышь",
    price: 3200,
    costPrice: 1900,
    category: "electronics",
    imageUrl:
      "/images/mouse.jpg",
  };

type EditableProductFields =
  Pick<
    Product,
    | "title"
    | "description"
    | "price"
    | "category"
    | "imageUrl"
  >;

type ProductUpdatePatch =
  Partial<
    EditableProductFields
  >;

type UpdateProductCommand = {
  productId: Product["id"];
} & ProductUpdatePatch;

const updateTitle:
  UpdateProductCommand = {
    productId: 1,
    title:
      "Игровая клавиатура",
  };

const updatePrice:
  UpdateProductCommand = {
    productId: 1,
    price: 6900,
  };

const updateSeveralFields:
  UpdateProductCommand = {
    productId: 1,
    title:
      "Компактная клавиатура",
    description:
      "Клавиатура без цифрового блока",
    price: 7100,
    category: "electronics",
    imageUrl:
      "/images/compact-keyboard.jpg",
  };

type CompleteProduct =
  Required<Product>;

const completeProduct:
  CompleteProduct = {
    id: 1,
    title: "Клавиатура",
    description:
      "Механическая клавиатура",
    price: 7500,
    costPrice: 4800,
    status: "published",
    category: "electronics",
    imageUrl:
      "/images/keyboard.jpg",
    createdAt: new Date(),
};

type ProductWithUndefinedImage = {
  imageUrl?:
    string | undefined;
};

type CompleteImage =
  Required<
    ProductWithUndefinedImage
  >;

const completeImage:
  CompleteImage = {
    imageUrl: undefined,
  };

type ProductSnapshot =
  Readonly<Product>;

const productSnapshot:
  ProductSnapshot = {
    ...keyboard,
  };

type ProductStatusFromModel =
  Product["status"];

const productStatusLabels:
  Record<
    ProductStatusFromModel,
    string
  > = {
    draft: "Черновик",
    published:
      "Опубликован",
    archived: "В архиве",
  };

type ProductCategoryFromModel =
  Product["category"];

type CategorySetting = {
  title: string;
  icon: string;
};

type CategorySettings =
  Record<
    ProductCategoryFromModel,
    CategorySetting
  >;

const categorySettings:
  CategorySettings = {
    electronics: {
      title: "Электроника",
      icon: "monitor",
    },
    clothing: {
      title: "Одежда",
      icon: "shirt",
    },
    books: {
      title: "Книги",
      icon: "book",
    },
  };

type VisibleProductStatus =
  Exclude<
    ProductStatus,
    "archived"
  >;

type FinalProductStatus =
  Extract<
    ProductStatus,
    | "published"
    | "archived"
  >;

const visibleStatus:
  VisibleProductStatus =
    "published";

const finalStatus:
  FinalProductStatus =
    "archived";

type PublishProductCommand = {
  productId: Product["id"];
  status: Exclude<
    Product["status"],
    "draft"
  >;
};

const publishCommand:
  PublishProductCommand = {
    productId: 1,
    status: "published",
  };

type ProductSearchResult =
  | Product
  | null
  | undefined;

type ExistingProduct =
  NonNullable<
    ProductSearchResult
  >;

const existingProduct:
  ExistingProduct = keyboard;

function createProduct(
  command: CreateProductCommand,
): Product {
  return {
    id: Date.now(),
    title: command.title,
    description:
      command.description,
    price: command.price,
    costPrice:
      command.costPrice,
    status: "draft",
    category:
      command.category,
    imageUrl:
      command.imageUrl,
    createdAt: new Date(),
  };
}

type CreateProductParameters =
  Parameters<
    typeof createProduct
  >;

type CreatedProduct =
  ReturnType<
    typeof createProduct
  >;

const createArguments:
  CreateProductParameters = [
    createProductCommand,
  ];

const createdProduct:
  CreatedProduct =
    createProduct(
      createArguments[0],
    );

function withLogging<
  TArguments extends unknown[],
  TResult,
>(
  fn: (
    ...args: TArguments
  ) => TResult,
): (
  ...args: TArguments
) => TResult {
  return (
    ...args: TArguments
  ): TResult => {
    console.log(
      "Аргументы:",
      args,
    );

    const result =
      fn(...args);

    console.log(
      "Результат:",
      result,
    );

    return result;
  };
}

const loggedCreateProduct =
  withLogging(createProduct);

const loggedProduct =
  loggedCreateProduct({
    title: "Монитор",
    description:
      "Монитор с диагональю 27 дюймов",
    price: 28000,
    costPrice: 21000,
    category: "electronics",
  });

class ProductEntity {
  constructor(
    public readonly id: number,
    public title: string,
    public price: number,
    public status:
      ProductStatus,
  ) {}
}

type ProductEntityConstructorParameters =
  ConstructorParameters<
    typeof ProductEntity
  >;

type ProductEntityInstance =
  InstanceType<
    typeof ProductEntity
  >;

const productEntityArguments:
  ProductEntityConstructorParameters = [
    1,
    "Клавиатура",
    7500,
    "published",
  ];

const productEntity:
  ProductEntityInstance =
    new ProductEntity(
      ...productEntityArguments,
    );

async function loadProducts():
  Promise<Product[]> {
  return [
    keyboard,
    {
      id: 2,
      title: "Учебник",
      description:
        "Учебник по TypeScript",
      price: 1800,
      costPrice: 900,
      status: "published",
      category: "books",
      createdAt: new Date(),
    },
  ];
}

type LoadProductsReturn =
  ReturnType<
    typeof loadProducts
  >;

type LoadedProducts =
  Awaited<
    ReturnType<
      typeof loadProducts
    >
  >;

type CatalogState = {
  products: Product[];
  selectedProduct:
    Product | null;
  loading: boolean;
  error: string | null;
};

type CatalogStatePatch =
  Partial<CatalogState>;

function updateCatalogState(
  current: CatalogState,
  patch: CatalogStatePatch,
): CatalogState {
  return {
    ...current,
    ...patch,
  };
}

const initialCatalogState:
  CatalogState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  };

const loadingCatalogState =
  updateCatalogState(
    initialCatalogState,
    {
      loading: true,
    },
  );

const loadedCatalogState =
  updateCatalogState(
    loadingCatalogState,
    {
      products: [
        keyboard,
      ],
      loading: false,
    },
  );

const selectedCatalogState =
  updateCatalogState(
    loadedCatalogState,
    {
      selectedProduct:
        keyboard,
    },
  );

async function run():
  Promise<void> {
  const products:
    LoadedProducts =
      await loadProducts();

  console.log(
    "Товары:",
    products,
  );

  console.log(
    "Созданный товар:",
    createdProduct,
  );

  console.log(
    "Товар с логированием:",
    loggedProduct,
  );

  console.log(
    "Экземпляр класса:",
    productEntity,
  );

  console.log(
    "Состояние каталога:",
    selectedCatalogState,
  );

  console.log(
    "Подписи статусов:",
    productStatusLabels,
  );

  console.log(
    "Настройки категорий:",
    categorySettings,
  );
}

void run();

// Ожидаемые ошибки TypeScript:

// @ts-expect-error:
// свойства costPrice нет
// в PublicProduct
const wrongPublicProduct:
  PublicProduct = {
    id: 1,
    title: "Клавиатура",
    description:
      "Механическая клавиатура",
    price: 7500,
    costPrice: 4800,
    status: "published",
    category: "electronics",
    createdAt: new Date(),
  };

// @ts-expect-error:
// свойство status нельзя
// изменять этой командой
const wrongUpdate:
  UpdateProductCommand = {
    productId: 1,
    status: "archived",
  };

// @ts-expect-error:
// imageUrl обязательно
const incompleteProduct:
  CompleteProduct = {
    id: 1,
    title: "Клавиатура",
    description:
      "Механическая клавиатура",
    price: 7500,
    costPrice: 4800,
    status: "published",
    category: "electronics",
    createdAt: new Date(),
  };

// @ts-expect-error:
// свойства снимка доступны
// только для чтения
productSnapshot.price = 8000;

// @ts-expect-error:
// archived исключён
const wrongVisibleStatus:
  VisibleProductStatus =
    "archived";

// @ts-expect-error:
// draft исключён
const wrongPublishCommand:
  PublishProductCommand = {
    productId: 1,
    status: "draft",
  };

// @ts-expect-error:
// null удалён
const missingProduct:
  ExistingProduct = null;
```

