/**
 * Best-effort JSON.parse for string leaves that look like JSON objects/arrays.
 * Used for the transaction "Raw" viewer where API fields are often stringified.
 */
export function parseJsonIfString(input: unknown): unknown {
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return input;
    }
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(input) as unknown;
      } catch {
        return input;
      }
    }
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => parseJsonIfString(item));
  }

  if (input !== null && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      out[key] = parseJsonIfString(value);
    }
    return out;
  }

  return input;
}
