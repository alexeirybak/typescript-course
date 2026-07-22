type User = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  readonly createdAt: Date;
};

type ReadonlyUser = Readonly<User>;

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
