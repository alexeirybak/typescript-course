// type PriceFormatter = (price: number) => string;

// const productPrice: number = 2500;

// const formatRubles: PriceFormatter = (price) => {
//   return `${price.toLocaleString("ru-RU")} ₽`;
// };

// const formattedPrice: string = formatRubles(productPrice);

// console.log(formattedPrice);

// type Formatter = {
//   (price: number): string;
//   locale: string;
// };

// const price: number = 2500;

// const formatter: Formatter = Object.assign((price: number) =>
//   price.toLocaleString(formatter.locale),
// );

// console.log(formatter(2500));

// formatter.locale = "en-US";

// const formattedValue: string = formatter(price);

// console.log(formattedValue);

// console.log(formatter.locale);

const locale: string = "ru-RU";
const price: number = 2500;

const formatPrice = (price: number): string => {
  return price.toLocaleString(locale);
};

const formattedPrice: string = formatPrice(price);

console.log(formattedPrice);
console.log(locale);