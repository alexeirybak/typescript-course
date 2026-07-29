export type Product = {
  id: number;
  title: string;
  price: number;
};

export function calculateDiscountedPrice(
  product: Product,
  percent: number,
): number {
  return product.price * (1 - percent / 100);
}
