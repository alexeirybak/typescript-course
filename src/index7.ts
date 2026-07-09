type User = {
  id: number;
  name: string;
  email: string;
};

type CreateUserInput = {
  name: string;
  email: string;
  city: string;
  company?: string;
};

function createUser(input: CreateUserInput): User {
  console.log(input.city);
  console.log(input.company);

  return {
    id: 1,
    name: input.name,
    email: input.email,
  };
}

const user: User = createUser({
  name: "Анна",
  city: "Москва",
  email: "anna@example.com",
});

console.log(user);
