import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInDto {
  @IsOptional()
  @IsString()
  type?: string;

  urlSlug?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
