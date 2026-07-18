type HasId = {
  id: string | number;
};

function logIdBroken<T extends HasId>(value: T): T {
  console.log(value.id);
  return value;
}

// logIdBroken(100);

// logIdBroken("Hello");

// logIdBroken(true);

const product = logIdBroken({
  id: 1,
  title: "Клавиатура",
  price: 7500,
});

console.log(product.title);
