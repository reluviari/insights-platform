import { decode } from "jsonwebtoken";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpResponse, HttpStatus, ResponseError } from "@foundation/lib";

export function KeycloakRoles(method: string, route: string) {
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

        if (
          !authHeader ||
          (!authHeader.startsWith("Bearer ") && !authHeader.startsWith("bearer "))
        ) {
          throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const jwtToken = authHeader.substring(7, authHeader.length);

        const hasAccess = verifyRole(jwtToken, method, route);

        if (!hasAccess) {
          throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        return originalMethod.apply(this, [event, ...args]);
      } catch (error) {
        return HttpResponse.error(error, "Authorize error");
      }
    };
    return descriptor;
  };
}

const verifyRole = (jwtToken: string, method: string, route: string): boolean => {
  const payload: any = decode(jwtToken);
  const clientRoles = payload?.realm_access?.roles || [];
  const realmRoles = payload?.resource_access?.["realm-management"]?.roles || [];

  const roles = [...clientRoles, ...realmRoles];

  if (roles && Array.isArray(roles)) {
    return hasAccess(roles, method, route);
  }
};

const hasAccess = (roles: string[], method: string, route: string): boolean => {
  const accessString = `${method}:${route}`;
  return roles.includes(accessString);
};

const extractEvent = (args: any[]): any | null => {
  for (const arg of args) {
    if (arg && arg.headers) {
      return arg;
    }
  }
  return null;
};
