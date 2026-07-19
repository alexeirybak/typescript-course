# Урок 11. Операции с типами: вычисляем новые типы из существующих

## Домашнее задание

### Контрольные вопросы

1. Чем `typeof` в выражении отличается от `typeof` в типовой позиции?
2. Как получить тип элемента массива?
3. Когда conditional type распределяется по union?
4. Что делает `infer`?
5. Как mapped type фильтрует ключи?

## Практическое задание

Создайте типобезопасное описание API, в котором все вспомогательные типы вычисляются из единой схемы `ApiSchema`.

### 1. Опишите модели данных

Создайте типы:

* `User`;
* `Order`;
* `CreateOrderData`.

Модель пользователя должна содержать:

* идентификатор;
* имя;
* электронную почту.

Модель заказа должна содержать:

* идентификатор;
* идентификатор пользователя;
* сумму;
* статус.

Данные для создания заказа не должны содержать идентификатор и статус готового заказа.

---

### 2. Создайте единую схему API

Опишите тип:

```ts
type ApiSchema
```

Используйте следующую структуру:

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

Все остальные типы в задании должны вычисляться из `ApiSchema`.

Не описывайте параметры и ответы повторно вручную.

---

### 3. Получите имена ресурсов и операций

На основе `ApiSchema` создайте типы:

```ts
ResourceName
```

```ts
OperationName<TResource>
```

`ResourceName` должен содержать имена ресурсов:

```ts
"users" | "order"
```

`OperationName<TResource>` должен возвращать операции только выбранного ресурса.

Например, для ресурса `users` должны быть доступны:

```ts
"get" | "getById"
```

Используйте:

* `keyof`;
* ограничение параметра типа.

---

### 4. Создайте типы endpoint

Получите объединение всех endpoint в формате:

```ts
"users:get"
| "users:getById"
| "order:create"
| "order:getById"
```

Создайте тип:

```ts
EndpointName
```

Используйте:

* mapped type;
* template literal type;
* indexed access type.

Тип должен автоматически обновляться при добавлении нового ресурса или новой операции в `ApiSchema`.

---

### 5. Получите параметры запроса и тип ответа

Создайте типы:

```ts
RequestOf<TEndpoint>
```

```ts
ResponseOf<TEndpoint>
```

Они должны принимать имя endpoint и возвращать соответствующий тип.

Примеры ожидаемого поведения:

```ts
type GetUsersRequest =
  RequestOf<"users:get">;
```

Результат:

```ts
{
  limit?: number;
}
```

```ts
type CreateOrderResponse =
  ResponseOf<"order:create">;
```

Результат:

```ts
Order
```

Используйте:

* conditional types;
* template literal types;
* `infer`;
* indexed access types.

При передаче несуществующего endpoint TypeScript должен сообщать об ошибке.

---

### 6. Создайте тип обработчика endpoint

Опишите тип:

```ts
EndpointHandler<TEndpoint>
```

Обработчик должен:

* принимать параметры соответствующего запроса;
* возвращать соответствующий ответ;
* поддерживать синхронный и асинхронный результат.

Пример ожидаемого типа:

```ts
type CreateOrderHandler =
  EndpointHandler<"order:create">;
```

Он должен быть эквивалентен функции:

```ts
(
  request: CreateOrderData,
) => Order | Promise<Order>
```

---

### 7. Создайте карту обработчиков

На основе всех endpoint создайте тип:

```ts
ApiHandlers
```

Он должен автоматически получить следующую структуру:

```ts
type ApiHandlers = {
  "users:get": EndpointHandler<"users:get">;
  "users:getById": EndpointHandler<"users:getById">;
  "order:create": EndpointHandler<"order:create">;
  "order:getById": EndpointHandler<"order:getById">;
};
```

Создайте объект обработчиков, соответствующий этому типу.

TypeScript должен проверять:

* наличие всех endpoint;
* тип параметров каждого обработчика;
* тип возвращаемого значения;
* отсутствие неизвестных обработчиков.

---

### 8. Создайте имена методов API-клиента

Преобразуйте операции и ресурсы в имена методов клиента.

Должны получиться имена:

```ts
getUsers
getByIdUsers
createOrder
getByIdOrder
```

Создайте тип:

```ts
ClientMethodName
```

Используйте:

* template literal types;
* `Capitalize`;
* mapped types;
* переименование ключей через `as`.

Не перечисляйте имена методов вручную.

---

### 9. Создайте тип API-клиента

Опишите вычисляемый тип:

```ts
ApiClient
```

Каждый метод клиента должен:

* принимать параметры соответствующего запроса;
* возвращать `Promise` с соответствующим ответом.

Ожидаемая структура:

```ts
type ApiClient = {
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

Эта структура должна быть вычислена автоматически из `ApiSchema`.

---

### 10. Реализуйте объект API-клиента

Создайте объект:

```ts
const apiClient: ApiClient
```

Реализуйте все методы клиента.

Для выполнения задания необязательно отправлять настоящие HTTP-запросы. Методы могут возвращать тестовые данные через `Promise.resolve`.

Проверьте несколько вызовов:

```ts
apiClient.getUsers({
  limit: 10,
});
```

```ts
apiClient.createOrder({
  userId: 1,
  amount: 5000,
});
```

Убедитесь, что TypeScript запрещает:

* передавать неизвестные параметры;
* пропускать обязательные параметры;
* передавать значения неправильного типа;
* обращаться к несуществующему методу;
* возвращать из метода ответ неправильного типа.

---

### 11. Добавьте новый endpoint

Расширьте `ApiSchema` новой операцией:

```ts
order: {
  getAll: {
    request: {
      userId?: number;
    };
    response: Order[];
  };
}
```

После изменения схемы проверьте, что автоматически обновились:

* `EndpointName`;
* `RequestOf`;
* `ResponseOf`;
* `ApiHandlers`;
* `ClientMethodName`;
* `ApiClient`.

Вручную изменять вычисляемые типы нельзя.
