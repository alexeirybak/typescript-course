# Урок 3. Базовые типы и моделирование данных

## Домашнее задание

## Контрольные вопросы

1. Чем массив отличается от кортежа?
2. Почему `discountPercent?: number` при чтении дает `number | undefined`?
3. В чем разница между `||` и `??` для значения `0`?
4. Почему литеральное объединение надежнее произвольной строки для статуса?
5. Защищает ли псевдоним `type ProductId = number` от передачи цены вместо ID?
6. Что такое сужение типа?
7. Зачем объектному объединению нужно дискриминирующее поле?
8. Почему `value!` не делает значение безопасным во время выполнения?

### Практическое задание

### Задание 1. Модель оплаты

Расширьте модель заказа, добавив покупателя и оплату.

**Условия:**

1. Создайте тип `Customer` с полями:
   - `name: string` — имя покупателя
   - `email: string` — электронная почта
   - `phone?: string` — телефон (необязательно)

2. Создайте тип `Payment` — объединение трёх вариантов оплаты:
   - `card` — оплата картой, хранить `lastFourDigits: string`
   - `cash` — оплата наличными, хранить `changeFrom: number` (сдача с какой суммы)
   - `bank-transfer` — банковский перевод, хранить `companyInn: string`

3. Реализуйте функцию `formatPayment(payment: Payment): string`, которая возвращает строковое описание способа оплаты, используя сужение по дискриминирующему полю `method`.

**Заготовка:**

```ts
type Customer = {
  // ваш код
};

type Payment =
  // ваш код
  ;

function formatPayment(payment: Payment): string {
  // ваш код
}
```

#### Пример использования:

```ts
const customer: Customer = {
  name: "Иван Петров",
  email: "ivan@example.com",
  phone: "+7 999 123 45 67",
};

const payment: Payment = {
  method: "cash",
  changeFrom: 5000,
};

console.log(formatPayment(payment));
```

### Задание 2. Полная модель корзины

Создайте модель корзины интернет-магазина с типами и функциями для работы с ней.

Требования к модели данных:

1. Товар (Product):
   id: number — идентификатор
   name: string — название
   price: number — цена
   category: string — категория
2. Позиция в корзине (CartItem):
   product: Product — товар
   quantity: number — количество (минимум 1)
3. Купон (Coupon):
   code: string — код купона
   discountPercent: number — процент скидки (от 0 до 100)
   Корзина (Cart) должна содержать:
   items: CartItem[] — список позиций
   coupon?: Coupon — применённый купон (необязательно)
4. Функции для реализации:

- addItem(cart: Cart, product: Product, quantity: number): Cart — добавить товар в корзину. Если товар уже есть, увеличить количество.
- removeItem(cart: Cart, productId: number): Cart — удалить позицию из корзины по id товара.
- updateQuantity(cart: Cart, productId: number, quantity: number): Cart — изменить количество товара. Если quantity <= 0, удалить позицию.
- applyCoupon(cart: Cart, coupon: Coupon): Cart — применить купон к корзине.
- calculateTotal(cart: Cart): number — рассчитать итоговую сумму с учётом купона.

5. Ограничения (runtime-проверки):
   Количество товара не может быть меньше 1
   Скидка купона должна быть в диапазоне от 0 до 100
   Цена товара не может быть отрицательной

#### Заготовка:

```ts
type Product = {
  // ваш код
};

type CartItem = {
  // ваш код
};

type Coupon = {
  // ваш код
};

type Cart = {
  // ваш код
};

function addItem(cart: Cart, product: Product, quantity: number): Cart {
  // ваш код
}

function removeItem(cart: Cart, productId: number): Cart {
  // ваш код
}

function updateQuantity(cart: Cart, productId: number, quantity: number): Cart {
  // ваш код
}

function applyCoupon(cart: Cart, coupon: Coupon): Cart {
  // ваш код
}

function calculateTotal(cart: Cart): number {
  // ваш код
}
```

### Дополнительное задание (для углублённой практики)

Добавьте разные состояния корзины через объединение объектов:
empty — корзина пуста
active — корзина с товарами
checkout — корзина в процессе оформления заказа

У каждого состояния должен быть свой набор полей. Например, у checkout может появиться поле deliveryAddress.

```ts
type CartState =
  | { status: "empty" }
  | { status: "active"; items: CartItem[]; coupon?: Coupon }
  | {
      status: "checkout";
      items: CartItem[];
      coupon?: Coupon;
      deliveryAddress: string;
    };
```
Реализуйте функцию checkout(cart: CartState): CartState, которая переводит корзину из состояния active в checkout с проверкой, что корзина не пуста.
