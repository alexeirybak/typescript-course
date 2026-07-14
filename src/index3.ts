class SafeBankAccount {
  constructor(
    public readonly id: string,
    public owner: string,
    private balance: number,
  ) {
    if (balance < 0) {
      throw new Error("Начальный баланс не может быть отрицательным");
    }
  }

  getBalance(): number {
    return this.balance;
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Сумма пополнения должна быть положительной");
    }

    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Сумма списания должна быть положительной");
    }

    if (amount > this.balance) {
      throw new Error("Недостаточно средств");
    }

    this.balance -= amount;
  }
}

const account = new SafeBankAccount("1", "Анна", 1000);

console.log(account.id);
console.log(account.owner);
console.log(account.getBalance());
console.log(account.withdraw(555));

// constructor(
//   public readonly id: number,
//   public title: string,
//   public category: string,
//   public description: string,
//   private price: number,
//   private discount: number,
//   private stock: number,
// )
