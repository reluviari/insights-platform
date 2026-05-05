import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "../consts/exceptions";
import { AxiosError } from "axios";

interface KeycloakErrorResponse {
  error: string;
  error_description: string;
}

export function keycloakError(err: AxiosError<KeycloakErrorResponse>) {
  const errorCode = err?.response?.data?.error;

  console.error(
    `keycloak error code: ${errorCode}, description: ${err?.response?.data?.error_description}`,
  );

  const mapError = {
    invalid_request: ExceptionsConstants.INVALID_USER_OR_PASSWORD,
    invalid_client: ExceptionsConstants.INVALID_USER_OR_PASSWORD,
    invalid_grant: ExceptionsConstants.INVALID_USER_OR_PASSWORD,
    unauthorized_client: ExceptionsConstants.UNAUTHORIZED,
    unsupported_grant_type: ExceptionsConstants.UNAUTHORIZED,
    invalid_scope: ExceptionsConstants.UNAUTHORIZED,
    server_error: ExceptionsConstants.INTERNAL_SERVER_ERROR,
    temporarily_unavailable: ExceptionsConstants.SERVICE_UNAVAILABLE,
  };

  const statusCodes = {
    [ExceptionsConstants.INVALID_USER_OR_PASSWORD]: HttpStatus.UNAUTHORIZED,
    [ExceptionsConstants.UNAUTHORIZED]: HttpStatus.FORBIDDEN,
    [ExceptionsConstants.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ExceptionsConstants.SERVICE_UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
  };

  const exception = mapError[errorCode] || ExceptionsConstants.UNKNOWN_ERROR;
  const statusCode = statusCodes[exception] || HttpStatus.INTERNAL_SERVER_ERROR;

  throw new ResponseError(exception, statusCode);
}
