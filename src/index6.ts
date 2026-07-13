// function getLength(value: string | string[]): number {
//   if (typeof value === "string") {
//     return value.length;
//   }

//   return value.length;
// }

let value: string | number = Math.random() > 0.5 ? "42" : 42;

if (typeof value === "string") {
  value = Number(value);
}

console.log(value.toFixed(2));
