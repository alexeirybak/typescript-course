# Решение домашнего задания

## Контрольные вопросы

Ниже готовое решение домашнего задания.

# Домашнее задание. Решение

## Контрольные вопросы

### 1. Почему `if (value)` может ошибочно отбросить пустую строку или число `0`?

Потому что JavaScript считает пустую строку и число `0` ложными значениями.

```ts
const title = "";

if (title) {
  console.log("Заголовок есть");
}
```

Ветка `if` не выполнится, хотя `title` является строкой.

То же самое произойдёт с числом `0`.

Если эти значения допустимы, лучше проверять только `null` и `undefined`:

```ts
if (value !== null && value !== undefined) {
  console.log(value);
}
```

---

### 2. Можно ли использовать `instanceof` с интерфейсом? Почему?

Нет.

Интерфейс существует только во время проверки TypeScript и удаляется после компиляции.

```ts
interface User {
  name: string;
}
```

Поэтому такая проверка невозможна:

```ts
// value instanceof User;
```

`instanceof` работает только с классами и конструкторами, которые существуют во время выполнения JavaScript.

Например:

```ts
value instanceof Date;
value instanceof Error;
```

---

### 3. Кто отвечает за корректность пользовательского type guard?

Разработчик.

TypeScript доверяет записи:

```ts
value is User
```

Он не проверяет, правильно ли написана логика внутри функции.

Например, такая функция формально допустима:

```ts
function isUser(value: unknown): value is User {
  return true;
}
```

Но она работает неправильно, потому что принимает любое значение за пользователя.

---

### 4. Чем assertion function отличается от обычного type guard?

Type guard возвращает `true` или `false`.

```ts
if (isUser(value)) {
  console.log(value.name);
}
```

Assertion function либо завершается нормально, либо выбрасывает ошибку.

```ts
assertIsUser(value);

console.log(value.name);
```

После успешного вызова assertion function TypeScript считает, что значение имеет нужный тип.

---

### 5. Зачем нужны дискриминируемые объединения?

Они позволяют описывать несколько вариантов объекта так, чтобы каждый вариант имел собственные обязательные поля.

Например:

```ts
type Notification =
  | { type: "email"; email: string }
  | { type: "sms"; phone: string };
```

Если `type` равен `"email"`, обязательно должно быть поле `email`.

Если `type` равен `"sms"`, обязательно должно быть поле `phone`.

Это запрещает создавать нелогичные комбинации полей и позволяет TypeScript сужать тип по значению поля `type`.

---

# Практическое задание

## Задание 1. Уведомления

Создадим три отдельных типа уведомлений.

```ts
type EmailNotification = {
  type: "email";
  id: number;
  createdAt: Date;
  email: string;
  subject: string;
};

type SmsNotification = {
  type: "sms";
  id: number;
  createdAt: Date;
  phone: string;
};

type PushNotification = {
  type: "push";
  id: number;
  createdAt: Date;
  deviceId: string;
};
```

Объединим их в один тип:

```ts
type Notification =
  | EmailNotification
  | SmsNotification
  | PushNotification;
```

Добавим функцию для исчерпывающей проверки:

```ts
function assertNever(value: never): never {
  throw new Error(`Необработанный вариант: ${JSON.stringify(value)}`);
}
```

Напишем функцию форматирования:

```ts
function formatNotification(notification: Notification): string {
  switch (notification.type) {
    case "email":
      return `Email на адрес ${notification.email}. Тема: ${notification.subject}`;

    case "sms":
      return `SMS на номер ${notification.phone}`;

    case "push":
      return `Push-уведомление на устройство ${notification.deviceId}`;

    default:
      return assertNever(notification);
  }
}
```

Создадим массив уведомлений:

```ts
const notifications: Notification[] = [
  {
    type: "email",
    id: 1,
    createdAt: new Date("2026-07-01"),
    email: "anna@example.com",
    subject: "Добро пожаловать",
  },
  {
    type: "sms",
    id: 2,
    createdAt: new Date("2026-07-02"),
    phone: "+7 900 123-45-67",
  },
  {
    type: "push",
    id: 3,
    createdAt: new Date("2026-07-03"),
    deviceId: "device-123",
  },
];
```

