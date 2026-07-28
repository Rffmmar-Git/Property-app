function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

export function sanitizePage(
  value?: string | number
): number {
  if (isEmpty(value)) {
    return 1;
  }

  const page =
    typeof value === "number" ? value : Number(value);

  return Number.isInteger(page) && page > 0
    ? page
    : 1;
}

export function sanitizeLimit(
  value?: string | number,
  maxLimit = 100
): number {
  if (isEmpty(value)) {
    return 10;
  }

  const limit =
    typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(limit) || limit <= 0) {
    return 10;
  }

  return Math.min(limit, maxLimit);
}

export function sanitizeSort(
  value?: string
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const sort = value.trim();

  return sort === "" ? undefined : sort;
}

export function sanitizeOrder(
  value?: string
): "asc" | "desc" | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const order = value.trim().toLowerCase();

  if (order === "asc" || order === "desc") {
    return order;
  }

  return undefined;
}