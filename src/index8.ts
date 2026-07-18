type User = {
  id: number;
  name: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string"
  );
}

function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error("Некорректный пользователь");
  }
}

const payload: unknown = {
  id: 1,
  name: "Анна",
};

assertIsUser(payload);

//console.log(payload.name);

function assertDefined<T>(
  value: T,
  message = "Значение отсутствует",
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

const users: User[] = [
  { id: 1, name: "Анна" },
  { id: 2, name: "Иван" },
];

const user = users.find((item) => item.id === 2);

assertDefined(user, "Пользователь не найден");
console.log(user.name);
