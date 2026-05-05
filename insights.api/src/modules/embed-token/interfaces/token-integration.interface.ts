import { EmbedTokenInputType } from "../types/embed-token-input.type";

export interface ITokenIntegration {
  getPBIEmbedToken(body: EmbedTokenInputType): Promise<string>;
}
