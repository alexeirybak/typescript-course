type User = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  readonly createdAt: Date;
};

type UserListItem = Pick<User, "id" | "name" | "role">;

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type UserCard = {
  id: number;
  displayName: string;
  roleLabel: string;
};
