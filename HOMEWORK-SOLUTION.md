# Домашнее задание. Решение

## Контрольные вопросы

### 1. Чем `typeof` в выражении отличается от `typeof` в типовой позиции?

В обычном JavaScript `typeof` работает во время выполнения программы.

Он получает значение и возвращает строку с названием его типа:

```ts
const value = 42;

console.log(typeof value);
```

Результат:

```text
number
```

В этом случае `typeof` является обычным JavaScript-оператором.

Он возвращает одну из строк:

```text
"string"
"number"
"boolean"
"undefined"
"object"
"function"
"symbol"
"bigint"
```

В TypeScript оператор `typeof` можно также использовать в типовой позиции.

Например:

```ts
const defaultConfig = {
  locale: "ru",
  pageSize: 20,
  darkMode: true,
};

type Config =
  typeof defaultConfig;
```

В этом случае `typeof` не выполняется во время работы программы.

TypeScript получает тип переменной `defaultConfig`.

Тип `Config` будет эквивалентен следующему:

```ts
type Config = {
  locale: string;
  pageSize: number;
  darkMode: boolean;
};
```

Основное различие:

* `typeof value` в выражении возвращает строку во время выполнения;
* `typeof value` в типовой позиции получает тип переменной во время компиляции;
* обычный `typeof` является частью JavaScript;
* типовой `typeof` используется только TypeScript и исчезает после компиляции.

---

### 2. Как получить тип элемента массива?

Пусть существует массив:

```ts
const roles = [
  "admin",
  "editor",
  "viewer",
] as const;
```

Сначала получим тип самого массива:

```ts
type Roles =
  typeof roles;
```

Он будет выглядеть примерно так:

```ts
readonly [
  "admin",
  "editor",
  "viewer",
]
```

Чтобы получить тип одного элемента массива, используется индексированный доступ с ключом `number`:

```ts
type Role =
  (typeof roles)[number];
```

Результат:

```ts
type Role =
  | "admin"
  | "editor"
  | "viewer";
```

Такая запись читается следующим образом:

1. `typeof roles` получает тип массива;
2. `[number]` получает тип любого его элемента.

Для обычного типа массива используется тот же принцип:

```ts
type Users = Array<{
  id: number;
  name: string;
}>;

type User =
  Users[number];
```

Тип `User`:

```ts
{
  id: number;
  name: string;
}
```

Можно также создать универсальный условный тип:

```ts
type ArrayElement<T> =
  T extends readonly (infer TItem)[]
    ? TItem
    : never;
```

Применение:

```ts
type StringItem =
  ArrayElement<string[]>;

type NumberItem =
  ArrayElement<readonly number[]>;
```

Результаты:

```ts
// StringItem: string
// NumberItem: number
```

---

### 3. Когда conditional type распределяется по union?

Условный тип распределяется по объединению, когда слева от `extends` находится параметр типа без дополнительной оболочки.

Например:

```ts
type ToArray<T> =
  T extends unknown
    ? T[]
    : never;
```

Передадим объединение:

```ts
type Result =
  ToArray<string | number>;
```

TypeScript применит условный тип отдельно к каждому элементу объединения:

```ts
ToArray<string>
```

даёт:

```ts
string[]
```

А:

```ts
ToArray<number>
```

даёт:

```ts
number[]
```

Итоговый результат:

```ts
type Result =
  string[] | number[];
```

Такое поведение называется распределением условного типа по объединению.

Чтобы отключить распределение, параметр типа можно обернуть в кортеж:

```ts
type ToArrayTogether<T> =
  [T] extends [unknown]
    ? T[]
    : never;
```

Теперь:

```ts
type Together =
  ToArrayTogether<string | number>;
```

Результат:

```ts
type Together =
  (string | number)[];
```

Правило:

* `T extends SomeType` — условие распределяется по union;
* `[T] extends [SomeType]` — всё объединение проверяется как единый тип.

