// type Cat = {
//   meow(): void;
// };

// type Dog = {
//   bark(): void;
// };

// type Fish = {
//   swim(): void;
// };

// function makeSound(animal: Cat | Dog | Fish): void {
//   if ("meow" in animal) {
//     animal.meow();
//   } else {
//     animal.bark();
//   }
// }

type Human = {
  meow?: () => void;
  bark?: () => void;
};

function makeSound(animal: Human) {
  if ("meow" in animal && typeof animal.meow === "function") {
    animal.meow();
  }
}
