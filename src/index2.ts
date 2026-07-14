class SafeBankAccount {
  readonly id: string;
  public owner: string;
  private balance: number;

  constructor(id: string, owner: string, initialBalance: number) {
    if (initialBalance < 0) {
      throw new Error("Начальный баланс не может быть отрицательным");
    }

    this.id = id;
    this.owner = owner;
    this.balance = initialBalance;
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

// account.id = "2";

// account.owner = "Мария";

// account.balance = 5000;

class SecretBox {
  #secret: string;

  constructor(secret: string) {
    this.#secret = secret;
  }

  reveal(): string {
    return this.#secret;
  }
}

const obj = new SecretBox("секрет");
console.log(obj.reveal());
