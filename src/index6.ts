interface PaymentProcessorContract {
  pay(amount: number): Promise<string>;
}

abstract class PaymentProcessor implements PaymentProcessorContract {
  constructor(protected readonly merchantId: string) {}

  abstract pay(amount: number): Promise<string>;

  protected validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error("Сумма должна быть положительной");
    }
  }
}

class CardPaymentProcessor extends PaymentProcessor {
  override async pay(amount: number): Promise<string> {
    this.validateAmount(amount);
    return `card-${this.merchantId}-${Date.now()}`;
  }
}

//new PaymentProcessor("shop-1");

const processor = new CardPaymentProcessor("shop-1");

// processor.validateAmount(1000);
