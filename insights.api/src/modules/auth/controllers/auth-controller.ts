import { SynchronizeReportsUseCase } from "./../../report/use-cases/synchronize-reports.use-case";
import { Body, ConnectMongoDB, Method } from "@foundation/lib";
import { IAuthService } from "../interfaces";
import { AuthService } from "../services/auth.service";
import {
  DefinePasswordDto,
  GetAccessTokenDto,
  SendMailDefinePasswordDto,
  SignInDto,
} from "../dtos";
import { SignInUseCase } from "../use-cases/sign-in";
import { KeycloakSignInUseCase } from "../use-cases/keycloak-sign-in";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";
import { PBIReportsIntegration } from "@/modules/report/providers/integrations";
import { reportRepository } from "@/modules/report/repositories/mongo/report/report.repository";
import { Headers } from "lib/foundation/methodDecorator";
import { tenantRepository } from "@/modules/tenant/repositories/mongo/tenant/tenant.repository";
import { SendMailDefinePasswordUseCase } from "../use-cases/send-mail-define-password";
import { DefinePasswordUseCase } from "../use-cases/define-password";
import { IResponseValidateToken, TokenValidate } from "@/modules/auth/dtos/token-validate";
import { ValidateTokenUseCase } from "@/modules/auth/use-cases/validate-token";

function headerFirst(headers: Record<string, string>, name: string): string | undefined {
  const target = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === target && value != null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return undefined;
}

export class AuthController {
  constructor(private authService: IAuthService) {}

  @ConnectMongoDB()
  @Method()
  public async auth(
    @Body(SignInDto) body: SignInDto,
    @Headers headers: Record<string, string>,
  ): Promise<GetAccessTokenDto> {
    const urlSlug = headerFirst(headers, "origin");

    const credentials = await this.authService.auth({ ...body, urlSlug });

    return GetAccessTokenDto.factory(GetAccessTokenDto, credentials);
  }

  @ConnectMongoDB()
  @Method()
  public async sendMailDefinePassword(
    @Body(SendMailDefinePasswordDto) body: SendMailDefinePasswordDto,
  ): Promise<void> {
    await this.authService.sendMailDefinePassword(body);
  }

  @ConnectMongoDB()
  @Method()
  public async definePassword(@Body(DefinePasswordDto) body: DefinePasswordDto): Promise<void> {
    await this.authService.definePassword(body);
  }

  @ConnectMongoDB()
  @Method()
  public async tokenValidate(
    @Body(TokenValidate) body: TokenValidate,
  ): Promise<IResponseValidateToken> {
    return await this.authService.tokenValidate(body);
  }
}

const reportIntegration = new PBIReportsIntegration();
const synchronizeReportsUseCase = new SynchronizeReportsUseCase(
  tenantRepository,
  reportRepository,
  reportIntegration,
);
const signInUseCase = new SignInUseCase(userRepository);
const keycloakSignInUseCase = new KeycloakSignInUseCase(userRepository, tenantRepository);
const sendMailDefinePasswordUseCase = new SendMailDefinePasswordUseCase(userRepository);
const definePasswordUseCase = new DefinePasswordUseCase(userRepository);
const validateTokenUseCase = new ValidateTokenUseCase(userRepository);
const authService = new AuthService(
  signInUseCase,
  keycloakSignInUseCase,
  synchronizeReportsUseCase,
  sendMailDefinePasswordUseCase,
  definePasswordUseCase,
  validateTokenUseCase,
);
const controller = new AuthController(authService);

export const auth = controller.auth.bind(controller);
export const sendMailDefinePassword = controller.sendMailDefinePassword.bind(controller);
export const definePassword = controller.definePassword.bind(controller);
export const tokenValidate = controller.tokenValidate.bind(controller);
