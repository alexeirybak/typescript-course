## Урок 2. tsconfig.json: настройки TypeScript без головной боли

## Домашняя работа

## Контрольные вопросы

1. Для чего нужен файл `tsconfig.json`?
2. Что делает команда `npx tsc`?
3. В какой папке находится исходный TypeScript?
4. В какую папку попадает готовый JavaScript?
5. Почему `strict` правильнее называть набором проверок, а не уровнем?
6. Какие две проверки из набора `strict` особенно важны для начинающего?
7. Что проверяет параметр `noUncheckedIndexedAccess`?
8. Входит ли `noImplicitReturns` в набор `strict`?
9. Что произойдёт при ошибке типов, если включён `noEmitOnError`?
10. Чем отличаются команды `tsx`, `tsc` и `node`?

Создайте в `src/index.ts` тип товара:

```ts
type Product = {
  id: number;
  title: string;
  price: number;
};
```

Создайте товар:

```ts
const product: Product = {
  id: 1,
  title: "Клавиатура",
  price: 7500,
};
```

Добавьте функцию:

```ts
function formatProduct(product: Product): string {
  return `${product.title}: ${product.price} ₽`;
}
```

Выведите результат:

```ts
console.log(formatProduct(product));
```

Затем:

1. Выполните `npx tsc`.
2. Запустите `node dist/index.js`.
3. Временно замените цену на строку.
4. Прочитайте ошибку TypeScript.
5. Верните числовую цену и убедитесь, что проект снова собирается.