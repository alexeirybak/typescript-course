# Урок 14. Асинхронность и API

## Решение домашнего задания

### Ответы на контрольные вопросы

#### 1. Почему `async`-функция всегда возвращает `Promise`, даже если внутри возвращается обычное значение?

Ключевое слово `async` автоматически оборачивает возвращаемое значение в `Promise`.

Например:

```ts
async function getNumber(): Promise<number> {
  return 42;
}
```

Хотя внутри функции возвращается обычное число:

```ts
return 42;
```

результатом вызова будет:

```ts
Promise<number>
```

Получить само число можно при помощи `await`:

```ts
const number = await getNumber();
```

Если внутри `async`-функции возникает исключение, возвращённый `Promise` переходит в отклонённое состояние.

---

#### 2. Почему переменная `error` в блоке `catch` имеет тип `unknown`, а не `Error`?

В JavaScript через `throw` можно выбросить значение любого типа.

Например:

```ts
throw new Error("Ошибка");
```

```ts
throw "Ошибка";
```

```ts
throw 404;
```

```ts
throw null;
```

Поэтому TypeScript не может гарантировать, что в `catch` попадёт именно объект `Error`.

Безопасный тип переменной — `unknown`:

```ts
catch (error: unknown) {
  // Тип значения пока неизвестен
}
```

Перед использованием ошибки необходимо сузить её тип:

```ts
if (error instanceof Error) {
  console.error(error.message);
}
```

После проверки `instanceof` TypeScript понимает, что внутри блока `error` имеет тип `Error`.

---

#### 3. Зачем создавать собственный класс `ApiError`, если уже существует встроенный класс `Error`?

Стандартный класс `Error` содержит общие свойства ошибки:

```ts
name
message
stack
```

Но у него нет специальных данных HTTP-ошибки:

```ts
status
details
```

Собственный класс `ApiError` позволяет хранить HTTP-статус и тело ответа в отдельных типизированных свойствах:

```ts
class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

После проверки:

```ts
error instanceof ApiError
```

TypeScript сужает тип ошибки до `ApiError` и разрешает обращаться к свойствам:

```ts
error.status
error.message
error.details
```

Это позволяет обрабатывать HTTP-ошибку по структурированным данным, не извлекая статус из текста сообщения.

---

#### 4. В чём преимущество `Promise.all` по сравнению с последовательным ожиданием нескольких запросов?

При последовательном выполнении второй запрос начинается только после завершения первого:

```ts
const post = await fetchPost(1);
const user = await fetchUser(1);
```

Если запросы не зависят друг от друга, это увеличивает общее время ожидания.

`Promise.all` запускает независимые операции одновременно:

```ts
const [post, user] = await Promise.all([
  fetchPost(1),
  fetchUser(1),
]);
```

TypeScript сохраняет тип каждого результата:

```ts
post; // PostDto
user; // UserDto
```

Если хотя бы один из переданных `Promise` завершится ошибкой, `Promise.all` также завершится ошибкой.

`Promise.all` следует использовать для операций, которые можно выполнять независимо и для дальнейшей работы нужны все результаты.

---

#### 5. Зачем понадобилась универсальная функция `request<T>`, если уже существуют `fetchPost` и `fetchUser`?

Функции `fetchPost` и `fetchUser` содержали одинаковый код:

```ts
const response = await fetch(...);

await ensureSuccess(response);

return response.json() as Promise<...>;
```

Отличались только адрес запроса и тип ответа.

Функция `request<T>` выносит повторяющуюся логику в одно место:

```ts
async function request<T>(
  path: string,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
  );

  await ensureSuccess(response);

  return response.json() as Promise<T>;
}
```

После этого конкретные функции становятся короче:

```ts
async function fetchPost(
  id: number,
): Promise<PostDto> {
  return request<PostDto>(`/posts/${id}`);
}
```

```ts
async function fetchUser(
  id: number,
): Promise<UserDto> {
  return request<UserDto>(`/users/${id}`);
}
```

Функция `request<T>` выполняет общий HTTP-запрос, а `fetchPost` и `fetchUser` описывают конкретные операции API.

---

## Практическое задание

### 1. Модель комментария

```ts
type CommentDto = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};
```

Тип `CommentDto` описывает данные комментария, которые возвращает JSONPlaceholder.

---

### 2. Функция получения комментария

```ts
async function fetchComment(
  id: number,
): Promise<CommentDto> {
  return request<CommentDto>(
    `/comments/${id}`,
  );
}
```

Функция передаёт в `request` путь к комментарию и указывает ожидаемый тип ответа:

```ts
CommentDto
```

Поэтому возвращаемый тип функции:

```ts
Promise<CommentDto>
```

---

### 3. Параллельное выполнение запросов

```ts
const [post, user, comment] =
  await Promise.all([
    fetchPost(1),
    fetchUser(1),
    fetchComment(1),
  ]);

console.log(post.title);
console.log(user.name);
console.log(comment.email);
```

Все три запроса запускаются параллельно.

После выполнения `Promise.all`:

```ts
post
```

имеет тип `PostDto`,

```ts
user
```

имеет тип `UserDto`,

а:

```ts
comment
```

имеет тип `CommentDto`.

---

### 4. Полный код решения

```ts
const API_URL =
  "https://jsonplaceholder.typicode.com";

type PostDto = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type UserDto = {
  id: number;
  name: string;
  email: string;
};

type CommentDto = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function createApiError(
  response: Response,
): Promise<ApiError> {
  const text = await response.text();

  let details: unknown;

  if (text !== "") {
    try {
      details = JSON.parse(text);
    } catch {
      details = text;
    }
  }

  return new ApiError(
    response.status,
    `Запрос завершился с HTTP ${response.status}`,
    details,
  );
}

async function ensureSuccess(
  response: Response,
): Promise<Response> {
  if (!response.ok) {
    throw await createApiError(response);
  }

  return response;
}

async function request<T>(
  path: string,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
  );

  await ensureSuccess(response);

  return response.json() as Promise<T>;
}

async function fetchPost(
  id: number,
): Promise<PostDto> {
  return request<PostDto>(`/posts/${id}`);
}

async function fetchUser(
  id: number,
): Promise<UserDto> {
  return request<UserDto>(`/users/${id}`);
}

async function fetchComment(
  id: number,
): Promise<CommentDto> {
  return request<CommentDto>(
    `/comments/${id}`,
  );
}

try {
  const [post, user, comment] =
    await Promise.all([
      fetchPost(1),
      fetchUser(1),
      fetchComment(1),
    ]);

  console.log(post.title);
  console.log(user.name);
  console.log(comment.email);
} catch (error: unknown) {
  if (error instanceof ApiError) {
    console.error(
      `HTTP-ошибка ${error.status}`,
      error.details,
    );
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(
      "Неизвестная ошибка",
      error,
    );
  }
}
```
