import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  IsMongoId,
} from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  passwordToken?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  departmentIds?: string[];
}
