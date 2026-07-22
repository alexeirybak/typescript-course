type User = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  readonly createdAt: Date;
};

async function loadUser(): Promise<User> {
  return {
    id: 1,
    name: "Анна",
    email: "anna@example.com",
    role: "admin",
    createdAt: new Date(),
  };
}

type LoadedUser = Awaited<ReturnType<typeof loadUser>>;
