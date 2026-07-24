function isEmpty(value: unknown): value is undefined | null | "" {
  return value === undefined || value === null || value === "";
}

export function sanitizeDate(
  value?: string | Date
): Date | undefined {
  if (isEmpty(value)) {
    return undefined;
  }

  const result = value instanceof Date ? value : new Date(value);

  return Number.isNaN(result.getTime()) ? undefined : result;
}

export function sanitizeDateOnly(
  value?: string | Date
): Date | undefined {
  const result = sanitizeDate(value);

  if (!result) {
    return undefined;
  }

  return new Date(
    result.getFullYear(),
    result.getMonth(),
    result.getDate()
  );
}