// Error model for the Figures API boundary.
// Preserves backend messages verbatim: validation 400s carry `message: string[]`,
// business errors carry `message: string`. Callers distinguish by `status`.

export class FigureApiError extends Error {
  readonly status: number;
  readonly messages: string[];
  readonly raw: unknown;

  constructor(status: number, messages: string[] | string, raw?: unknown) {
    super(Array.isArray(messages) ? messages.join("; ") : messages);
    this.name = "FigureApiError";
    this.status = status;
    this.messages = Array.isArray(messages) ? messages : [messages];
    this.raw = raw;
  }

  get isValidation(): boolean {
    return this.status === 400;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isConflict(): boolean {
    return this.status === 409;
  }
}

export function getFigureErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FigureApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Safely read a JSON body; returns null for empty/non-JSON (e.g. 204). */
export async function readJsonSafe(res: Response): Promise<unknown> {
  try {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractMessages(body: unknown, fallback: string): string[] | string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (Array.isArray(message)) {
      const items = message.filter((m): m is string => typeof m === "string");
      if (items.length > 0) return items;
    }
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}

/** Throw a FigureApiError for a non-OK response, preserving the backend message. */
export async function throwForResponse(
  res: Response,
  path: string,
  fallback: string,
): Promise<never> {
  const body = await readJsonSafe(res);
  throw new FigureApiError(res.status, extractMessages(body, fallback), body ?? { path });
}
