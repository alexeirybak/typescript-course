// const productPrice: number = 1200;
// const discountPercent: number = 15;

// function calculateDiscount(price: number, percent: number): number {
//   return price * (percent / 100);
// }

// const discount: number = calculateDiscount(productPrice, discountPercent);

// console.log(discount);

// const price: number = 3500;

// function getPriceLabel(price: number): string {
//   return `${price.toLocaleString("ru-RU")} руб.`;
// }

// const priceLabel: string = getPriceLabel(price);

// console.log(priceLabel);

const userName: string = "Анна";
const userTitle: string = "доктор";

function greet(name: string, title?: string): string {
  if (title === undefined) {
    return `Здравствуйте, ${name}`;
  }

  return `Здравствуйте, ${title} ${name}`;
}

const greetingWithoutTitle: string = greet(userName);
const greetingWithTitle: string = greet(userName, userTitle);

console.log(greetingWithoutTitle);
console.log(greetingWithTitle);