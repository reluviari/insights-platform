import {
  ClassConstructor,
  ClassTransformOptions,
  Exclude,
  Expose,
  ExposeOptions,
  Transform,
  instanceToInstance,
  plainToInstance,
} from "class-transformer";
import { IsMongoId } from "class-validator";

interface Options extends ClassTransformOptions {
  locale: string;
}

export function TransformMongoId(options?: ExposeOptions) {
  return (target: any, propertyKey: string) => {
    Transform(params => params.obj[propertyKey]?.toString(), options)(target, propertyKey);
  };
}

export class BaseDto {
  static locale?: string;

  @Expose({ name: "id" })
  @IsMongoId()
  @TransformMongoId()
  _id?: string;

  createdAt?: Date;

  updatedAt?: Date;

  @Exclude()
  deletedAt?: Date;

  public static factory<T, R>(
    ResponseDto: ClassConstructor<T>,
    plainResponseData: R,
    options?: Options,
  ): T {
    BaseDto.locale = options?.locale;

    const updatedResponseData = plainToInstance<T, R>(ResponseDto, plainResponseData, {
      enableCircularCheck: true,
    });

    return instanceToInstance(updatedResponseData, {
      ...options,
      excludeExtraneousValues: true,
    });
  }
}
