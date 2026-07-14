// class EmailNotification {}

// class UrgentEmailNotification extends EmailNotification {}

// class RetryingEmailNotification extends EmailNotification {}

// class UrgentRetryingEmailNotification extends EmailNotification {}

// interface Sender {}

// interface MessageFormatter {}

// interface RetryPolicy {}

// class NotificationService {
//   constructor(
//     private readonly sender: Sender,
//     private readonly formatter: MessageFormatter,
//     private readonly retryPolicy: RetryPolicy,
//   ) {}
// }

interface Sender {
  send(recipient: string, message: string): Promise<void>;
}

interface MessageFormatter {
  format(subject: string, body: string): string;
}

interface RetryPolicy {
  execute(operation: () => Promise<void>): Promise<void>;
}

class EmailSender implements Sender {
  async send(recipient: string, message: string): Promise<void> {
    console.log(`Отправка письма на ${recipient}`);
    console.log(message);
  }
}

class PlainTextFormatter implements MessageFormatter {
  format(subject: string, body: string): string {
    return `${subject}\n\n${body}`;
  }
}

class OneRetryPolicy implements RetryPolicy {
  async execute(operation: () => Promise<void>): Promise<void> {
    try {
      await operation();
    } catch {
      console.log("Первая попытка не удалась. Повторяем.");

      await operation();
    }
  }
}

class NotificationService {
  constructor(
    private readonly sender: Sender,
    private readonly formatter: MessageFormatter,
    private readonly retryPolicy: RetryPolicy,
  ) {}

  async notify(
    recipient: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const message = this.formatter.format(subject, body);

    await this.retryPolicy.execute(() => this.sender.send(recipient, message));
  }
}

const notificationService = new NotificationService(
  new EmailSender(),
  new PlainTextFormatter(),
  new OneRetryPolicy(),
);

notificationService.notify(
  "user@example.com",
  "Важное сообщение",
  "Ваш заказ успешно отправлен.",
);
