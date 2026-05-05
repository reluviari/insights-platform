/**
 * Normalização do evento API Gateway / Lambda usado pelo serverless-offline e pela AWS.
 * Documentação: body costuma vir como string JSON; pode vir base64; em alguns proxies já vem objeto.
 */

export function mergeHeadersAndMultiValue(
  headers?: Record<string, string | undefined>,
  multiValueHeaders?: Record<string, string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      if (value != null && String(value).trim() !== "") {
        out[key] = String(value);
      }
    }
  }

  if (multiValueHeaders) {
    for (const [key, values] of Object.entries(multiValueHeaders)) {
      if (!values?.length) {
        continue;
      }
      const first = values[0];
      if (first == null || String(first).trim() === "") {
        continue;
      }
      const hasSameName = Object.keys(out).some(k => k.toLowerCase() === key.toLowerCase());
      if (!hasSameName) {
        out[key] = String(first);
      }
    }
  }

  return out;
}

/**
 * Devolve o corpo já como objeto JS quando aplicável; strings são interpretadas como JSON.
 */
export function parseApiGatewayJsonBody(event: {
  body?: string | Record<string, unknown> | null;
  isBase64Encoded?: boolean;
}): unknown {
  const { body, isBase64Encoded } = event;

  if (body == null || body === "") {
    return null;
  }

  if (typeof body === "object" && body !== null && !Array.isArray(body)) {
    return body;
  }

  if (typeof body !== "string") {
    return null;
  }

  const text = isBase64Encoded ? Buffer.from(body, "base64").toString("utf8") : body;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new SyntaxError("Invalid JSON in request body");
  }
}
