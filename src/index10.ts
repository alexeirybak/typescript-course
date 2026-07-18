type Order = {
  id: number; 
  total: number; 
  status: "draft" | "paid" | "cancelled";
};

// Тип-предикат: функция, которая принимает заказ и возвращает boolean
// Используется для фильтрации заказов по условию
type OrderPredicate = (order: Order) => boolean;

// Тип-сортировщик: функция сравнения двух заказов
// Возвращает отрицательное число, если left < right, положительное если left > right, 0 если равны
type OrderSorter = (left: Order, right: Order) => number;

// Функция фильтрации заказов
function filterOrders(
  orders: readonly Order[], // readonly - массив только для чтения, нельзя изменить
  predicate: OrderPredicate, // Функция-условие для фильтрации
): Order[] { // Возвращает новый массив отфильтрованных заказов
  return orders.filter(predicate); // Встроенный метод filter применяет предикат к каждому элементу
}

// Функция сортировки заказов
function sortOrders(
  orders: readonly Order[], // readonly - массив только для чтения
  sorter: OrderSorter, // Функция сравнения для сортировки
): Order[] { // Возвращает новый отсортированный массив
  return [...orders].sort(sorter); // [...orders] - создаём копию массива (spread-оператор), чтобы не мутировать оригинал
  // sort(sorter) - сортирует копию, используя функцию сравнения
}

// Универсальная функция группировки элементов по ключу
function groupBy<T, K extends PropertyKey>( // T - тип элементов, K - тип ключа (должен быть строкой, числом или символом)
  items: readonly T[], // Массив элементов для группировки (только для чтения)
  getKey: (item: T) => K, // Функция, которая извлекает ключ из элемента
): Record<K, T[]> { // Возвращает объект, где ключи - это K, а значения - массивы элементов T
  return items.reduce( // Используем reduce для построения объекта группировки
    (groups, item) => { // groups - аккумулятор (объект с группами), item - текущий элемент
      const key = getKey(item); // Получаем ключ для текущего элемента
      (groups[key] ??= []).push(item); // Если groups[key] не существует, создаём пустой массив (??= - nullish coalescing assignment)
      // Затем добавляем текущий элемент в массив
      return groups; // Возвращаем обновлённый объект групп
    },
    {} as Record<K, T[]>, // Начальное значение - пустой объект, приведённый к типу Record<K, T[]>
  );
}