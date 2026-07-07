# Домашняя работа по TypeScript

## Контрольные вопросы

### 1. Что такое тип значения?

**Тип значения** - это характеристика данных, которая определяет:

- Множество допустимых значений
- Операции, которые можно выполнять над этими значениями
- Способ хранения данных в памяти

Например, тип `number` в JavaScript включает все числа (целые, дробные, положительные, отрицательные), а тип `string` - все текстовые значения.

---

### 2. Чем динамическая типизация отличается от статической?

| Динамическая типизация (JavaScript)           | Статическая типизация (TypeScript)      |
| --------------------------------------------- | --------------------------------------- |
| Типы проверяются во время выполнения          | Типы проверяются во время компиляции    |
| Переменная может менять тип в процессе работы | Тип переменной фиксирован и не меняется |
| Ошибки типов проявляются в рантайме           | Ошибки типов находятся до запуска кода  |
| Более гибкая, но менее безопасная             | Более строгая, но более надежная        |

**Пример динамической типизации:**

```javascript
let x = 5; // number
x = "hello"; // теперь string - это допустимо в JS
```

**Пример статической типизации:**

```typescript
let x: number = 5;
x = "hello"; // ❌ Ошибка: Type 'string' is not assignable to type 'number'
```

---

### 3. Когда JavaScript обнаруживает ошибку типа, а когда TypeScript?

- **JavaScript** обнаруживает ошибки типа **во время выполнения** (runtime), когда пытается выполнить некорректную операцию:

```javascript
let x = 5;
x.toUpperCase(); // ❌ Ошибка в рантайме: x.toUpperCase is not a function
```

- **TypeScript** обнаруживает ошибки типа **на этапе компиляции** (compile-time), до запуска кода:

```typescript
let x: number = 5;
x.toUpperCase(); // ❌ Ошибка при компиляции: Property 'toUpperCase' does not exist on type 'number'
```

---

### 4. Для чего нужны аннотации string и number?

**Аннотации типов** нужны для:

1. **Явного указания типа** переменной/параметра
2. **Защиты от ошибок** - TypeScript проверяет соответствие типов
3. **Улучшения читаемости** кода - сразу видно, какие данные ожидаются
4. **Автодополнения** в IDE - редактор подсказывает доступные методы

```typescript
function greet(name: string, age: number): string {
  return `Привет, ${name}! Тебе ${age} лет.`;
}
```

---

### 5. Остаются ли типы в JavaScript после запуска?

**Нет, не остаются.** TypeScript - это надстройка над JavaScript. После компиляции:

- Все аннотации типов удаляются
- Исчезают интерфейсы и пользовательские типы (type, interface)
- Код превращается в обычный JavaScript без типов

```typescript
// TypeScript код
let x: number = 42;

// После компиляции в JavaScript
let x = 42;
```

---

### 6. Почему number не гарантирует положительное число?

Тип `number` в TypeScript/JavaScript включает **все числовые значения**:

- Положительные числа (1, 2, 3...)
- Отрицательные числа (-1, -2, -3...)
- Ноль (0)
- Специальные значения (Infinity, -Infinity, NaN)

TypeScript не может знать, что конкретно вы имеете в виду, поэтому `number` - это просто "любое число". Для ограничения значений нужно использовать дополнительные проверки или advanced типы.

---

## Практическое задание

### 1. Создание типа и функции

```typescript
// Определение типа Product
type Product = {
  id: number;
  title: string;
  price: number;
};

// Функция форматирования товара
function formatProduct(product: Product): string {
  return `${product.title}: ${product.price} ₽`;
}

// Создание корректного товара
const product1: Product = {
  id: 1,
  title: "Ноутбук",
  price: 75000,
};

// Вызов функции
console.log(formatProduct(product1)); // "Ноутбук: 75000 ₽"
```

---

### 2. Попытка записать цену строкой (ошибка TypeScript)

```typescript
// ❌ Ошибка TypeScript
const product2: Product = {
  id: 2,
  title: "Телефон",
  price: "50000", // ❌ Type 'string' is not assignable to type 'number'
};

// Ошибка в IDE/компиляторе:
// Type 'string' is not assignable to type 'number'.
```

**Объяснение:** TypeScript не позволяет присвоить строку полю, ожидающему число, так как это нарушает контракт типа.

---

### 3. Создание товара с отрицательной ценой

