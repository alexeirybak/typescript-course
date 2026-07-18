type User = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
};

const json = `{
  "id": 1,
  "name": "Анна"
}`;

function parseUnsafe<T>(text: string): T {
  return JSON.parse(text) as T;
}

const user = parseUnsafe<User>(json);

console.log(user.name);

const product = parseUnsafe<Product>(json);

console.log(product.title);
console.log(product.price);

// const productFromNothing = parseUnsafe<Product>("null");

// console.log(productFromNothing.title);

function parseUnknown(text: string): unknown {
  return JSON.parse(text);
}

const value = parseUnknown(json);

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string"
  );
}

const parsedValue = parseUnknown(json);

if (isUser(parsedValue)) {
  console.log(parsedValue.name);
}
