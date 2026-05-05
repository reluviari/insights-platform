import { IsNotEmpty, IsString } from "class-validator";

export class TokenValidate {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export interface IResponseValidateToken {
  valid: boolean;
}
