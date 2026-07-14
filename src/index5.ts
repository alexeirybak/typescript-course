// class SafeBankAccount {
//   constructor(
//     public readonly id: string,
//     public owner: string,
//     private balance: number,
//   ) {
//     if (balance < 0) {
//       throw new Error("Начальный баланс не может быть отрицательным");
//     }
//   }

//   getBalance(): number {
//     return this.balance;
//   }

//   deposit(amount: number): void {
//     if (amount <= 0) {
//       throw new Error("Сумма пополнения должна быть положительной");
//     }

//     this.balance += amount;
//   }

//   withdraw(amount: number): void {
//     if (amount <= 0) {
//       throw new Error("Сумма списания должна быть положительной");
//     }

//     if (amount > this.balance) {
//       throw new Error("Недостаточно средств");
//     }

//     this.balance -= amount;
//   }
// }

// const account1 = new SafeBankAccount("1", "Анна", 1000);

// const account2 = new SafeBankAccount("2", "Иван", 500);

// account1.deposit(500);

// class SafeBankAccount {
//   private static nextId = 1;

//   static generateId(): string {
//     return String(this.nextId++);
//   }

//   constructor(
//     public readonly id: string,
//     public owner: string,
//     private balance: number,
//   ) {}

//   getBalance(): number {
//     return this.balance;
//   }
// }

// SafeBankAccount.generateId();

// const account1 = new SafeBankAccount("1", "Анна", 1000);

// // console.log(SafeBankAccount.generateId());
// // console.log(SafeBankAccount.generateId());
// // console.log(SafeBankAccount.generateId());

// const account = new SafeBankAccount(
//   SafeBankAccount.generateId(),
//   "Анна",
//   1000,
// );

// console.log(account.id);

class SafeBankAccount {
  private static nextId = 1;

  private constructor(
    public readonly id: string,
    public owner: string,
    private balance: number,
  ) {}

  static create(owner: string, initialBalance: number): SafeBankAccount {
    if (initialBalance < 0) {
      throw new Error("Начальный баланс не может быть отрицательным");
    }

    return new SafeBankAccount(String(this.nextId++), owner, initialBalance);
  }

  getBalance(): number {
    return this.balance;
  }
}

// new SafeBankAccount("1", "Анна", 1000);

const account = SafeBankAccount.create(
  "Анна",
  1000,
);
