import { TypeMail } from "@/providers/enums";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";

export class SendMailDefinePasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(TypeMail)
  type: TypeMail;
}
