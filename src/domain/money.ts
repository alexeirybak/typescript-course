import { roundMoney } from "../internal/rounding.js";

export type Money = {
  amount: number;
  currency: "RUB";
};

export function createMoney(amount: number): Money {
  return {
    amount: roundMoney(amount),
    currency: "RUB",
  };
}

export function addMoney(left: Money, right: Money): Money {
  return {
    amount: roundMoney(left.amount + right.amount),
    currency: "RUB",
  };
}

export function validateAmount( amount: number, ): boolean { return amount >= 0; }
