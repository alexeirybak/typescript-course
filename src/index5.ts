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
    price: 18_000,
  },
  {
    id: 3,
    title: "Ноутбук",
    price: 85_000,
  },
];

const productTitles: string[] = products.map((product, index, array) => {
  return product.price + ` товар номер ${index}`;
});

console.log(productTitles)

// function selectedProducts(
//   products: Product[],
//   predicate?: (product: Product) => boolean,
// ): Product[] {
//   if (!predicate) {
//     return products;
//   }
//   return products.filter(predicate);
// }

// const expensiveProducts: Product[] = selectedProducts(products, (product) => {
//   return product.price >= 10_000;
// });

// const expensiveProductsWithoutCall: Product[] = selectedProducts(products);

// console.log(expensiveProducts);
// console.log(expensiveProductsWithoutCall);

type Formatter = {
  (price: number): string;
  locale: string;
};

const price: number = 2500;

const formatter = ((price: number) =>
  price.toLocaleString("ru-RU")) as Formatter;

formatter.locale = "ru-RU";

const formattedValue: string = formatter(price);

console.log(formattedValue);
console.log(formatter.locale);