type FunctionResult<T> = T extends (...args: never[]) => infer TResult
  ? TResult
  : never;

function createUser() {
  return {
    id: 1,
    name: "Анна",
  };
}

typeof createUser;

type CreatedUser = FunctionResult<typeof createUser>;

// type CreatedUser = {
//   id: number;
//   name: string;
// };

type PromiseValue<T> = T extends Promise<infer TValue> ? TValue : T;

type AsyncNumber = PromiseValue<Promise<number>>;

type RegularString = PromiseValue<string>;

type Result = Awaited<Promise<Promise<number>>>;