const firstNumber: number = 10;
const secondNumber: number = 20;
const thirdNumber: number = 30;

function sum(...numbers: number[]): number {
  return numbers.reduce((total, number) => total + number, 0);
}

const total: number = sum(firstNumber, secondNumber, thirdNumber);

console.log(total);

const rangeStart: number = 1;
const rangeEnd: number = 10;
const rangeStep: number = 2;

function createRange(
  ...args: [start: number, end: number, step?: number]
): number[] {
  const [start, end, step = 1] = args;
  const result: number[] = [];

  for (let current = start; current <= end; current += step) {
    result.push(current);
  }

  return result;
}

const range: number[] = createRange(rangeStart, rangeEnd, rangeStep);

console.log(range);
