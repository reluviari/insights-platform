import "reflect-metadata";
import { validate } from "class-validator";
import { HttpResponse, ValidationError } from "./httpResponse";
import { HttpStatus } from "./httpStatus";
import { plainToInstance } from "class-transformer";

const SQS_KEY = "SQS";
const BODY_KEY = "BODY";
const PATH_KEY = "PATH";
const USER_KEY = "USER";
const TOKEN_KEY = "TOKEN";
const QUERY_KEY = "QUERY";
const HEADERS_KEY = "HEADERS";
const SOURCE_IP_KEY = "SOURCE_IP";
const USER_AGENT_KEY = "USER_AGENT";

const setParams = (
  target: any,
  propertyKey: string,
  parameterIndex: number,
  principalKey: string,
) => {
  const params: number[] = Reflect.getOwnMetadata(principalKey, target, propertyKey) || [];
  params.push(parameterIndex);
  Reflect.defineMetadata(principalKey, params, target, propertyKey);
};

export const Body = (DtoClass?: new (...args: any[]) => any) => {
  return (target: any, propertyKey: string, parameterIndex: number): void => {
    setParams(target, propertyKey, parameterIndex, BODY_KEY);
    const existingDtoClasses: any[] =
      Reflect.getOwnMetadata(BODY_KEY + "_DTO", target, propertyKey) || [];
    existingDtoClasses[parameterIndex] = DtoClass;
    Reflect.defineMetadata(BODY_KEY + "_DTO", existingDtoClasses, target, propertyKey);
  };
};

export const Params = (DtoClass?: new (...args: any[]) => any) => {
  return (target: any, propertyKey: string, parameterIndex: number): void => {
    setParams(target, propertyKey, parameterIndex, PATH_KEY);
    const existingDtoClasses: any[] =
      Reflect.getOwnMetadata(PATH_KEY + "_DTO", target, propertyKey) || [];
    existingDtoClasses[parameterIndex] = DtoClass;
    Reflect.defineMetadata(PATH_KEY + "_DTO", existingDtoClasses, target, propertyKey);
  };
};

export const Query = (DtoClass?: new (...args: any[]) => any) => {
  return (target: any, propertyKey: string, parameterIndex: number): void => {
    setParams(target, propertyKey, parameterIndex, QUERY_KEY);
    const existingDtoClasses: any[] =
      Reflect.getOwnMetadata(QUERY_KEY + "_DTO", target, propertyKey) || [];
    existingDtoClasses[parameterIndex] = DtoClass;
    Reflect.defineMetadata(QUERY_KEY + "_DTO", existingDtoClasses, target, propertyKey);
  };
};

export const User = (...args: any[]): void => setParams.apply(undefined, [...args, USER_KEY]);
export const Token = (...args: any[]): void => setParams.apply(undefined, [...args, TOKEN_KEY]);
export const SQSBody = (...args: any[]): void => setParams.apply(undefined, [...args, SQS_KEY]);
export const Headers = (...args: any[]): void => setParams.apply(undefined, [...args, HEADERS_KEY]);
export const SourceIp = (...args: any[]): void =>
  setParams.apply(undefined, [...args, SOURCE_IP_KEY]);
export const UserAgent = (...args: any[]): void =>
  setParams.apply(undefined, [...args, USER_AGENT_KEY]);
