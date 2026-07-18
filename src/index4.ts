// function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {
//   return object[key];
// }

// const user = {
//   id: 1,
//   name: "Анна",
//   active: true,
// };

// const userName = getProperty(user, "active");

function setPropertyUnsafe<T, K extends keyof T>(
  object: T,
  key: K,
  value: T[K],
): object {
  return {
    ...object,
    [key]: value,
  };
}

const user = {
  id: 1,
  name: "Анна",
  active: true,
};

const userName = setPropertyUnsafe(user, "id", 2);
