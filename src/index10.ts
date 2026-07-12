interface NotificationBase {
  readonly id: string;
  recipientId: number;
  createdAt: Date;
}

type EmailNotification = NotificationBase & {
  channel: "email";
  email: string;
  subject: string;
  body: string;
};

type SmsNotification = NotificationBase & {
  channel: "sms";
  phone: string;
  text: string;
};

type PushNotification = NotificationBase & {
  channel: "push";
  deviceToken: string;
  title: string;
  body: string;
};

type Notification = EmailNotification | SmsNotification | PushNotification;

function getDestination(notification: Notification): string {
  switch (notification.channel) {
    case "email":
      return notification.email;

    case "sms":
      return notification.phone;

    case "push":
      return notification.deviceToken;
  }
}
