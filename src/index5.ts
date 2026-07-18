function formatError(error: Error | string): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return error;
}

const value: Date | string = new Date();

if (value instanceof Date) {
  console.log(value.getFullYear());
}

interface User {
  name: string;
}

const user = { name: "Алексей" };

// if (user instanceof User) {
//   console.log("Это User");
// }

if ("name" in user) {
  console.log("У объекта есть свойство name");
  console.log(`Имя: ${user.name}`);
}
