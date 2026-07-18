type Product = {
  id: number;
  title: string;
  price: number;
};

function fail(message: string): never {
  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseProduct(value: unknown): Product {
  if (!isRecord(value)) {
    return fail("Product должен быть объектом");
  }

  if (typeof value.id !== "number") {
    return fail("Product.id должен быть числом");
  }

  if (typeof value.title !== "string") {
    return fail("Product.title должен быть строкой");
  }

  if (typeof value.price !== "number") {
    return fail("Product.price должен быть числом");
  }

  return {
    id: value.id,
    title: value.title,
    price: value.price,
  };
}

function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const raw = parseJson('{"id":1,"title":"Клавиатура","price":7500}');
const product = parseProduct(raw);

console.log(product.title);
console.log(product.price.toFixed(2));