type CreateUserInput = {
  name: string;
  email: string;
};

function createUser(input: CreateUserInput): void {
  console.log(input);
}

const checkedInput = {
  name: "Анна",
  email: "anna@example.com",
} satisfies CreateUserInput;

const input: CreateUserInput = {
  name: "Анна",
  email: "anna@example.com",
};

// createUser({
//   name: "Анна",
//   email: "anna@example.com",
//   role: "admin",
// });

// const adminInput = {
//   name: "Анна",
//   email: "anna@example.com",
//   role: "admin",
// };

// createUser(adminInput);

type ButtonConfig = {
  variant: "primary" | "secondary";
  label: string;
};

const button = {
  variant: "primary",
  label: "Сохранить",
} satisfies ButtonConfig;
