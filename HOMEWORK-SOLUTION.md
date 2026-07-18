## Ответы на контрольные вопросы для самопроверки

### 1. Почему `unknown` безопаснее, чем `any`?

`unknown` требует явного сужения типа перед использованием, а `any` отключает все проверки TypeScript.

**Пример:**

```typescript
let unknownValue: unknown = "hello";
let anyValue: any = "hello";

// any - можно делать что угодно (небезопасно)
anyValue.toUpperCase(); // работает
anyValue.foo.bar.baz; // работает, но упадёт в рантайме

// unknown - нельзя использовать без проверки
unknownValue.toUpperCase(); // Ошибка!

// unknown требует сужения
if (typeof unknownValue === "string") {
  unknownValue.toUpperCase(); // теперь безопасно
}
```

---

### 2. Что такое сужение типа?

Сужение типа (type narrowing) — это процесс, когда TypeScript уточняет тип на основе проверок в коде.

**Пример:**

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // Здесь тип: string
    console.log(value.toUpperCase());
  } else {
    // Здесь тип: number
    console.log(value.toFixed(2));
  }
}
```

**Способы сужения:**

- `typeof`
- `instanceof`
- `Array.isArray()`
- `in` оператор
- Пользовательские type guards (`is`)

---

### 3. Почему `typeof value === "object"` без проверки на `null` недостаточно?

Потому что `typeof null === "object"` в JavaScript (это исторический баг языка).

```typescript
const value = null;

if (typeof value === "object") {
  // Ошибка! null попал в блок для объектов
  // value.key выдаст ошибку в рантайме
}

// Правильно:
if (typeof value === "object" && value !== null) {
  // Теперь точно объект
}
```

---

### 4. Чем `void` отличается от `never`?

4. Чем void отличается от never?
void:
Функция завершается без возврата значения
Возвращает undefined
Используется для функций без return

never:
Функция никогда не завершается
Не возвращает ничего
Используется для функций, которые бросают ошибку или имеют бесконечный цикл

Пример:

```ts
function logMessage(msg: string): void {
    console.log(msg); // Завершается, но ничего не возвращает
}

function throwError(msg: string): never {
    throw new Error(msg); // Никогда не завершится
}

function infiniteLoop(): never {
    while (true) {} // Бесконечный цикл
}
```

---

### 5. Почему `as Product` не преобразует данные в `Product`?

`as` — это утверждение типа только на уровне TypeScript, оно ничего не делает в рантайме.

```typescript
type Product = { id: number; title: string; price: number };

const value = "not a product";
const product = value as Product;

console.log(product); // "not a product" (строка!)
console.log(product.id); // undefined (ошибка в рантайме)
```

`as` просто говорит компилятору: "Поверь мне, это Product". JavaScript игнорирует это.

---

### 6. Что даёт `as const`?

`as const` делает объект максимально конкретным.

```typescript
// Без as const
const colors = ["red", "green", "blue"];
// Тип: string[] (широкий)

// С as const
const colorsConst = ["red", "green", "blue"] as const;
// Тип: readonly ["red", "green", "blue"] (конкретный кортеж)
```

**Особенности `as const`:**

1. Все поля становятся `readonly`
2. Массивы становятся кортежами
3. Типы становятся литералами
4. Объекты становятся глубоко `readonly`

---

### 7. Чем `satisfies` отличается от обычной аннотации типа?

`satisfies` проверяет соответствие типу, но сохраняет выведенный тип, а аннотация переопределяет тип.

```typescript
type RGB = [red: number, green: number, blue: number];

// Аннотация типа (переопределяет тип)
const color1: RGB = [255, 0, 0];

// satisfies - проверяет, но не меняет тип
const color2 = [255, 0, 0] as const satisfies RGB;
// Тип: readonly [255, 0, 0] (максимально конкретный!)

const config = {
  port: 3000,
  env: "production",
} satisfies { port: number; env: string };

config.port; // тип: number (а не { port: number; env: string })
```

---

## Практическое задание

```typescript
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
      const message =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      return fail(`Ошибка в товаре с индексом ${index}: ${message}`);
    }
  });
}

// ============================================
// ТЕСТИРОВАНИЕ
// ============================================

// Тест 1: Корректные данные
const raw1: unknown = JSON.parse(
  '[{"id":1,"title":"Клавиатура","price":7500},{"id":2,"title":"Мышь","price":2500}]',
);
const products1 = parseProducts(raw1);
console.log("Тест 1 (корректные данные):", products1);

// Тест 2: Некорректный id (строка вместо числа)
const raw2: unknown = JSON.parse(
  '[{"id":1,"title":"Клавиатура","price":7500},{"id":"2","title":"Мышь","price":2500}]',
);
try {
  parseProducts(raw2);
} catch (error) {
  console.log("Тест 2 (некорректный id):", error.message);
}

// Тест 3: Не массив (объект)
const raw3: unknown = JSON.parse('{"id":1,"title":"Клавиатура","price":7500}');
try {
  parseProducts(raw3);
} catch (error) {
  console.log("Тест 3 (не массив):", error.message);
}

// Тест 4: Пустой массив
const raw4: unknown = JSON.parse("[]");
const products4 = parseProducts(raw4);
console.log("Тест 4 (пустой массив):", products4);

// Тест 5: Отсутствует поле price
const raw5: unknown = JSON.parse('[{"id":1,"title":"Клавиатура"}]');
try {
  parseProducts(raw5);
} catch (error) {
  console.log("Тест 5 (отсутствует поле):", error.message);
}

// Тест 6: null вместо объекта
const raw6: unknown = JSON.parse("[null]");
try {
  parseProducts(raw6);
} catch (error) {
  console.log("Тест 6 (null вместо объекта):", error.message);
}
```