---

### 4. Что делает `infer`?

Ключевое слово `infer` позволяет извлечь часть сложного типа внутри условного типа.

Например, получим возвращаемый тип функции:

```ts
type FunctionResult<T> =
  T extends (
    ...args: never[]
  ) => infer TResult
    ? TResult
    : never;
```

Создадим функцию:

```ts
function createUser() {
  return {
    id: 1,
    name: "Анна",
  };
}
```

Получим тип её результата:

```ts
type CreatedUser =
  FunctionResult<
    typeof createUser
  >;
```

TypeScript сопоставляет тип функции с шаблоном:

```ts
(...args: never[]) => infer TResult
```

После этого сохраняет возвращаемый тип во временный параметр `TResult`.

Результат:

```ts
type CreatedUser = {
  id: number;
  name: string;
};
```

Другой пример — извлечение значения из `Promise`:

```ts
type PromiseValue<T> =
  T extends Promise<infer TValue>
    ? TValue
    : T;
```

Использование:

```ts
type Result =
  PromiseValue<Promise<number>>;
```

Результат:

```ts
number
```

`infer`:

* используется внутри условного типа;
* сопоставляет тип с определённым шаблоном;
* извлекает нужную часть типа;
* сохраняет найденный тип во временный параметр.

---

### 5. Как mapped type фильтрует ключи?

Mapped type может менять имя ключа с помощью конструкции `as`.

Если вместо имени ключа получить `never`, свойство будет исключено из итогового типа.

Создадим тип:

```ts
type User = {
  id: number;
  name: string;
  active: boolean;
  email: string;
};
```

Оставим только строковые свойства:

```ts
type StringProperties<T> = {
  [K in keyof T as
    T[K] extends string
      ? K
      : never
  ]: T[K];
};
```

Применение:

```ts
type UserStrings =
  StringProperties<User>;
```

Mapped type проходит по каждому ключу.

Для свойства `id`:

```ts
number extends string
```

Условие не выполняется, поэтому ключ превращается в `never`.

Для свойства `name`:

```ts
string extends string
```

Условие выполняется, поэтому ключ сохраняется.

Итоговый тип:

```ts
type UserStrings = {
  name: string;
  email: string;
};
```

Основной механизм фильтрации:

```ts
[K in keyof T as
  условие ? K : never
]
```

Ключи, преобразованные в `never`, не попадают в результат.

---

# Практическое задание

## Задание 1. Модели данных

### Тип `User`

```ts
type User = {
  id: number;
  name: string;
  email: string;
};
```

---

### Тип `OrderStatus`

```ts
type OrderStatus =
  | "new"
  | "paid"
  | "cancelled";
```

---

### Тип `Order`

```ts
type Order = {
  id: number;
  userId: number;
  amount: number;
  status: OrderStatus;
};
```

---

### Тип `CreateOrderData`

Для создания заказа идентификатор и статус готового заказа не нужны:

```ts
type CreateOrderData = {
  userId: number;
  amount: number;
};
```

Можно также вычислить этот тип из `Order`:

```ts
type ComputedCreateOrderData =
  Omit<Order, "id" | "status">;
```

Результат будет таким же:

```ts
{
  userId: number;
  amount: number;
}
```

---

## Задание 2. Единая схема API

Создадим схему, которая станет единственным источником информации о запросах и ответах.

```ts
type ApiSchema = {
  users: {
    get: {
      request: {
        limit?: number;
      };
      response: User[];
    };

    getById: {
      request: {
        id: number;
      };
      response: User;
    };
  };

  order: {
    create: {
      request: CreateOrderData;
      response: Order;
    };

    getById: {
      request: {
        id: number;
      };
      response: Order;
    };
  };
};
```

В дальнейшем типы запросов, ответов, обработчиков и методов клиента будут вычисляться из `ApiSchema`.

---

## Задание 3. Имена ресурсов и операций

### Тип `ResourceName`

