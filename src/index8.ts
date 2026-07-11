type Address = {
  country: string;
  city: string;
  street: string;
  building: string;
  postalCode?: string;
};

type Customer = {
  readonly id: number;
  name: string;
  contacts: {
    email: string;
    phone?: string;
  };
  addresses: readonly Address[];
};

const customer: Customer = {
  id: 1,
  name: "Анна Смирнова",
  contacts: {
    email: "anna@example.com",
  },
  addresses: [
    {
      country: "Россия",
      city: "Москва",
      street: "Тверская",
      building: "15",
    },
  ],
};

if (customer.addresses[0]) {
  customer.addresses[0].city = "Санкт-Петербург";
}

// customer.addresses.push({
//   country: "Россия",
//   city: "Москва",
//   street: "Тверская",
//   building: "1",
// });

function formatAddress(address: Address): string {
  return [address.country, address.city, address.street, address.building].join(
    ", ",
  );
}
