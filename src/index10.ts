type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error }
//   | { status: "refreshing" };

type User = {
  id: number;
  name: string;
};

// function assertNever(_value: never): never {
//   throw new Error("Необработанный вариант");
// }

function renderUsers(state: RequestState<User[]>): string {
  switch (state.status) {
    case "idle":
      return "Ожидание";

    case "loading":
      return "Загрузка";

    case "success":
      return `${state.data.length} пользователей`;

    case "error":
      return state.error.message;

    default:
      state satisfies never;
      return "Быть такого не может";
  }
}