Получим все ключи верхнего уровня схемы:

```ts
type ResourceName =
  keyof ApiSchema;
```

Результат:

```ts
type ResourceName =
  | "users"
  | "order";
```

Проверка:

```ts
const usersResource:
  ResourceName = "users";

const orderResource:
  ResourceName = "order";
```

Несуществующий ресурс использовать нельзя:

```ts
// Ошибка TypeScript:
// const productResource:
//   ResourceName = "products";
```

---

### Тип `OperationName`

Теперь получим операции конкретного ресурса:

```ts
type OperationName<
  TResource extends ResourceName,
> =
  keyof ApiSchema[TResource];
```

Примеры:

```ts
type UserOperation =
  OperationName<"users">;

type OrderOperation =
  OperationName<"order">;
```

Результаты:

```ts
// UserOperation:
// "get" | "getById"

// OrderOperation:
// "create" | "getById"
```

Проверка:

```ts
const userOperation:
  UserOperation = "get";

const orderOperation:
  OrderOperation = "create";
```

Неподходящая операция вызовет ошибку:

```ts
// Ошибка TypeScript:
// const wrongUserOperation:
//   UserOperation = "create";
```

---

## Задание 4. Типы endpoint

Нужно получить объединение строк следующего вида:

```text
users:get
users:getById
order:create
order:getById
```

Создадим mapped type:

```ts
type EndpointName = {
  [TResource in ResourceName]:
    `${TResource}:${
      Extract<
        OperationName<TResource>,
        string
      >
    }`;
}[ResourceName];
```

Разберём его по частям.

Mapped type проходит по каждому ресурсу:

```ts
[TResource in ResourceName]
```

Для каждого ресурса строится строковый тип:

```ts
`${TResource}:${OperationName}`
```

Затем:

```ts
[ResourceName]
```

получает объединение всех значений созданного объекта.

Результат:

```ts
type EndpointName =
  | "users:get"
  | "users:getById"
  | "order:create"
  | "order:getById";
```

Проверка:

```ts
const getUsersEndpoint:
  EndpointName = "users:get";

const createOrderEndpoint:
  EndpointName = "order:create";
```

Несуществующий endpoint использовать нельзя:

```ts
// Ошибка TypeScript:
// const wrongEndpoint:
//   EndpointName = "users:create";
```

---

## Задание 5. Параметры запроса и тип ответа

Сначала создадим вспомогательный тип, который по имени endpoint получает соответствующее описание операции.

### Тип `EndpointDefinition`

```ts
type EndpointDefinition<
  TEndpoint extends EndpointName,
> =
  TEndpoint extends
    `${infer TResource}:${infer TOperation}`
      ? TResource extends ResourceName
        ? TOperation extends
            keyof ApiSchema[TResource]
          ? ApiSchema[TResource][TOperation]
          : never
        : never
      : never;
```

Рассмотрим endpoint:

```ts
"order:create"
```

Template literal type разделяет его на две части:

```ts
TResource = "order"
TOperation = "create"
```

После этого TypeScript получает:

```ts
ApiSchema["order"]["create"]
```

Результат:

```ts
{
  request: CreateOrderData;
  response: Order;
}
```

---

### Тип `RequestOf`

```ts
type RequestOf<
  TEndpoint extends EndpointName,
> =
  EndpointDefinition<TEndpoint>
    extends {
      request: infer TRequest;
    }
      ? TRequest
      : never;
```

Примеры:

```ts
type GetUsersRequest =
  RequestOf<"users:get">;

type CreateOrderRequest =
  RequestOf<"order:create">;
```

Результаты:

```ts
// GetUsersRequest:
{
  limit?: number;
}
```

```ts
// CreateOrderRequest:
{
  userId: number;
  amount: number;
}
```

---

### Тип `ResponseOf`

