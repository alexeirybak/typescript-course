// interface PriceFormatter {
//   format(price: number): string;
// }

// class RubleFormatter implements PriceFormatter {
//   format(price: number): string {
//     return `${price.toLocaleString("ru-RU")} ₽`;
//   }
// }

// const formatter = new RubleFormatter();

// console.log(formatter.format(2500));

type Logger = {
  log(message: string): void;
};

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}