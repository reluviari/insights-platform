import { IsNotEmpty, IsString } from "class-validator";

export class EmbedTokenRequestDTO {
  @IsNotEmpty()
  @IsString()
  workspaceId: string;

  @IsNotEmpty()
  @IsString()
  externalId: string;
}
