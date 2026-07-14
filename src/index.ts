class BankAccount {
  owner: string;
  balance: number;

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }
}

const account = new BankAccount("Анна", -1000);

account.deposit(500);

console.log(account.balance);