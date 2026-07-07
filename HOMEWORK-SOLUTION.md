# Урок 2. tsconfig.json — краткое решение

## Контрольные вопросы (кратко)

1. **tsconfig.json** — файл конфигурации TypeScript, указывает корневые файлы, настройки компилятора, выходную директорию и правила проверки типов.

2. **npx tsc** — запускает компилятор TypeScript, который превращает `.ts` файлы в `.js` согласно `tsconfig.json`.

3. Исходный TypeScript находится в папке **`src/`** (указывается в `rootDir`).

4. Готовый JavaScript попадает в папку **`dist/`** (указывается в `outDir`).

5. `strict` — это **набор отдельных флагов** (`noImplicitAny`, `strictNullChecks` и др.), которые можно включать/отключать по отдельности.

6. **`noImplicitAny`** (запрещает неявный `any`) и **`strictNullChecks`** (защита от `null`/`undefined`).

7. **`noUncheckedIndexedAccess`** — при доступе по индексу (`arr[5]`) добавляет `undefined` к типу, заставляя проверять наличие элемента.

8. **Нет**, `noImplicitReturns` не входит в `strict`, включается отдельно.

9. При `noEmitOnError: true` компилятор **не создаёт** `.js` файлы, если есть ошибки типов.

10. **`tsc`** — компилирует TS → JS. **`node`** — запускает JS. **`tsx`** — запускает TS напрямую (без создания JS файлов).

---

## Практическое задание

### Создаём файл `src/index.ts`:

```typescript
type Product = {
  id: number;
  title: string;
  price: number;
};

const product: Product = {
  id: 1,
  title: "Клавиатура",
  price: 7500,
};

function formatProduct(product: Product): string {
  return `${product.title}: ${product.price} ₽`;
}

console.log(formatProduct(product));
```

### Выполняем команды:

```bash
npx tsc
```

После компиляции в `dist/index.js` появится JavaScript код.

```bash
node dist/index.js
```

Вывод:
```
Клавиатура: 7500 ₽
```

### Меняем цену на строку:

```typescript
const product: Product = {
  id: 1,
  title: "Клавиатура",
  price: "7500",  // строка вместо числа
};
```

### Ошибка TypeScript:

```
error TS2322: Type 'string' is not assignable to type 'number'.
```

### Возвращаем число:

```typescript
const product: Product = {
  id: 1,
  title: "Клавиатура",
  price: 7500,  // ✅ число
};
```

```bash
npx tsc          # сборка успешна
node dist/index.js  # "Клавиатура: 7500 ₽"
```