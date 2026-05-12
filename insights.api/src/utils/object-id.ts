export function objectIdToString(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    const objectValue = value as { _id?: unknown; toString?: () => string };

    if (objectValue._id != null) {
      return objectIdToString(objectValue._id);
    }

    if (typeof objectValue.toString === "function") {
      const stringValue = objectValue.toString();
      return stringValue === "[object Object]" ? undefined : stringValue;
    }
  }

  return String(value);
}

export function sameObjectId(left: unknown, right: unknown): boolean {
  const leftId = objectIdToString(left);
  const rightId = objectIdToString(right);

  return Boolean(leftId && rightId && leftId === rightId);
}

export function includesObjectId(values: unknown[] | undefined, id: unknown): boolean {
  return Array.isArray(values) && values.some(value => sameObjectId(value, id));
}
