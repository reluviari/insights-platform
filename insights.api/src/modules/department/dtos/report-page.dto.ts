import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ReportPageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsBoolean()
  visible: boolean;
}
