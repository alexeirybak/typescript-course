type User = {
  readonly id: number;
  name?: string;
};

const user: User = {
  id: 1,
  name: "Анна",
};

function printUser(user: User): void {
  console.log(`${user.id}: ${user.name}`);
}

printUser(user);
