type Status = "draft" | "pending" | "paid" | "cancelled";

type ActiveStatus = Exclude<Status, "cancelled">;

type TerminalStatus = Extract<Status, "paid" | "cancelled">;

type User = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  readonly createdAt: Date;
};

type MaybeUser = User | null | undefined;
type ExistingUser = NonNullable<MaybeUser>;

type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
type MyNonNullable<T> = T extends null | undefined ? never : T;
