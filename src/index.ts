function firstUnknown(items: unknown[]): unknown {
  return items[0];
}

const value = firstUnknown(["Анна", "Борис"]);

// function firstAny(items: any[]): any {
//   return items[0];
// }

// const unsafe = firstAny(["Анна"]);
// unsafe.nonExistingMethod();

function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const firstName = first(["Анна", "Борис"]);

const maybeName = first<string>([]);

function pair<TFirst, TSecond>(
  first: TFirst,
  second: TSecond,
): [TFirst, TSecond] {
  return [first, second];
}

const entry = pair("age", 30);

function mapArray<TInput, TOutput>(
  items: readonly TInput[],
  transform: (item: TInput, index: number) => TOutput,
): TOutput[] {
  return items.map(transform);
}

const lengths = mapArray(["TypeScript", "React"], (word) => word.length);
