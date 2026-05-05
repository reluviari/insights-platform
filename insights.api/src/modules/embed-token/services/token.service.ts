import { ITokenService } from "../interfaces/token-service.interface";
import { EmbedTokenInputType } from "../types/embed-token-input.type";
import { EmbedTokenOutputType } from "../types/embed-token-output.type";
import { EmbedTokenUseCase } from "../use-cases/embed-token";

export class EmbedTokenService implements ITokenService {
  constructor(private embedTokenUseCase: EmbedTokenUseCase) {}

  embedToken(userId: string, body: EmbedTokenInputType): Promise<EmbedTokenOutputType> {
    return this.embedTokenUseCase.execute(userId, body);
  }
}