```ts
type ResponseOf<
  TEndpoint extends EndpointName,
> =
  EndpointDefinition<TEndpoint>
    extends {
      response: infer TResponse;
    }
      ? TResponse
      : never;
```

Примеры:

```ts
type GetUsersResponse =
  ResponseOf<"users:get">;

type CreateOrderResponse =
  ResponseOf<"order:create">;
```

Результаты:

```ts
// GetUsersResponse:
User[]
```

```ts
// CreateOrderResponse:
Order
```

---

### Проверка типов запросов

```ts
const getUsersRequest:
  GetUsersRequest = {
    limit: 10,
  };
```

Параметр `limit` можно не передавать:

```ts
const getAllUsersRequest:
  GetUsersRequest = {};
```

Создание заказа:

```ts
const createOrderRequest:
  CreateOrderRequest = {
    userId: 1,
    amount: 5000,
  };
```

Неправильный тип вызовет ошибку:

```ts
// Ошибка TypeScript:
// const wrongRequest:
//   CreateOrderRequest = {
//     userId: "1",
//     amount: 5000,
//   };
```

Несуществующий endpoint передать нельзя благодаря ограничению:

```ts
TEndpoint extends EndpointName
```

```ts
// Ошибка TypeScript:
// type WrongResponse =
//   ResponseOf<"products:get">;
```

---

## Задание 6. Обработчик endpoint

Создадим универсальный тип обработчика:

```ts
type EndpointHandler<
  TEndpoint extends EndpointName,
> = (
  request: RequestOf<TEndpoint>,
) =>
  | ResponseOf<TEndpoint>
  | Promise<ResponseOf<TEndpoint>>;
```

Обработчик может вернуть:

* обычный результат;
* `Promise` с результатом.

---

### Обработчик получения пользователей

```ts
type GetUsersHandler =
  EndpointHandler<"users:get">;
```

Он эквивалентен следующему типу:

```ts
type GetUsersHandlerEquivalent = (
  request: {
    limit?: number;
  },
) => User[] | Promise<User[]>;
```

Реализация:

```ts
const getUsersHandler:
  GetUsersHandler = (
    request,
  ) => {
    const users: User[] = [
      {
        id: 1,
        name: "Анна",
        email: "anna@example.com",
      },
      {
        id: 2,
        name: "Борис",
        email: "boris@example.com",
      },
    ];

    if (
      request.limit === undefined
    ) {
      return users;
    }

    return users.slice(
      0,
      request.limit,
    );
  };
```

---

### Обработчик создания заказа

```ts
type CreateOrderHandler =
  EndpointHandler<"order:create">;
```

Реализация:

```ts
const createOrderHandler:
  CreateOrderHandler = async (
    request,
  ) => {
    return {
      id: 101,
      userId: request.userId,
      amount: request.amount,
      status: "new",
    };
  };
```

TypeScript знает, что `request` имеет тип:

```ts
CreateOrderData
```

Возвращаемое значение должно соответствовать типу `Order`.

---

## Задание 7. Карта обработчиков

Создадим mapped type:

```ts
type ApiHandlers = {
  [TEndpoint in EndpointName]:
    EndpointHandler<TEndpoint>;
};
```

Результат будет эквивалентен следующему:

```ts
type ApiHandlersEquivalent = {
  "users:get":
    EndpointHandler<"users:get">;

  "users:getById":
    EndpointHandler<"users:getById">;

  "order:create":
    EndpointHandler<"order:create">;

  "order:getById":
    EndpointHandler<"order:getById">;
};
```

Теперь создадим объект обработчиков:

