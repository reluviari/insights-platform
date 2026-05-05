import { HttpStatus } from "@foundation/lib";

export enum AuthErrorType {
  BadRequest,
  UserNotFound,
  AccessBlocked,
  PasswordExpired,
  InvalidPassword,
  InternalServerError,
  MissingCaptcha,
  MustResetPassword,
}

export class AuthError extends Error {
  constructor(public type: AuthErrorType, error?: Error) {
    super();
    const errorInfo = errorMap.get(type);
    if (errorInfo) {
      this.message = errorInfo.message + (error != null ? error.toString() : "");
    }
  }
}

export const errorMap = new Map([
  [
    AuthErrorType.BadRequest,
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Email ou senha não enviados para o servidor.",
    },
  ],
  [
    AuthErrorType.UserNotFound,
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Email ou senha invalidos!",
    },
  ],
  [
    AuthErrorType.AccessBlocked,
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Acesso bloqueado, entre em contato com a área de tecnologia.",
    },
  ],
  [
    AuthErrorType.PasswordExpired,
    {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "Sua senha expirou!",
    },
  ],
  [
    AuthErrorType.InvalidPassword,
    {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "Email ou senha invalidos!",
    },
  ],
  [
    AuthErrorType.MissingCaptcha,
    {
      statusCode: HttpStatus.PRECONDITION_FAILED,
      message: "Preencha o Captcha.",
    },
  ],
  [
    AuthErrorType.InternalServerError,
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Erro interno no servidor: ",
    },
  ],
  [
    AuthErrorType.MustResetPassword,
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Sua senha expirou: ",
    },
  ],
]);
