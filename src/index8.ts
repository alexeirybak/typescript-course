type Counter = {
  value: number;
  increment(this: Counter, amount: number): void;
};

const counter: Counter = {
  value: 3,

  increment(amount) {
    this.value += amount;
  },
};

const increment = counter.increment;

increment.call(counter, 5);


console.log(counter.value);
