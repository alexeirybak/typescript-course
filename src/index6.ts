type User = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  readonly createdAt: Date;
};

type Role = User["role"];

const roleLabels: Record<Role, string> = {
  admin: "Администратор",
  editor: "Редактор",
  viewer: "Наблюдатель",
};

type MyRecord<K extends PropertyKey, V> = {
  [P in K]: V;
};

type OptionalRoleLabels = Partial<Record<Role, string>>;
