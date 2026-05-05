import { ITokenIntegration } from "@/modules/embed-token/interfaces";
import { TokenHealthCheckResult } from "../types";

const performTokenHealthCheck = async (
  tokenIntegration: ITokenIntegration,
  workspaceId: string,
  externalId: string,
): Promise<TokenHealthCheckResult> => {
  try {
    const result = await tokenIntegration.getPBIEmbedToken({
      workspaceId,
      externalId,
    });

    return result;
  } catch (error) {
    return null;
  }
};

export default performTokenHealthCheck;
