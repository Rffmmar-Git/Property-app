export function sanitizeInteger(
  value?: string | number
): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const result =
    typeof value === "number" ? value : Number(value);

  return Number.isInteger(result) ? result : undefined;
}

export function sanitizePositiveInteger(
  value?: string | number
): number | undefined {
  const result = sanitizeInteger(value);

  if (result === undefined) {
    return undefined;
  }

  return result > 0 ? result : undefined;
}

export function sanitizeDecimal(
  value?: string | number
): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const result =
    typeof value === "number" ? value : Number(value);

  return Number.isNaN(result) ? undefined : result;
}