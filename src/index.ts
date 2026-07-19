type User = {
  id: number;
  name: string;
  active: boolean;
};

type UserKey = keyof User;

//type UserKey = "id" | "name" | "active"

const key1: UserKey = "id";
const key2: UserKey = "name";
const key3: UserKey = "active";

function pickProperty<K extends UserKey>(user: User, key: K): User[K] {
  return user[key];
}

const user: User = {
  id: 1,
  name: "Алексей",
  active: true,
};

// const value = pickProperty(user, "age");

type Scores = {
  [id: number]: number;
};

type ScoreKey = keyof Scores;

type Dictionary = {
  [key: string]: string;
};

type DictionaryKey = keyof Dictionary;