Выведем описание каждого уведомления:

```ts
notifications.forEach((notification) => {
  console.log(formatNotification(notification));
});
```

Полный код первого задания:

```ts
type EmailNotification = {
  type: "email";
  id: number;
  createdAt: Date;
  email: string;
  subject: string;
};

type SmsNotification = {
  type: "sms";
  id: number;
  createdAt: Date;
  phone: string;
};

type PushNotification = {
  type: "push";
  id: number;
  createdAt: Date;
  deviceId: string;
};

type Notification =
  | EmailNotification
  | SmsNotification
  | PushNotification;

function assertNever(value: never): never {
  throw new Error(`Необработанный вариант: ${JSON.stringify(value)}`);
}

function formatNotification(notification: Notification): string {
  switch (notification.type) {
    case "email":
      return `Email на адрес ${notification.email}. Тема: ${notification.subject}`;

    case "sms":
      return `SMS на номер ${notification.phone}`;

    case "push":
      return `Push-уведомление на устройство ${notification.deviceId}`;

    default:
      return assertNever(notification);
  }
}

const notifications: Notification[] = [
  {
    type: "email",
    id: 1,
    createdAt: new Date("2026-07-01"),
    email: "anna@example.com",
    subject: "Добро пожаловать",
  },
  {
    type: "sms",
    id: 2,
    createdAt: new Date("2026-07-02"),
    phone: "+7 900 123-45-67",
  },
  {
    type: "push",
    id: 3,
    createdAt: new Date("2026-07-03"),
    deviceId: "device-123",
  },
];

notifications.forEach((notification) => {
  console.log(formatNotification(notification));
});
```

Результат:

```text
Email на адрес anna@example.com. Тема: Добро пожаловать
SMS на номер +7 900 123-45-67
Push-уведомление на устройство device-123
```

---

## Задание 2. Проверка пользователей

Исходный массив:

```ts
const values: unknown[] = [
  { id: 1, name: "Анна" },
  { id: "2", name: "Иван" },
  null,
  "Hello",
  { id: 3, name: "Мария" },
];
```

Создадим тип пользователя:

```ts
type User = {
  id: number;
  name: string;
};
```

Сначала напишем вспомогательную функцию, которая проверяет, что значение является объектом:

```ts
function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
```

Теперь напишем пользовательский type guard:

```ts
function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string"
  );
}
```

Отфильтруем массив:

```ts
const users = values.filter(isUser);
```

Тип переменной `users`:

```ts
User[]
```

Выведем имена пользователей:

```ts
users.forEach((user) => {
  console.log(user.name);
});
```

В результате будут выведены:

```text
Анна
Мария
```

Объект с Иваном не попадёт в массив, потому что его `id` является строкой, а не числом.

Теперь создадим assertion function:

```ts
function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error("Значение не является пользователем");
  }
}
```

Продемонстрируем её использование:

```ts
const payload: unknown = {
  id: 4,
  name: "Олег",
};

assertIsUser(payload);

console.log(payload.name);
```

До вызова `assertIsUser` переменная `payload` имеет тип `unknown`.

После успешного вызова TypeScript считает её типом `User`.

Полный код второго задания:

```ts
type User = {
  id: number;
  name: string;
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string"
  );
}

function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error("Значение не является пользователем");
  }
}

const values: unknown[] = [
  { id: 1, name: "Анна" },
  { id: "2", name: "Иван" },
  null,
  "Hello",
  { id: 3, name: "Мария" },
];

const users = values.filter(isUser);

users.forEach((user) => {
  console.log(user.name);
});

const payload: unknown = {
  id: 4,
  name: "Олег",
};

assertIsUser(payload);

console.log(payload.name);
```

Результат:

```text
Анна
Мария
Олег
```