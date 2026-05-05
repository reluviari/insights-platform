import { SynchronizeReportsUseCase } from "@/modules/report/use-cases/synchronize-reports.use-case";
import { DefinePasswordDto, SendMailDefinePasswordDto, SignInDto } from "../dtos";
import { IAuthService } from "../interfaces";
import { KeycloakSignInUseCase } from "../use-cases/keycloak-sign-in";
import { SignInUseCase } from "../use-cases/sign-in";
import { SendMailDefinePasswordUseCase } from "../use-cases/send-mail-define-password";
import { DefinePasswordUseCase } from "../use-cases/define-password";
import { IResponseValidateToken, TokenValidate } from "@/modules/auth/dtos/token-validate";
import { ValidateTokenUseCase } from "@/modules/auth/use-cases/validate-token";

export class AuthService implements IAuthService {
  constructor(
    private signInUseCase: SignInUseCase,
    private keycloakSignInUseCase: KeycloakSignInUseCase,
    private synchronizeReportsUseCase: SynchronizeReportsUseCase,
    private sendMailDefinePasswordUseCase: SendMailDefinePasswordUseCase,
    private definePasswordUseCase: DefinePasswordUseCase,
    private validateTokenuseCase: ValidateTokenUseCase,
  ) {}

  async auth(body: SignInDto) {
    const { type } = body;

    if (type === "keycloak") {
      return this.keycloakSignInUseCase.execute(body);
    }

    const data = await this.signInUseCase.execute(body);

    if (data?.userRoles.includes("ADMIN") && process.env.NODE_ENV === "production") {
      await this.synchronizeReportsUseCase.execute(body.urlSlug);
    }

    return data;
  }

  async sendMailDefinePassword(body: SendMailDefinePasswordDto) {
    await this.sendMailDefinePasswordUseCase.execute(body);
  }

  async definePassword(body: DefinePasswordDto) {
    await this.definePasswordUseCase.execute(body);
  }

  async tokenValidate(body: TokenValidate): Promise<IResponseValidateToken> {
    const { token } = body;
    await this.definePasswordUseCase.verifyJWTToken(token);
    return await this.validateTokenuseCase.execute(token);
  }
}
