// // const value: unknown = {
// //   id: 1,
// //   name: "Анна",
// // };

// type User = {
//   id: number;
//   name: string;
// };

// function isRecord(value: unknown): value is Record<string, unknown> {
//   return typeof value === "object" && value !== null;
// }

// function isUser(value: unknown): value is User {
//   return (
//     isRecord(value) &&
//     typeof value.id === "number" &&
//     typeof value.name === "string"
//   );
// }

// if (isUser(value)) {
//   console.log(value.id);
// }

// const values: unknown[] = [
//   { id: 1, name: "Анна" },
//   null,
//   "not user",
//   { id: "2", name: "Иван" },
//   { id: 3, name: "Мария" },
// ];

// const users = values.filter(isUser);

// users.forEach((user) => {
//   console.log(user.id);
//   console.log(user.name);
// });

// function isUserLiar(value: unknown): value is User {
//   return true;
// }

// const value: unknown = 123;

// if (isUserLiar(value)) {
//   console.log(value.name);
// }
