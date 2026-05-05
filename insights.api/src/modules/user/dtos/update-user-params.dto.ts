import { IsMongoId, IsNotEmpty } from "class-validator";

export class UpdateUserParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
