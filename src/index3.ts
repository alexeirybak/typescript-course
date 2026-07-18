type Cart = {
  items: string[];
  add(item: string): void;
  remove(item: string): boolean;
};

const cart: Cart = {
  items: [],

  add(item) {
    this.items.push(item);
  },

  remove(item) {
    const index = this.items.indexOf(item);

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  },
};

cart.add("Книга");
const removed = cart.remove("Книга");
const removedAgain = cart.remove("Книга");

console.log(removed);
console.log(removedAgain);

// onClick: (event: MouseEvent) => void;

// type ButtonProps = {
//   label: string;
//   onClick: () => void;
// };


// type Cart = {
//   items: string[];
//   add(item: string): void;
//   remove(item: string): boolean;
// };