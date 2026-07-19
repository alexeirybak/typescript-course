type ToArray<T> = T extends unknown ? T[] : never;

type Numbers = ToArray<number>;

type Distributed = ToArray<string | number>;
// (string[] | number[])

type ToArrayTogether<T> = [T] extends [unknown] ? T[] : never;

type Together = ToArrayTogether<string | number>;
