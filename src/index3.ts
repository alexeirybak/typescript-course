function getPropertyUnsafe(object: object, key: string): unknown {
  return (object as Record<string, unknown>)[key];
}

function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

// {
//   id: number;
//   name: string;
//   active: boolean;
// }

const user = {
  id: 1,
  name: "Анна",
  active: true,
};

// keyof typeof user = "id" | "name" | "active"

// const userName = getProperty(user, "email");