export function Method() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<HttpResponse> {
      const { body, user, token, source, Records, headers, requestContext } = args[0];
      let { pathParameters, queryStringParameters } = args[0];

      const { sourceIp, userAgent } = requestContext?.identity || { sourceIp: "", userAgent: "" };
      let isSQSSource = false;

      try {
        if (source === "serverless-plugin-warmup") {
          console.info("[Lib] WarmUp - Lambda is warm!");
          return HttpResponse.success("OK");
        }

        if (pathParameters) {
          console.info("[Lib] PathParams: ", JSON.stringify(pathParameters, null, 2));
        }

        if (queryStringParameters) {
          console.info("[Lib] QueryParams: ", JSON.stringify(queryStringParameters, null, 2));
        }

        let sqsMessages: [] = [];
        if (Records && Records.length) {
          sqsMessages = Records.map((record: { body: string }) => {
            const message = JSON.parse(record.body);
            if (message.TopicArn && message.Message && message.Message.includes('{"')) {
              message.Message = JSON.parse(message.Message);
            }
            return message;
          });

          isSQSSource = true;
          console.info("[Lib] Source SQS: ", JSON.stringify(sqsMessages, null, 2));
        }

        const sqsParams: number[] = Reflect.getOwnMetadata(SQS_KEY, target, propertyKey) || [];
        const bodyParams: number[] = Reflect.getOwnMetadata(BODY_KEY, target, propertyKey) || [];
        const userParams: number[] = Reflect.getOwnMetadata(USER_KEY, target, propertyKey) || [];
        const tokenParams: number[] = Reflect.getOwnMetadata(TOKEN_KEY, target, propertyKey) || [];
        const pathParams: number[] = Reflect.getOwnMetadata(PATH_KEY, target, propertyKey) || [];
        const queryParams: number[] = Reflect.getOwnMetadata(QUERY_KEY, target, propertyKey) || [];
        const headersParams: number[] =
          Reflect.getOwnMetadata(HEADERS_KEY, target, propertyKey) || [];
        const sourceIpParams: number[] =
          Reflect.getOwnMetadata(SOURCE_IP_KEY, target, propertyKey) || [];
        const userAgentParams: number[] =
          Reflect.getOwnMetadata(USER_AGENT_KEY, target, propertyKey) || [];
        const bodyDtoClasses: any[] =
          Reflect.getOwnMetadata(BODY_KEY + "_DTO", target, propertyKey) || [];
        const pathDtoClasses: any[] =
          Reflect.getOwnMetadata(PATH_KEY + "_DTO", target, propertyKey) || [];
        const queryDtoClasses: any[] =
          Reflect.getOwnMetadata(QUERY_KEY + "_DTO", target, propertyKey) || [];

        let parsedBody: any = null;

        if (bodyParams.length && body) {
          parsedBody = JSON.parse(body);
          const DtoClass = bodyDtoClasses[bodyParams[0]];
          if (DtoClass) {
            const dtoInstance = plainToInstance(DtoClass, parsedBody);
            const errors = await validate(dtoInstance);
            if (errors.length > 0) {
              throw new ValidationError(errors, HttpStatus.BAD_REQUEST);
            }
            parsedBody = dtoInstance;
          }
        }

        if (pathParams.length && pathParameters) {
          const DtoClass = pathDtoClasses[pathParams[0]];
          if (DtoClass) {
            const dtoInstance = plainToInstance(DtoClass, pathParameters);
            const errors = await validate(dtoInstance);
            if (errors.length > 0) {
              throw new ValidationError(errors, HttpStatus.BAD_REQUEST);
            }
            pathParameters = dtoInstance;
          }
        }

        if (queryParams.length && queryStringParameters) {
          const DtoClass = queryDtoClasses[queryParams[0]];
          if (DtoClass) {
            const dtoInstance = plainToInstance(DtoClass, queryStringParameters);
            const errors = await validate(dtoInstance);
            if (errors.length > 0) {
              throw new ValidationError(errors, HttpStatus.BAD_REQUEST);
            }
            queryStringParameters = dtoInstance;
          }
        }

        for (const index of userParams) args[index] = user;
        for (const index of tokenParams) args[index] = token;
        for (const index of sqsParams) args[index] = sqsMessages;
        for (const index of bodyParams) args[index] = parsedBody;
        for (const index of pathParams) args[index] = pathParameters || {};
        for (const index of queryParams) args[index] = queryStringParameters || {};
        for (const index of headersParams) args[index] = headers;
        for (const index of sourceIpParams) args[index] = sourceIp;
        for (const index of userAgentParams) args[index] = userAgent;

        const result = await originalMethod.apply(this, args);
        return HttpResponse.success(result);
      } catch (error) {
        const hash = new Date().getTime().toString();
        console.error("[Lib] ControllerError: ", error);
        console.error("[Lib] Hash: ", hash);

        if (isSQSSource) throw new Error(error);
        return HttpResponse.error(error, hash);
      }
    };

    return descriptor;
  };
}