```typescript
// ✅ TypeScript принимает (синтаксически корректно)
const product3: Product = {
  id: 3,
  title: "Скидка",
  price: -100, // Отрицательная цена
};

console.log(formatProduct(product3)); // "Скидка: -100 ₽"
```

---

### 4. Почему TypeScript принимает отрицательное число?

TypeScript принимает отрицательное число, потому что:

- **Тип `number` включает все числовые значения** (и положительные, и отрицательные)
- **TypeScript не знает бизнес-логику** - он не может знать, что цена не может быть отрицательной
- **TypeScript проверяет только синтаксис и структуру типов**, а не бизнес-правила
- Отрицательное число - это корректное число с точки зрения TypeScript

---

### 5. Добавление проверки, запрещающей отрицательную цену

```typescript
type Product = {
  id: number;
  title: string;
  price: number;
};

// Вариант 1: Проверка при создании товара
function createProduct(
  id: number,
  title: string,
  price: number,
): Product | null {
  if (price < 0) {
    console.error("Ошибка: цена не может быть отрицательной!");
    return null;
  }
  return { id, title, price };
}

// Вариант 2: Проверка в функции форматирования
function formatProductSafe(product: Product): string {
  if (product.price < 0) {
    return `${product.title}: Цена указана некорректно!`;
  }
  return `${product.title}: ${product.price} ₽`;
}

// Вариант 3: Проверка с бросанием ошибки
function formatProductWithValidation(product: Product): string {
  if (product.price < 0) {
    throw new Error("Цена не может быть отрицательной!");
  }
  return `${product.title}: ${product.price} ₽`;
}

// Использование
const product4 = createProduct(4, "Книга", 500);
if (product4) {
  console.log(formatProductSafe(product4)); // "Книга: 500 ₽"
}

const product5 = createProduct(5, "Скидка", -50);
if (!product5) {
  console.log("Не удалось создать товар с отрицательной ценой");
}

// Вариант 4: Использование brand-типов (продвинутый)
type PositiveNumber = number & { __brand: "PositiveNumber" };

function positiveNumber(value: number): PositiveNumber {
  if (value < 0) {
    throw new Error("Число должно быть положительным");
  }
  return value as PositiveNumber;
}

type ProductAdvanced = {
  id: number;
  title: string;
  price: PositiveNumber;
};

// Создание безопасного товара
const product6: ProductAdvanced = {
  id: 6,
  title: "Флешка",
  price: positiveNumber(1000),
};

console.log(formatProduct(product6)); // "Флешка: 1000 ₽"
```

---

## Полный код решения

```typescript
// Определение типа
type Product = {
  id: number;
  title: string;
  price: number;
};

// Функция форматирования
function formatProduct(product: Product): string {
  return `${product.title}: ${product.price} ₽`;
}

// 1. Корректный товар
const product1: Product = {
  id: 1,
  title: "Ноутбук",
  price: 75000,
};
console.log(formatProduct(product1));

// 2. Некорректный товар (ошибка TypeScript)
// const product2: Product = {
//   id: 2,
//   title: "Телефон",
//   price: "50000"  // ❌ Ошибка: Type 'string' is not assignable to type 'number'
// };

// 3. Товар с отрицательной ценой (TypeScript принимает)
const product3: Product = {
  id: 3,
  title: "Скидка",
  price: -100,
};
console.log(formatProduct(product3)); // "Скидка: -100 ₽"

// 4. Почему TypeScript принимает отрицательное число?
console.log(
  "TypeScript принимает отрицательное число, потому что тип number включает все числовые значения (положительные, отрицательные, ноль). TypeScript проверяет только структуру типов, а не бизнес-логику.",
);

// 5. Проверка, запрещающая отрицательную цену
function createProductWithValidation(
  id: number,
  title: string,
  price: number,
): Product | string {
  if (price < 0) {
    return "Ошибка: цена не может быть отрицательной!";
  }
  return { id, title, price };
}

// Проверка
const product4 = createProductWithValidation(4, "Книга", -100);
if (typeof product4 === "string") {
  console.log(product4); // "Ошибка: цена не может быть отрицательной!"
} else {
  console.log(formatProduct(product4));
}
```

---

## Вывод

TypeScript - это мощный инструмент для статической проверки типов, но он не заменяет бизнес-логику и валидацию данных. TypeScript помогает находить ошибки на этапе разработки, но проверки бизнес-правил (например, "цена не может быть отрицательной") должны быть реализованы отдельно с помощью runtime-валидации.
