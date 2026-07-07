## Ответы на контрольные вопросы для самопроверки

1. Массив хранит любое количество элементов одного типа. Кортеж хранит заранее известное количество элементов, и у каждой позиции может быть свой тип.
2. Потому что поле с `?` может отсутствовать. Если поля нет, при чтении получится `undefined`.
3. `??` срабатывает только для `null` и `undefined`, а `||` также срабатывает для `0`, пустой строки и `false`.
4. Литеральное объединение ограничивает список допустимых строк и помогает поймать опечатки.
5. Нет. `Money` и `ProductId` как псевдонимы `number` остаются совместимыми.
6. Сужение типа - это ситуация, когда после проверки TypeScript знает более точный тип значения.
7. По дискриминирующему полю TypeScript понимает, какой именно вариант объекта перед ним.
8. Потому что `!` влияет только на проверку TypeScript. Он не добавляет runtime-проверку и не меняет само значение.

### Задание 1. Модель оплаты

```ts
type Customer = {
  name: string;
  email: string;
  phone?: string;
};

type Payment =
  | { method: "card"; lastFourDigits: string }
  | { method: "cash"; changeFrom: number }
  | { method: "bank-transfer"; companyInn: string };

function formatPayment(payment: Payment): string {
  if (payment.method === "card") {
    return `Карта, последние цифры: ${payment.lastFourDigits}`;
  }

  if (payment.method === "cash") {
    return `Наличные, подготовить сдачу с ${payment.changeFrom}`;
  }

  return `Банковский перевод, ИНН: ${payment.companyInn}`;
}
```
Задание 2. Полная модель корзины
```ts
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type Coupon = {
  code: string;
  discountPercent: number;
};

type Cart = {
  items: CartItem[];
  coupon?: Coupon;
};

function addItem(cart: Cart, product: Product, quantity: number): Cart {
  if (quantity < 1) {
    throw new Error("Количество должно быть не меньше 1");
  }

  const existingItem = cart.items.find(
    (item) => item.product.id === product.id
  );

  if (existingItem) {
    return {
      ...cart,
      items: cart.items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ),
    };
  }

  return {
    ...cart,
    items: [...cart.items, { product, quantity }],
  };
}

function removeItem(cart: Cart, productId: number): Cart {
  return {
    ...cart,
    items: cart.items.filter((item) => item.product.id !== productId),
  };
}

function updateQuantity(cart: Cart, productId: number, quantity: number): Cart {
  if (quantity <= 0) {
    return removeItem(cart, productId);
  }

  return {
    ...cart,
    items: cart.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    ),
  };
}

function applyCoupon(cart: Cart, coupon: Coupon): Cart {
  if (coupon.discountPercent < 0 || coupon.discountPercent > 100) {
    throw new Error("Скидка должна быть от 0 до 100");
  }

  return {
    ...cart,
    coupon,
  };
}

function calculateTotal(cart: Cart): number {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!cart.coupon) {
    return subtotal;
  }

  const discount = (subtotal * cart.coupon.discountPercent) / 100;
  return subtotal - discount;
}
```
Дополнительное задание (состояния корзины)
```ts
type CartState =
  | { status: "empty" }
  | { status: "active"; items: CartItem[]; coupon?: Coupon }
  | { status: "checkout"; items: CartItem[]; coupon?: Coupon; deliveryAddress: string };

function addItemToState(
  state: CartState,
  product: Product,
  quantity: number
): CartState {
  if (state.status === "checkout") {
    throw new Error("Нельзя изменять корзину после оформления");
  }

  if (state.status === "empty") {
    return {
      status: "active",
      items: [{ product, quantity }],
    };
  }

  const existingItem = state.items.find(
    (item) => item.product.id === product.id
  );

  if (existingItem) {
    return {
      ...state,
      items: state.items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ),
    };
  }

  return {
    ...state,
    items: [...state.items, { product, quantity }],
  };
}

function checkout(state: CartState, deliveryAddress: string): CartState {
  if (state.status === "empty") {
    throw new Error("Нельзя оформить пустую корзину");
  }

  if (state.status === "checkout") {
    throw new Error("Корзина уже оформлена");
  }

  return {
    status: "checkout",
    items: state.items,
    coupon: state.coupon,
    deliveryAddress,
  };
}

function calculateTotalForState(state: CartState): number {
  if (state.status === "empty") {
    return 0;
  }

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!state.coupon) {
    return subtotal;
  }

  const discount = (subtotal * state.coupon.discountPercent) / 100;
  return subtotal - discount;
}
```
