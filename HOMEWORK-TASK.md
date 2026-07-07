# Урок 4. Специальные типы TypeScript

## Домашнее задание

## Контрольные вопросы

1. Почему `unknown` безопаснее, чем `any`?
2. Что такое сужение типа?
3. Почему `typeof value === "object"` без проверки на `null` недостаточно?
4. Чем `void` отличается от `never`?
5. Почему `as Product` не преобразует данные в `Product`?
6. Что даёт `as const`?
7. Чем `satisfies` отличается от обычной аннотации типа?

## Практическое задание

Получите неизвестный JSON со списком товаров и напишите ручную проверку массива.

Требования:

- входные данные должны начинаться как `unknown`;
- каждый элемент массива нужно проверить как `Product`;
- ошибка должна содержать индекс проблемного элемента;
- нельзя использовать `any`;
- нельзя использовать двойное утверждение `as unknown as Product`;
- нельзя использовать non-null assertion `!`.

Заготовка:

```ts
type Product = {
  id: number;
  title: string;
  price: number;
};

function fail(message: string): never {
  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseProduct(value: unknown): Product {
  if (!isRecord(value)) {
    return fail("Product должен быть объектом");
  }

  if (typeof value.id !== "number") {
    return fail("Product.id должен быть числом");
  }

  if (typeof value.title !== "string") {
    return fail("Product.title должен быть строкой");
  }

  if (typeof value.price !== "number") {
    return fail("Product.price должен быть числом");
  }

  return {
    id: value.id,
    title: value.title,
    price: value.price,
  };
}

function parseProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) {
    return fail("Ожидался массив товаров");
  }

  return value.map((item, index) => {
    try {
      return parseProduct(item);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Неизвестная ошибка";
      return fail(`Ошибка в товаре с индексом ${index}: ${message}`);
    }
  });
}

const raw: unknown = JSON.parse(
  '[{"id":1,"title":"Клавиатура","price":7500},{"id":2,"title":"Мышь","price":2500}]'
);

const products = parseProducts(raw);
console.log(products);
```