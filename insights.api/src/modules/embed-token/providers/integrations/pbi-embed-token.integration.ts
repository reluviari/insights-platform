import axios from "axios";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

import { EmbedTokenInputType } from "../../types/embed-token-input.type";
import { ITokenIntegration } from "../../interfaces";
import { getAzureToken } from "./azure-token.integration";

export class PBIEmbedTokenIntegration implements ITokenIntegration {
  async getPBIEmbedToken({ workspaceId, externalId }: EmbedTokenInputType): Promise<string> {
    const embedPowerbiURL = String(process.env.EMBED_PBI_API_URL);
    const embedTokenUrl = `
    ${embedPowerbiURL}/v1.0/myorg/groups/${workspaceId}/reports/${externalId}/GenerateToken
    `;

    const body = { accessLevel: "View" };

    try {
      const azureToken = await getAzureToken();

      const response = await axios.post(embedTokenUrl, body, {
        headers: {
          Authorization: `Bearer ${azureToken}`,
          "Content-Type": "application/json",
        },
      });

      const { token } = await response.data;

      return token;
    } catch (error) {
      console.log(error);
      throw new ResponseError(
        ExceptionsConstants.FAILED_GET_EMBED_TOKEN,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