```ts
const handlers: ApiHandlers = {
  "users:get": (
    request,
  ) => {
    const users: User[] = [
      {
        id: 1,
        name: "Анна",
        email: "anna@example.com",
      },
      {
        id: 2,
        name: "Борис",
        email: "boris@example.com",
      },
    ];

    if (
      request.limit === undefined
    ) {
      return users;
    }

    return users.slice(
      0,
      request.limit,
    );
  },

  "users:getById": (
    request,
  ) => {
    return {
      id: request.id,
      name: "Анна",
      email: "anna@example.com",
    };
  },

  "order:create": async (
    request,
  ) => {
    return {
      id: 101,
      userId: request.userId,
      amount: request.amount,
      status: "new",
    };
  },

  "order:getById": (
    request,
  ) => {
    return {
      id: request.id,
      userId: 1,
      amount: 5000,
      status: "paid",
    };
  },
};
```

TypeScript проверяет:

* наличие всех обязательных endpoint;
* параметры каждого обработчика;
* возвращаемые значения;
* отсутствие неизвестных ключей.

Если удалить обработчик, возникнет ошибка:

```ts
// Ошибка TypeScript:
// отсутствует обязательный endpoint
// "order:getById"
```

Если вернуть неправильный результат:

```ts
// Ошибка TypeScript:
// "order:create": () => {
//   return "Заказ создан";
// },
```

Строка не соответствует типу `Order`.

---

## Задание 8. Имена методов API-клиента

Нужно преобразовать endpoint:

```text
users:get
```

в имя:

```text
getUsers
```

А:

```text
order:create
```

в:

```text
createOrder
```

Сначала создадим тип преобразования имени ресурса.

```ts
type SingularResourceName<
  TResource extends string,
> =
  TResource extends "users"
    ? "Users"
    : Capitalize<TResource>;
```

Для текущей схемы:

```ts
// SingularResourceName<"users">
// "Users"

// SingularResourceName<"order">
// "Order"
```

Теперь создадим имя метода на основе endpoint:

```ts
type MethodNameOf<
  TEndpoint extends EndpointName,
> =
  TEndpoint extends
    `${infer TResource}:${infer TOperation}`
      ? TResource extends ResourceName
        ? TOperation extends string
          ? `${
              TOperation
            }${
              SingularResourceName<
                TResource
              >
            }`
          : never
        : never
      : never;
```

Получим все имена методов:

```ts
type ClientMethodName =
  MethodNameOf<EndpointName>;
```

Результат:

```ts
type ClientMethodName =
  | "getUsers"
  | "getByIdUsers"
  | "createOrder"
  | "getByIdOrder";
```

Проверка:

```ts
const clientMethod:
  ClientMethodName =
    "createOrder";
```

Несуществующее имя вызовет ошибку:

```ts
// Ошибка TypeScript:
// const wrongMethod:
//   ClientMethodName =
//     "deleteOrder";
```

---

## Задание 9. Тип API-клиента

Нужно создать объект, в котором ключи endpoint будут переименованы в имена методов.

```ts
type ApiClient = {
  [TEndpoint in EndpointName as
    MethodNameOf<TEndpoint>
  ]: (
    request:
      RequestOf<TEndpoint>,
  ) => Promise<
    ResponseOf<TEndpoint>
  >;
};
```

Mapped type проходит по каждому endpoint:

```ts
TEndpoint in EndpointName
```

С помощью `as` ключ переименовывается:

```ts
as MethodNameOf<TEndpoint>
```

Тип параметра вычисляется через:

```ts
RequestOf<TEndpoint>
```

Тип результата вычисляется через:

```ts
ResponseOf<TEndpoint>
```

Тип `ApiClient` будет эквивалентен следующему:

```ts
type ApiClientEquivalent = {
  getUsers(
    request: {
      limit?: number;
    },
  ): Promise<User[]>;

  getByIdUsers(
    request: {
      id: number;
    },
  ): Promise<User>;

  createOrder(
    request: CreateOrderData,
  ): Promise<Order>;

  getByIdOrder(
    request: {
      id: number;
    },
  ): Promise<Order>;
};
```

Все методы были вычислены из `ApiSchema`.

---

## Задание 10. Реализация API-клиента

Создадим объект клиента:

