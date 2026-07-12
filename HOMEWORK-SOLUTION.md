# Решение домашнего задания

## Контрольные вопросы

### 1. В чем основное отличие `type` от `interface`?

`interface` предназначен для описания объектных контрактов и поддерживает расширение (`extends`) и слияние объявлений (declaration merging).

`type` — это псевдоним типа. С его помощью можно дать имя практически любому типу: объекту, объединению, пересечению, функции, кортежу и т.д.

Для большинства обычных объектов можно использовать оба варианта.

---

### 2. Какие типы можно описать через `type`, но нельзя напрямую через `interface`?

Через `type` можно описывать:

* объединения (`union`);
* пересечения (`intersection`);
* кортежи (`tuple`);
* типы функций;
* литеральные типы;
* псевдонимы примитивных типов.

Например:

```ts
type Id = string | number;

type Point = [number, number];

type Handler = (message: string) => void;

type Status = "draft" | "published";
```

---

### 3. Что такое declaration merging и для чего оно используется?

Declaration merging — это автоматическое объединение нескольких интерфейсов с одинаковым именем.

```ts
interface Settings {
  theme: "light" | "dark";
}

interface Settings {
  locale: "ru" | "en";
}
```

TypeScript объединит их в один интерфейс.

Эта возможность чаще всего используется при расширении типов библиотек и встроенных объектов JavaScript.

---

### 4. Что делает ключевое слово `implements`?

`implements` проверяет, что класс соответствует указанному контракту.

```ts
interface Publishable {
  publish(): void;
}

class Article implements Publishable {
  publish(): void {
    console.log("Статья опубликована");
  }
}
```

После компиляции `implements` исчезает и никак не влияет на JavaScript-код.

---

### 5. Чем обычный `enum` отличается от `const enum`?

Обычный `enum` существует и во время компиляции, и во время выполнения программы.

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
}
```

`const enum` используется только во время компиляции.

```ts
const enum Direction {
  Up = "UP",
  Down = "DOWN",
}
```

TypeScript подставляет значения прямо в код и не создает объект перечисления.

---

### 6. В чем преимущества литерального объединения перед строковым `enum`?

Литеральное объединение:

* не создает дополнительный JavaScript-код;
* использует обычные строки;
* хорошо подходит для работы с API;
* требует меньше кода.

```ts
type UserRole = "admin" | "editor" | "viewer";
```

---

### 7. Как получить union-тип из объекта, объявленного с `as const`?

```ts
const DocumentStatus = {
  Draft: "draft",
  Published: "published",
  Archived: "archived",
} as const;

type DocumentStatus =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];
```

Получится:

```ts
type DocumentStatus =
  | "draft"
  | "published"
  | "archived";
```

---

# Практическое задание

## Задание 1–4

```ts
const DocumentStatus = {
  Draft: "draft",
  Published: "published",
  Archived: "archived",
} as const;

type DocumentStatus =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];

interface DocumentBase {
  id: number;
  author: string;
  createdAt: Date;
  status: DocumentStatus;
}

type Article = DocumentBase & {
  type: "article";
  title: string;
  content: string;
};

type Video = DocumentBase & {
  type: "video";
  title: string;
  duration: number;
  videoUrl: string;
};

type Podcast = DocumentBase & {
  type: "podcast";
  title: string;
  duration: number;
  audioUrl: string;
};

type Document = Article | Video | Podcast;

interface Publishable {
  publish(): void;
}

class ArticleDocument implements Publishable {
  constructor(
    public readonly id: number,
    public author: string,
    public readonly createdAt: Date,
    public status: DocumentStatus,
    public title: string,
    public content: string,
  ) {}

  publish(): void {
    this.status = DocumentStatus.Published;
    console.log(`Статья «${this.title}» опубликована.`);
  }
}

function getDocumentInfo(document: Document): string {
  switch (document.type) {
    case "article":
      return `Статья: ${document.title}
Автор: ${document.author}
Статус: ${document.status}`;

    case "video":
      return `Видео: ${document.title}
Автор: ${document.author}
Длительность: ${document.duration} мин.
Статус: ${document.status}`;

    case "podcast":
      return `Подкаст: ${document.title}
Автор: ${document.author}
Длительность: ${document.duration} мин.
Статус: ${document.status}`;
  }
}
```

### Проверка

```ts
const article: Article = {
  id: 1,
  author: "Анна",
  createdAt: new Date(),
  status: DocumentStatus.Draft,
  type: "article",
  title: "Основы TypeScript",
  content: "Содержимое статьи",
};

const video: Video = {
  id: 2,
  author: "Иван",
  createdAt: new Date(),
  status: DocumentStatus.Published,
  type: "video",
  title: "Объектные типы",
  duration: 25,
  videoUrl: "https://example.com/video",
};

const podcast: Podcast = {
  id: 3,
  author: "Мария",
  createdAt: new Date(),
  status: DocumentStatus.Archived,
  type: "podcast",
  title: "Разговор о TypeScript",
  duration: 45,
  audioUrl: "https://example.com/podcast",
};

console.log(getDocumentInfo(article));
console.log(getDocumentInfo(video));
console.log(getDocumentInfo(podcast));

const articleDocument = new ArticleDocument(
  4,
  "Алексей",
  new Date(),
  DocumentStatus.Draft,
  "TypeScript на практике",
  "Текст статьи",
);

articleDocument.publish();

console.log(articleDocument.status);
```

---

# Дополнительное задание ⭐

## Вариант 1. Строковый `enum`

```ts
enum UserRoleEnum {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

function canDelete(role: UserRoleEnum): boolean {
  return role === UserRoleEnum.Admin;
}
```

---

## Вариант 2. Литеральное объединение

```ts
type UserRoleUnion =
  | "admin"
  | "editor"
  | "viewer";

function canDelete(role: UserRoleUnion): boolean {
  return role === "admin";
}
```

---

## Вариант 3. Объект `as const`

```ts
const UserRole = {
  Admin: "admin",
  Editor: "editor",
  Viewer: "viewer",
} as const;

type UserRole =
  (typeof UserRole)[keyof typeof UserRole];

function canDelete(role: UserRole): boolean {
  return role === UserRole.Admin;
}
```

---

## Сравнение

**Строковый `enum`**

✅ Код хорошо читается благодаря именованным значениям (`UserRoleEnum.Admin`).

❌ Создает дополнительный объект в JavaScript.

---

**Литеральное объединение**

✅ Не создает дополнительного JavaScript.

✅ Очень простое описание типа.

❌ Строковые литералы могут повторяться в разных местах программы.

---

**Объект `as const`**

✅ Не использует специальную runtime-конструкцию `enum`.

✅ Позволяет получать значения как `UserRole.Admin`.

✅ Автоматически выводит литеральный union-тип.

✅ Один источник истины для значений и типов.

---

### Итог

Для нового проекта я бы выбрал вариант с `as const`, потому что он сочетает преимущества литеральных объединений и `enum`: не требует отдельной runtime-конструкции TypeScript, предоставляет именованные значения и автоматически выводит точный тип из объекта.
