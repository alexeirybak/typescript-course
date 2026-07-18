function normalizeId(id: string | number): string {
  if (typeof id === "number") {
    return id.toString();
  }

  return id.trim().toLowerCase();
}

// typeof null === "object";

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}