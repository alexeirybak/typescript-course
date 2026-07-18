function length<T extends { length: number }>(value: T): number {
  return value.length;
}

function simpleLength(value: { length: number }): number {
  return value.length;
}

function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}
