import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpResponse, HttpStatus, ResponseError } from "@foundation/lib";

export function JwtRoles(methodRoles: string[]) {
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
        const { user } = event;

        const hasAccess = verifyRole(user.roles, methodRoles);

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

const verifyRole = (userRoles: string[], methodRoles: string[]): boolean => {
  if (userRoles && Array.isArray(userRoles)) {
    return hasAccess(userRoles, methodRoles);
  }
};

const hasAccess = (userRoles: string[], methodRoles: string[]): boolean => {
  return userRoles.some(item => methodRoles.includes(item));
};

const extractEvent = (args: any[]): any | null => {
  for (const arg of args) {
    if (arg && arg.headers) {
      return arg;
    }
  }
  return null;
};
