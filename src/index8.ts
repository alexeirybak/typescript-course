type Events = {
  userCreated: {
    userId: number;
  };

  orderPaid: {
    orderId: number;
    amount: number;
  };
};

type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void;
};

type Handlers = EventHandlers<Events>;

type StringProperties<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type User = {
  id: number;
  name: string;
  active: boolean;
};

type UserStrings = StringProperties<User>;