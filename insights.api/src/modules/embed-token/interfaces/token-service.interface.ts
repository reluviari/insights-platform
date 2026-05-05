import { EmbedTokenInputType } from "../types/embed-token-input.type";
import { EmbedTokenOutputType } from "../types/embed-token-output.type";

export interface ITokenService {
  embedToken(userId: string, body: EmbedTokenInputType): Promise<EmbedTokenOutputType>;
}
