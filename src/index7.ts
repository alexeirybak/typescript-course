type User = {
  id: number;
  name: string;
  active: boolean;
};

type Flags<T> = {
  [K in keyof T]: boolean;
};

type UserFlags = Flags<User>;

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type PartialUser = MyPartial<User>;

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

//type ReadonlyUser = MyReadonly<User>;

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type ReadonlyUser = {
  readonly id: number;
  readonly name: string;
};

type EditableUser = Mutable<ReadonlyUser>;

type RequiredFields<T> = {
  [K in keyof T]-?: T[K];
};

type OptionalUser = {
  id?: number;
  name?: string;
};

type RequiredUser = RequiredFields<OptionalUser>;