type AppEvents = {
  "user:created": {
    userId: number;
    name: string;
  };

  "order:paid": {
    orderId: number;
    amount: number;
  };
};

type EventName = keyof AppEvents;
//"user:created" | "order:paid"

type EventEnvelope<K extends EventName> = {
  type: K;
  payload: AppEvents[K];
  timestamp: Date;
};

type UserCreatedEvent = {
  type: "user:created";
  payload: {
    userId: number;
    name: string;
  };
  timestamp: Date;
};

type AnyEvent = {
  [K in EventName]: EventEnvelope<K>;
}[EventName];

// {
//   "user:created":
//     EventEnvelope<"user:created">;

//   "order:paid":
//     EventEnvelope<"order:paid">;
// }

// EventEnvelope<"user:created"> | EventEnvelope<"order:paid">;

function handleEvent(event: AnyEvent): void {
  switch (event.type) {
    case "user:created":
      console.log(event.payload.name);
      break;

    case "order:paid":
      console.log(event.payload.amount);
      break;
  }
}
