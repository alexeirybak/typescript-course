// const amount: number = 1250;

// function formatMoney(amount: number, currency = "RUB"): string {
//   return `${amount.toFixed(2)} ${currency}`;
// }

// const defaultMoneyLabel: string = formatMoney(amount);
// const usdMoneyLabel: string = formatMoney(amount, "USD");

// console.log(defaultMoneyLabel);
// console.log(usdMoneyLabel);

type Currency = "RUB" | "USD" | "EUR";

const strictAmount: number = 1250;
const strictCurrency: Currency = "EUR";

function formatMoneyStrict(amount: number, currency: Currency = "RUB"): string {
  return `${amount.toFixed(2)} ${currency}`;
}

const strictDefaultMoneyLabel: string = formatMoneyStrict(strictAmount);
const strictMoneyLabel: string = formatMoneyStrict(
  strictAmount,
  strictCurrency,
);

console.log(strictDefaultMoneyLabel);
console.log(strictMoneyLabel);