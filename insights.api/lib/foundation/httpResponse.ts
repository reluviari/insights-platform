import { ValidationError as ClassValidationError } from "class-validator";
import { HttpStatus } from "./httpStatus";

type ResponseType = {
  statusCode: number;
  headers?: unknown;
  body: string;
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export class HttpResponse {
  public static success(
    body?: string | Record<string, unknown>,
    contentType = "application/json",
  ): ResponseType {
    if (typeof body === "object" && body?.statusCode) {
      return body as ResponseType;
    }

    const responseHeaders = { ...headers, "Content-Type": contentType };

    return {
      headers: responseHeaders,
      statusCode: body ? HttpStatus.OK : HttpStatus.NO_CONTENT,
      body: body ? (typeof body === "object" ? JSON.stringify(body) : body) : "",
    };
  }
  public static isResponseError(err: any): err is ResponseError {
    return err instanceof ResponseError;
  }

  public static async error(error: any, hash: string, statusCode?: number): Promise<ResponseType> {
    const status = statusCode || error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const responseHeaders = {
      ...headers,
      "Content-Type": "application/json",
    };

    const body =
      Array.isArray(error?.errors) && error?.errors.length > 0
        ? error.statusCode
          ? { message: error.message, errors: error.errors }
          : { message: "Internal Server Error" }
        : error.statusCode
        ? { message: error.message }
        : { message: "Internal Server Error" };

    return {
      headers: responseHeaders,
      statusCode: status,
      body: JSON.stringify({ ...body, hash }, null, 2),
    };
  }
}

export class ResponseError extends Error {
  public statusCode: HttpStatus;

  constructor(message: string, httpCode: HttpStatus) {
    super(message);
    this.statusCode = httpCode;
  }
}

export class ResponseDatailError extends ResponseError {
  public errors: unknown;

  constructor(message: string, httpCode: HttpStatus, errors: unknown) {
    super(message, httpCode);
    this.errors = errors;
  }
}

export class ValidationError extends ResponseDatailError {
  constructor(errors: ClassValidationError[], statusCode?: HttpStatus, message?: string) {
    super(
      message || "Validation fail",
      statusCode || HttpStatus.UNPROCESSABLE_ENTITY,
      errors
        .map(error => {
          if (!error?.constraints && error?.children.length > 0) {
            return Object.values(
              error?.children.map(child => child.children.map(c => c.constraints).flat()),
            );
          }
          return Object.values(error?.constraints);
        })
        .flat(),
    );
  }
}
