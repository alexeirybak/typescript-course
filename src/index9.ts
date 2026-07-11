type Customer = {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  email: string;
};

type UpdateCustomerCommand = {
  id: number;
  name?: string;
  email?: string;
};

function updateCustomer(
  customer: Customer,
  command: UpdateCustomerCommand,
): Customer {
  if (customer.id !== command.id) {
    throw new Error("Команда относится к другому клиенту");
  }

  return {
    ...customer,
    name: command.name ?? customer.name,
    email: command.email ?? customer.email,
  };
}

const customer: Customer = {
  id: 1,
  createdAt: new Date(),
  name: "Анна",
  email: "anna@example.com",
};

const command: UpdateCustomerCommand = {
  id: 2,
  name: "Анна Петрова",
};

updateCustomer(customer, {
  id: 1,
  name: "Анна Петрова",
});

updateCustomer(customer, {
  id: 1,
  email: "anna.petrova@example.com",
});

//type UpdateCustomerCommand = Partial<Customer>;

// const renameCustomerCommand: UpdateCustomerCommand = {
//   id: 1,
//   name: "Анна Петрова",
// };

// const changeEmailCommand: UpdateCustomerCommand = {
//   id: 1,
//   email: "anna.petrova@example.com",
// };

// const updateCustomerCommand: UpdateCustomerCommand = {
//   id: 1,
//   name: "Анна Петрова",
//   email: "anna.petrova@example.com",
// };
