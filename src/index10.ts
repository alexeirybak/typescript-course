type JsonPrimitive = string | number | boolean | null;

type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? {
        readonly [K in keyof T]: DeepReadonly<T[K]>;
      }
    : T extends object
      ? {
          readonly [K in keyof T]: DeepReadonly<T[K]>;
        }
      : T;

type Settings = {
  user: {
    name: string;
    roles: string[];
  };
};

type FrozenSettings = DeepReadonly<Settings>;
