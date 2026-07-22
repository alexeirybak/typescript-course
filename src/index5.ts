type User = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  readonly createdAt: Date;
};

type NewUser = Omit<User, "id" | "createdAt">;

type MyOmit<T, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>;
