type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;
type B = IsString<number>;

type ArrayElement<T> = T extends readonly (infer TItem)[] ? TItem : never;

type Item = ArrayElement<string[]>;
type NumberItem = ArrayElement<number[]>;
type WrongItem = ArrayElement<boolean>;