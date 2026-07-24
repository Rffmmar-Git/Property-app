export function trimString(value?: string): string | undefined {
  return value?.trim();
}

export function normalizeWhitespace(value?: string): string | undefined {
  return value?.replace(/\s+/g, " ").trim();
}

export function emptyToUndefined(value?: string): string | undefined {
  if (!value) return undefined;

  const result = value.trim();

  return result === "" ? undefined : result;
}

export function sanitizeString(value?: string): string | undefined {
  return emptyToUndefined(normalizeWhitespace(value));
}