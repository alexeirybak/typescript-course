class Temperature {
  constructor(private celsius: number) {}

  get fahrenheit(): number {
    return this.celsius * 1.8 + 32;
  }

  set fahrenheit(value: number) {
    this.celsius = (value - 32) / 1.8;
  }
}

const temperature = new Temperature(20);

console.log(temperature.fahrenheit);

temperature.fahrenheit = 68;