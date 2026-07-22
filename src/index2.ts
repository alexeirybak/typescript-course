type User = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  readonly createdAt: Date;
};

type CompleteUser = Required<User>;

type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

type Example = {
  value: string | undefined;
};

//const user1: Example = {};

// type Example = {
//   value: string | undefined;
// };

type CompleteExample = Required<Example>;