```ts
const apiClient: ApiClient = {
  async getUsers(request) {
    const users: User[] = [
      {
        id: 1,
        name: "Анна",
        email: "anna@example.com",
      },
      {
        id: 2,
        name: "Борис",
        email: "boris@example.com",
      },
      {
        id: 3,
        name: "Виктор",
        email: "viktor@example.com",
      },
    ];

    if (
      request.limit === undefined
    ) {
      return users;
    }

    return users.slice(
      0,
      request.limit,
    );
  },

  async getByIdUsers(request) {
    return {
      id: request.id,
      name: "Анна",
      email: "anna@example.com",
    };
  },

  async createOrder(request) {
    return {
      id: 101,
      userId: request.userId,
      amount: request.amount,
      status: "new",
    };
  },

  async getByIdOrder(request) {
    return {
      id: request.id,
      userId: 1,
      amount: 5000,
      status: "paid",
    };
  },
};
```

---

### Получение пользователей

```ts
async function runUsersExample():
  Promise<void> {
  const users =
    await apiClient.getUsers({
      limit: 2,
    });

  console.log(users);
}
```

Тип переменной `users`:

```ts
User[]
```

---

### Получение пользователя по идентификатору

```ts
async function runUserExample():
  Promise<void> {
  const user =
    await apiClient.getByIdUsers({
      id: 1,
    });

  console.log(user.name);
}
```

Тип переменной `user`:

```ts
User
```

---

### Создание заказа

```ts
async function runOrderExample():
  Promise<void> {
  const order =
    await apiClient.createOrder({
      userId: 1,
      amount: 5000,
    });

  console.log(order.status);
}
```

Тип переменной `order`:

```ts
Order
```

---

### Проверка ошибок

Нельзя пропустить обязательный параметр:

```ts
// Ошибка TypeScript:
// apiClient.getByIdUsers({});
```

Нельзя передать неправильный тип:

```ts
// Ошибка TypeScript:
// apiClient.getByIdUsers({
//   id: "1",
// });
```

Нельзя добавить неизвестное свойство:

```ts
// Ошибка TypeScript:
// apiClient.createOrder({
//   userId: 1,
//   amount: 5000,
//   discount: 10,
// });
```

Нельзя вызвать несуществующий метод:

```ts
// Ошибка TypeScript:
// apiClient.deleteOrder({
//   id: 1,
// });
```

Нельзя вернуть результат неправильного типа:

```ts
// Ошибка TypeScript:
// const wrongClient: ApiClient = {
//   ...
//
//   async createOrder() {
//     return "Заказ создан";
//   },
// };
```

---

## Задание 11. Добавление нового endpoint

Добавим операцию получения всех заказов:

```ts
type ExtendedApiSchema = {
  users: {
    get: {
      request: {
        limit?: number;
      };
      response: User[];
    };

    getById: {
      request: {
        id: number;
      };
      response: User;
    };
  };

  order: {
    create: {
      request: CreateOrderData;
      response: Order;
    };

    getById: {
      request: {
        id: number;
      };
      response: Order;
    };

    getAll: {
      request: {
        userId?: number;
      };
      response: Order[];
    };
  };
};
```

Чтобы все вычисляемые типы обновились, достаточно использовать новую схему как основную:

```ts
type ApiSchema =
  ExtendedApiSchema;
```

После этого тип endpoint автоматически получит новое значение:

```ts
"order:getAll"
```

Имя метода клиента:

```ts
getAllOrder
```

Тип запроса:

```ts
{
  userId?: number;
}
```

Тип ответа:

```ts
Order[]
```

Карта обработчиков потребует новый обработчик:

```ts
"order:getAll"
```

А `ApiClient` потребует новый метод:

```ts
getAllOrder
```

Другие вычисляемые типы вручную менять не потребуется.

---

# Полный код решения

