import { type Money } from "./money.js";

export type Product = {
  id: number;
  title: string;
  price: Money;
};
