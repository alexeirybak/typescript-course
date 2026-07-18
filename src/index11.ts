type CardPayment = {
  method: "card";
  cardToken: string;
};

type BankPayment = {
  method: "bank";
  account: string;
  companyInn: string;
};

type WalletPayment = {
  method: "wallet";
  walletId: string;
};

type Payment = CardPayment | BankPayment | WalletPayment;

const payment: Payment = {
  method: "card",
  cardToken: "token-12345678",
};

function describePayment(payment: Payment): string {
  switch (payment.method) {
    case "card":
      return `Карта: ${payment.cardToken.slice(-4)}`;

    case "bank":
      return `Счёт ${payment.account}, ИНН ${payment.companyInn}`;

    case "wallet":
      return `Кошелёк ${payment.walletId}`;

    // default:
    //   return assertNever(payment);
  }
}