```ts
export {};

type User = {
  id: number;
  name: string;
  email: string;
};

type OrderStatus =
  | "new"
  | "paid"
  | "cancelled";

type Order = {
  id: number;
  userId: number;
  amount: number;
  status: OrderStatus;
};

type CreateOrderData =
  Omit<Order, "id" | "status">;

type ApiSchema = {
  users: {
    get: {
      request: {
        limit?: number;
      };
      response: User[];
    };

    getById: {
      request: {
        id: number;
      };
      response: User;
    };
  };

  order: {
    create: {
      request: CreateOrderData;
      response: Order;
    };

    getById: {
      request: {
        id: number;
      };
      response: Order;
    };

    getAll: {
      request: {
        userId?: number;
      };
      response: Order[];
    };
  };
};

type ResourceName =
  keyof ApiSchema;

type OperationName<
  TResource extends ResourceName,
> =
  keyof ApiSchema[TResource];

type EndpointName = {
  [TResource in ResourceName]:
    `${TResource}:${
      Extract<
        OperationName<TResource>,
        string
      >
    }`;
}[ResourceName];

type EndpointDefinition<
  TEndpoint extends EndpointName,
> =
  TEndpoint extends
    `${infer TResource}:${infer TOperation}`
      ? TResource extends ResourceName
        ? TOperation extends
            keyof ApiSchema[TResource]
          ? ApiSchema[TResource][TOperation]
          : never
        : never
      : never;

type RequestOf<
  TEndpoint extends EndpointName,
> =
  EndpointDefinition<TEndpoint>
    extends {
      request: infer TRequest;
    }
      ? TRequest
      : never;

type ResponseOf<
  TEndpoint extends EndpointName,
> =
  EndpointDefinition<TEndpoint>
    extends {
      response: infer TResponse;
    }
      ? TResponse
      : never;

type EndpointHandler<
  TEndpoint extends EndpointName,
> = (
  request: RequestOf<TEndpoint>,
) =>
  | ResponseOf<TEndpoint>
  | Promise<ResponseOf<TEndpoint>>;

type ApiHandlers = {
  [TEndpoint in EndpointName]:
    EndpointHandler<TEndpoint>;
};

type SingularResourceName<
  TResource extends string,
> =
  TResource extends "users"
    ? "Users"
    : Capitalize<TResource>;

type MethodNameOf<
  TEndpoint extends EndpointName,
> =
  TEndpoint extends
    `${infer TResource}:${infer TOperation}`
      ? TResource extends ResourceName
        ? TOperation extends string
          ? `${
              TOperation
            }${
              SingularResourceName<
                TResource
              >
            }`
          : never
        : never
      : never;

type ClientMethodName =
  MethodNameOf<EndpointName>;

type ApiClient = {
  [TEndpoint in EndpointName as
    MethodNameOf<TEndpoint>
  ]: (
    request:
      RequestOf<TEndpoint>,
  ) => Promise<
    ResponseOf<TEndpoint>
  >;
};

const handlers: ApiHandlers = {
  "users:get": (
    request,
  ) => {
    const users: User[] = [
      {
        id: 1,
        name: "Анна",
        email: "anna@example.com",
      },
      {
        id: 2,
        name: "Борис",
        email: "boris@example.com",
      },
      {
        id: 3,
        name: "Виктор",
        email: "viktor@example.com",
      },
    ];

    if (
      request.limit === undefined
    ) {
      return users;
    }

    return users.slice(
      0,
      request.limit,
    );
  },

  "users:getById": (
    request,
  ) => {
    return {
      id: request.id,
      name: "Анна",
      email: "anna@example.com",
    };
  },

  "order:create": async (
    request,
  ) => {
    return {
      id: 101,
      userId: request.userId,
      amount: request.amount,
      status: "new",
    };
  },

  "order:getById": (
    request,
  ) => {
    return {
      id: request.id,
      userId: 1,
      amount: 5000,
      status: "paid",
    };
  },

  "order:getAll": (
    request,
  ) => {
    const orders: Order[] = [
      {
        id: 101,
        userId: 1,
        amount: 5000,
        status: "paid",
      },
      {
        id: 102,
        userId: 2,
        amount: 3200,
        status: "new",
      },
      {
        id: 103,
        userId: 1,
        amount: 7400,
        status: "cancelled",
      },
    ];

    if (
      request.userId === undefined
    ) {
      return orders;
    }

    return orders.filter(
      (order) =>
        order.userId ===
        request.userId,
    );
  },
};

const apiClient: ApiClient = {
  async getUsers(request) {
    const result =
      await handlers["users:get"](
        request,
      );

    return result;
  },

  async getByIdUsers(request) {
    const result =
      await handlers[
        "users:getById"
      ](request);

    return result;
  },

  async createOrder(request) {
    const result =
      await handlers[
        "order:create"
      ](request);

    return result;
  },

  async getByIdOrder(request) {
    const result =
      await handlers[
        "order:getById"
      ](request);

    return result;
  },

  async getAllOrder(request) {
    const result =
      await handlers[
        "order:getAll"
      ](request);

    return result;
  },
};

async function run():
  Promise<void> {
  const users =
    await apiClient.getUsers({
      limit: 2,
    });

  console.log(
    "Пользователи:",
    users,
  );

  const user =
    await apiClient.getByIdUsers({
      id: 1,
    });

  console.log(
    "Пользователь:",
    user,
  );

  const createdOrder =
    await apiClient.createOrder({
      userId: 1,
      amount: 5000,
    });

  console.log(
    "Созданный заказ:",
    createdOrder,
  );

  const order =
    await apiClient.getByIdOrder({
      id: 101,
    });

  console.log(
    "Найденный заказ:",
    order,
  );

  const userOrders =
    await apiClient.getAllOrder({
      userId: 1,
    });

  console.log(
    "Заказы пользователя:",
    userOrders,
  );

  const allOrders =
    await apiClient.getAllOrder({});

  console.log(
    "Все заказы:",
    allOrders,
  );
}

void run();

// Ожидаемые ошибки TypeScript:

// @ts-expect-error:
// ресурс products отсутствует
const wrongEndpoint:
  EndpointName = "products:get";

// @ts-expect-error:
// операция create отсутствует
// у ресурса users
const wrongUsersEndpoint:
  EndpointName = "users:create";

// @ts-expect-error:
// id должен быть number
apiClient.getByIdUsers({
  id: "1",
});

// @ts-expect-error:
// отсутствует обязательное
// свойство amount
apiClient.createOrder({
  userId: 1,
});

// @ts-expect-error:
// свойство discount отсутствует
apiClient.createOrder({
  userId: 1,
  amount: 5000,
  discount: 10,
});

// @ts-expect-error:
// такого метода нет
apiClient.deleteOrder({
  id: 1,
});
```

## Пример результата

```text
Пользователи: [
  {
    id: 1,
    name: "Анна",
    email: "anna@example.com"
  },
  {
    id: 2,
    name: "Борис",
    email: "boris@example.com"
  }
]

Пользователь: {
  id: 1,
  name: "Анна",
  email: "anna@example.com"
}

Созданный заказ: {
  id: 101,
  userId: 1,
  amount: 5000,
  status: "new"
}

Найденный заказ: {
  id: 101,
  userId: 1,
  amount: 5000,
  status: "paid"
}

Заказы пользователя: [
  {
    id: 101,
    userId: 1,
    amount: 5000,
    status: "paid"
  },
  {
    id: 103,
    userId: 1,
    amount: 7400,
    status: "cancelled"
  }
]

Все заказы: [
  {
    id: 101,
    userId: 1,
    amount: 5000,
    status: "paid"
  },
  {
    id: 102,
    userId: 2,
    amount: 3200,
    status: "new"
  },
  {
    id: 103,
    userId: 1,
    amount: 7400,
    status: "cancelled"
  }
]
```

