// function first<T>(items:T[]): T | undefined {
//   return items[0];
// }

// const firstNumber = first([10, 20, 30]);

// const firstName = first(["Анна", "Борис"]);

// console.log(firstNumber);
// console.log(firstName);

type Product = {
  id: number;
  title: string;
  price: number;
};

const products: Product[] = [
  {
    id: 1,
    title: "Клавиатура",
    price: 4500,
  },
  {
    id: 2,
    title: "Монитор",
    price: 18000,
  },
];

function mapProduct<TInput, TOutput>(
  items: TInput[],
  transform: (product: TInput) => TOutput,
): TOutput[] {
  return items.map(transform);
}

const prices = mapProduct(products, (product) => product.price);

const titles = mapProduct(products, (product) => product.title);

console.log(titles);
console.log(prices);
