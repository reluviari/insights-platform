import {
  SignInDto,
  GetAccessTokenDto,
  SendMailDefinePasswordDto,
  DefinePasswordDto,
} from "../dtos";
import { IResponseValidateToken, TokenValidate } from "@/modules/auth/dtos/token-validate";

export interface IAuthService {
  auth(body: SignInDto): Promise<GetAccessTokenDto>;
  sendMailDefinePassword(body: SendMailDefinePasswordDto): Promise<void>;
  definePassword(body: DefinePasswordDto): Promise<void>;
  tokenValidate(body: TokenValidate): Promise<IResponseValidateToken>;
}
