import { EmbedTokenInputType } from "../types/embed-token-input.type";
import { EmbedTokenOutputType } from "../types/embed-token-output.type";

export interface ITokenService {
  embedToken(
    user: { id: string; tenantId: string; roles?: string[] },
    body: EmbedTokenInputType,
  ): Promise<EmbedTokenOutputType>;
}
