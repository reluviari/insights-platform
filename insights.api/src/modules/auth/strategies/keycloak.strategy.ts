import { JsonWebTokenError, NotBeforeError, TokenExpiredError, decode, verify } from "jsonwebtoken";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpResponse, HttpStatus, ResponseError } from "@foundation/lib";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";
import { keycloakApi } from "@/utils/keycloak-api";
import { Tenant } from "@/modules/tenant/entities/tenant";
import { DecodedAccessToken } from "../interfaces";

export function KeycloakAuthorize() {
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
        const authHeader = headers["Authorization"];

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

const verifyJWTToken = async (jwtToken: string, event: any): Promise<any> => {
  const payload: any = decode(jwtToken);

  const user = await userRepository.findUserByEmail(payload.email, [{ path: "tenant" }]);
  const tenant = user.tenant as Tenant;

  const response = await keycloakApi.get(`/realms/${tenant.realmId}/protocol/openid-connect/certs`);

  if (response?.data?.keys?.length > 0) {
    const publicKeyObj = response.data.keys[0];
    const publicKey = publicKeyObj.x5c[0];
    const formattedPublicKey = `-----BEGIN CERTIFICATE-----\n${publicKey}\n-----END CERTIFICATE-----`;

    return new Promise((resolve, reject) => {
      verify(
        jwtToken,
        formattedPublicKey,
        { algorithms: ["RS256"] },
        async (
          err: JsonWebTokenError | NotBeforeError | TokenExpiredError | string,
          decodedCustomToken: DecodedAccessToken,
        ) => {
          if (err instanceof TokenExpiredError) {
            reject(new ResponseError(ExceptionsConstants.EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED));
          }

          if (err) {
            reject(new ResponseError(ExceptionsConstants.INVALID_TOKEN, HttpStatus.UNAUTHORIZED));
          }

          try {
            await validate(user.createdTokenAt, decodedCustomToken);
            event.user = { id: user._id, email: user.email };
            resolve(event.user);
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  }
};

const validate = async (createdTokenAt: number, jwtPayload: DecodedAccessToken) => {
  const { exp, iat } = jwtPayload;

  const expDateFromUnixTimestamp = new Date(exp * 1000).getTime();
  const now = new Date().getTime();
  const isExpireToken = now >= expDateFromUnixTimestamp;

  if (isExpireToken) {
    throw new ResponseError(ExceptionsConstants.EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED);
  }

  if (createdTokenAt && iat < createdTokenAt) {
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
