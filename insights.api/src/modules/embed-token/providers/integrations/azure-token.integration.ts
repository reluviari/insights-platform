import axios from "axios";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import azureAuthParamsHelper from "../helpers/azure-token-params.helper";

export async function getAzureToken(): Promise<string> {
  const customerId = process.env.AZURE_TENANT_ID || "";
  const azureApi = process.env.AZURE_API || "";
  const params = azureAuthParamsHelper();

  try {
    const response = await axios.post(`${azureApi}/${customerId}/oauth2/token`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token } = response.data;

    return access_token;
  } catch (error) {
    throw new ResponseError(
      ExceptionsConstants.FAILED_GET_AZURE_TOKEN,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
