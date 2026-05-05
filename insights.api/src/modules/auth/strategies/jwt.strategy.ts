import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { DecodedAccessToken } from "@/modules/auth/interfaces";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ScopeEnum } from "@/modules/auth/enums";
import { HttpResponse, HttpStatus, ResponseError } from "@foundation/lib";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";

export function Authorize() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<unknown> {
      const event = extractEvent(args);

      if (!event) {
        return HttpResponse.error(
          new ResponseError(ExceptionsConstants.TOKEN_NOT_FOUND, HttpStatus.UNAUTHORIZED),
          "Authorize error",
        );
      }
      try {
        const { headers } = event;
        const authHeader = headers["Authorization"] || headers["authorization"];

        if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
          throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const jwtToken = authHeader.substring(7, authHeader.length);

        await verifyJWTToken(jwtToken, event);

        return originalMethod.apply(this, [event, ...args]);
      } catch (error) {
        return HttpResponse.error(error, "Authorize error");
      }
    };
    return descriptor;
  };
}

const verifyJWTToken = (jwtToken: string, event: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      jwtToken,
      process.env.SECRET_TOKEN,
      async (
        err: JsonWebTokenError | NotBeforeError | TokenExpiredError,
        decodedCustomToken: DecodedAccessToken,
      ) => {
        if (err) {
          reject(new ResponseError(ExceptionsConstants.INVALID_TOKEN, HttpStatus.UNAUTHORIZED));
        }

        try {
          await validate(decodedCustomToken);
          event.user = {
            id: decodedCustomToken.id,
            email: decodedCustomToken.email,
            roles: decodedCustomToken.roles,
            urlSlug: decodedCustomToken.urlSlug,
          };
          resolve(event.user);
        } catch (error) {
          reject(error);
        }
      },
    );
  });
};

const validate = async (jwtPayload: DecodedAccessToken) => {
  const { id, scope, exp, iat } = jwtPayload;

  const dateFromUnixTimestamp = new Date(exp * 1000).getTime();
  const now = new Date().getTime();
  const isExpireToken = now >= dateFromUnixTimestamp;

  if (isExpireToken) {
    throw new ResponseError(ExceptionsConstants.EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED);
  }

  if (!scope?.includes(ScopeEnum.USER_ACCESS_TOKEN)) {
    throw new ResponseError(ExceptionsConstants.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
  }

  const user = await userRepository.findUserById(id);

  if (user.createdTokenAt && iat < user.createdTokenAt) {
    throw new ResponseError(ExceptionsConstants.NEW_ACTIVE_TOKEN, HttpStatus.UNAUTHORIZED);
  }
};

function extractEvent(args: any[]): any | null {
  for (const arg of args) {
    if (arg && arg.headers) {
      return arg;
    }
  }
  return null;
}
