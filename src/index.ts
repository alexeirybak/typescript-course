type User = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  readonly createdAt: Date;
};

type PartialUser = Partial<User>;

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

const user: User = {
  id: 1,
  name: "Алексей",
  email: "alex@example.com",
  role: "admin",
  createdAt: new Date(),
};

const partialUser1: PartialUser = {};

const partialUser: PartialUser = {
  name: "Алексей",
};

// const user: User = partialUser;
